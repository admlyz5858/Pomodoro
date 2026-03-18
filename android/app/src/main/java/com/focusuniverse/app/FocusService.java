package com.focusuniverse.app;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.app.Service;
import android.content.Context;
import android.content.Intent;
import android.os.Build;
import android.os.Handler;
import android.os.IBinder;
import android.os.Looper;
import android.os.PowerManager;

import androidx.core.app.NotificationCompat;

public class FocusService extends Service {

    public static final String CHANNEL_ID = "focus_active";
    private static final int NOTIFICATION_ID = 3001;
    private static final long TICK_MS = 1000;

    public static final String ACTION_START = "com.focusuniverse.FOCUS_START";
    public static final String ACTION_STOP = "com.focusuniverse.FOCUS_STOP";
    public static final String EXTRA_MODE = "mode";
    public static final String EXTRA_REMAINING_MS = "remaining_ms";
    public static final String EXTRA_TOTAL_MS = "total_ms";

    private Handler handler;
    private Runnable tickRunnable;
    private PowerManager.WakeLock wakeLock;

    private String mode = "focus";
    private long remainingMs = 25 * 60 * 1000;
    private long totalMs = 25 * 60 * 1000;
    private boolean running = false;

    @Override
    public void onCreate() {
        super.onCreate();
        handler = new Handler(Looper.getMainLooper());
        createChannel();
        acquireWakeLock();
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        if (intent == null) return START_NOT_STICKY;

        String action = intent.getAction();
        if (ACTION_STOP.equals(action)) {
            stop();
            return START_NOT_STICKY;
        }

        if (ACTION_START.equals(action)) {
            mode = intent.getStringExtra(EXTRA_MODE);
            if (mode == null) mode = "focus";
            remainingMs = intent.getLongExtra(EXTRA_REMAINING_MS, 25 * 60 * 1000);
            totalMs = intent.getLongExtra(EXTRA_TOTAL_MS, 25 * 60 * 1000);
            running = true;

            startForeground(NOTIFICATION_ID, buildNotification());
            startTicking();
        }

        return START_STICKY;
    }

    private void createChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationManager nm = getSystemService(NotificationManager.class);
            if (nm == null) return;

            NotificationChannel ch = new NotificationChannel(
                CHANNEL_ID, "Focus Timer Active",
                NotificationManager.IMPORTANCE_HIGH
            );
            ch.setDescription("Shows active timer on lock screen and AOD");
            ch.setLockscreenVisibility(Notification.VISIBILITY_PUBLIC);
            ch.setShowBadge(true);
            ch.enableVibration(false);
            ch.setSound(null, null);
            ch.setBypassDnd(true);
            nm.createNotificationChannel(ch);
        }
    }

    private void acquireWakeLock() {
        PowerManager pm = (PowerManager) getSystemService(Context.POWER_SERVICE);
        if (pm != null) {
            wakeLock = pm.newWakeLock(
                PowerManager.PARTIAL_WAKE_LOCK,
                "FocusUniverse::TimerWakeLock"
            );
            wakeLock.acquire(120 * 60 * 1000L); // 2 hour max
        }
    }

    private void startTicking() {
        if (tickRunnable != null) handler.removeCallbacks(tickRunnable);

        tickRunnable = new Runnable() {
            @Override
            public void run() {
                if (!running) return;

                remainingMs -= TICK_MS;
                if (remainingMs <= 0) {
                    remainingMs = 0;
                    running = false;
                    updateNotification("✅ " + getModeLabel() + " complete!", "Tap to continue");

                    TimerState state = new TimerState(FocusService.this);
                    state.setStatus("idle");
                    state.setRemainingMs(0);
                    stop();
                    return;
                }

                TimerState state = new TimerState(FocusService.this);
                state.setRemainingMs(remainingMs);

                NotificationManager nm = (NotificationManager) getSystemService(NOTIFICATION_SERVICE);
                if (nm != null) nm.notify(NOTIFICATION_ID, buildNotification());

                handler.postDelayed(this, TICK_MS);
            }
        };

        handler.post(tickRunnable);
    }

    private Notification buildNotification() {
        Intent openApp = new Intent(this, MainActivity.class);
        openApp.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TOP);
        PendingIntent openPi = PendingIntent.getActivity(
            this, 0, openApp,
            PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE
        );

        Intent stopIntent = new Intent(this, FocusService.class);
        stopIntent.setAction(ACTION_STOP);
        PendingIntent stopPi = PendingIntent.getService(
            this, 1, stopIntent,
            PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE
        );

        int progress = totalMs > 0 ? (int)(((totalMs - remainingMs) * 100) / totalMs) : 0;
        String timeStr = formatTime(remainingMs);
        String modeLabel = getModeLabel();
        boolean isFocus = "focus".equals(mode);

        return new NotificationCompat.Builder(this, CHANNEL_ID)
            .setSmallIcon(R.drawable.ic_stat_focus)
            .setContentTitle(modeLabel + "  ⏱ " + timeStr)
            .setContentText(progressBar(progress) + "  " + progress + "%")
            .setSubText(isFocus ? "🧠 Stay focused" : "☕ Take a break")
            .setContentIntent(openPi)
            .setOngoing(true)
            .setSilent(true)
            .setVisibility(NotificationCompat.VISIBILITY_PUBLIC)
            .setPublicVersion(buildPublicVersion(modeLabel, timeStr))
            .setPriority(NotificationCompat.PRIORITY_HIGH)
            .setCategory(NotificationCompat.CATEGORY_PROGRESS)
            .setProgress(100, progress, false)
            .setShowWhen(false)
            .setOnlyAlertOnce(true)
            .setForegroundServiceBehavior(NotificationCompat.FOREGROUND_SERVICE_IMMEDIATE)
            .addAction(R.drawable.ic_stat_focus, "Stop", stopPi)
            .setColor(isFocus ? 0xFF7c6fae : 0xFF6ba89a)
            .build();
    }

    private Notification buildPublicVersion(String modeLabel, String time) {
        return new NotificationCompat.Builder(this, CHANNEL_ID)
            .setSmallIcon(R.drawable.ic_stat_focus)
            .setContentTitle(modeLabel + "  ⏱ " + time)
            .setContentText("Focus Universe")
            .setVisibility(NotificationCompat.VISIBILITY_PUBLIC)
            .build();
    }

    private void updateNotification(String title, String text) {
        Notification n = new NotificationCompat.Builder(this, CHANNEL_ID)
            .setSmallIcon(R.drawable.ic_stat_focus)
            .setContentTitle(title)
            .setContentText(text)
            .setVisibility(NotificationCompat.VISIBILITY_PUBLIC)
            .setPriority(NotificationCompat.PRIORITY_HIGH)
            .setCategory(NotificationCompat.CATEGORY_ALARM)
            .setAutoCancel(true)
            .build();
        NotificationManager nm = (NotificationManager) getSystemService(NOTIFICATION_SERVICE);
        if (nm != null) nm.notify(NOTIFICATION_ID, n);
    }

    private void stop() {
        running = false;
        if (tickRunnable != null) handler.removeCallbacks(tickRunnable);
        if (wakeLock != null && wakeLock.isHeld()) wakeLock.release();
        stopForeground(true);
        stopSelf();
    }

    private String getModeLabel() {
        if ("shortBreak".equals(mode)) return "Short Break";
        if ("longBreak".equals(mode)) return "Long Break";
        return "Focus";
    }

    private String formatTime(long ms) {
        long sec = (ms + 999) / 1000;
        return String.format("%02d:%02d", sec / 60, sec % 60);
    }

    private String progressBar(int pct) {
        int filled = pct / 10;
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < 10; i++) {
            sb.append(i < filled ? "█" : "░");
        }
        return sb.toString();
    }

    @Override
    public IBinder onBind(Intent intent) { return null; }

    @Override
    public void onDestroy() {
        running = false;
        if (tickRunnable != null) handler.removeCallbacks(tickRunnable);
        if (wakeLock != null && wakeLock.isHeld()) wakeLock.release();
        super.onDestroy();
    }
}

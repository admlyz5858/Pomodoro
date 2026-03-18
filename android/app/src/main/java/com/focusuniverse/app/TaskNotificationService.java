package com.focusuniverse.app;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.app.Service;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Build;
import android.os.IBinder;

import androidx.core.app.NotificationCompat;

import org.json.JSONArray;
import org.json.JSONObject;

public class TaskNotificationService extends Service {

    public static final String CHANNEL_ID = "tasks_lockscreen";
    private static final int NOTIFICATION_ID = 2001;
    public static final String ACTION_COMPLETE_TASK = "com.focusuniverse.COMPLETE_TASK";
    public static final String ACTION_REFRESH = "com.focusuniverse.REFRESH_TASKS";
    public static final String ACTION_STOP = "com.focusuniverse.STOP_TASK_SERVICE";
    public static final String EXTRA_TASK_INDEX = "task_index";

    private static final String PREFS_NAME = "focus_universe_tasks";
    private static final String KEY_TASKS_JSON = "tasks_json";
    private static final String KEY_ENABLED = "lock_screen_tasks_enabled";

    @Override
    public void onCreate() {
        super.onCreate();
        createNotificationChannel();
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        if (intent != null) {
            String action = intent.getAction();
            if (ACTION_STOP.equals(action)) {
                stopForeground(true);
                stopSelf();
                return START_NOT_STICKY;
            }
            if (ACTION_COMPLETE_TASK.equals(action)) {
                int index = intent.getIntExtra(EXTRA_TASK_INDEX, -1);
                if (index >= 0) completeTask(index);
            }
        }

        if (!isEnabled()) {
            stopForeground(true);
            stopSelf();
            return START_NOT_STICKY;
        }

        Notification notification = buildNotification();

        startForeground(NOTIFICATION_ID, notification);

        return START_STICKY;
    }

    private void createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationManager manager = getSystemService(NotificationManager.class);
            if (manager == null) return;

            NotificationChannel existing = manager.getNotificationChannel(CHANNEL_ID);
            if (existing != null) {
                manager.deleteNotificationChannel(CHANNEL_ID);
            }

            NotificationChannel channel = new NotificationChannel(
                CHANNEL_ID,
                "Lock Screen Tasks",
                NotificationManager.IMPORTANCE_DEFAULT
            );
            channel.setDescription("Shows your to-do list on the lock screen");
            channel.setShowBadge(true);
            channel.setLockscreenVisibility(Notification.VISIBILITY_PUBLIC);
            channel.enableVibration(false);
            channel.setSound(null, null);
            channel.enableLights(false);

            manager.createNotificationChannel(channel);
        }
    }

    private Notification buildNotification() {
        String[] tasks = getPendingTasks();
        int pendingCount = tasks.length;

        Intent openApp = new Intent(this, MainActivity.class);
        openApp.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TOP);
        PendingIntent openPending = PendingIntent.getActivity(
            this, 0, openApp,
            PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE
        );

        String title = pendingCount > 0
            ? "📋 " + pendingCount + " task" + (pendingCount != 1 ? "s" : "") + " to do"
            : "✅ All tasks complete!";

        NotificationCompat.Builder builder = new NotificationCompat.Builder(this, CHANNEL_ID)
            .setSmallIcon(R.drawable.ic_stat_focus)
            .setContentTitle(title)
            .setContentIntent(openPending)
            .setOngoing(true)
            .setSilent(true)
            .setVisibility(NotificationCompat.VISIBILITY_PUBLIC)
            .setPublicVersion(buildPublicNotification(title, tasks))
            .setPriority(NotificationCompat.PRIORITY_DEFAULT)
            .setCategory(NotificationCompat.CATEGORY_REMINDER)
            .setShowWhen(false)
            .setOnlyAlertOnce(true)
            .setForegroundServiceBehavior(NotificationCompat.FOREGROUND_SERVICE_IMMEDIATE);

        if (pendingCount > 0) {
            NotificationCompat.InboxStyle inboxStyle = new NotificationCompat.InboxStyle();
            inboxStyle.setBigContentTitle(title);

            int maxLines = Math.min(pendingCount, 7);
            for (int i = 0; i < maxLines; i++) {
                inboxStyle.addLine("  ○  " + tasks[i]);
            }

            if (pendingCount > 7) {
                inboxStyle.setSummaryText("+" + (pendingCount - 7) + " more");
            } else {
                inboxStyle.setSummaryText("Focus Universe");
            }

            builder.setStyle(inboxStyle);
            builder.setContentText(tasks[0]);
            builder.setNumber(pendingCount);

            Intent completeIntent = new Intent(this, TaskNotificationService.class);
            completeIntent.setAction(ACTION_COMPLETE_TASK);
            completeIntent.putExtra(EXTRA_TASK_INDEX, 0);
            PendingIntent completePending = PendingIntent.getService(
                this, 100, completeIntent,
                PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE
            );
            builder.addAction(
                R.drawable.ic_stat_focus,
                "✓ Done: " + truncate(tasks[0], 25),
                completePending
            );

            if (pendingCount > 1) {
                Intent complete2 = new Intent(this, TaskNotificationService.class);
                complete2.setAction(ACTION_COMPLETE_TASK);
                complete2.putExtra(EXTRA_TASK_INDEX, 1);
                PendingIntent complete2Pending = PendingIntent.getService(
                    this, 101, complete2,
                    PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE
                );
                builder.addAction(
                    R.drawable.ic_stat_focus,
                    "✓ Done: " + truncate(tasks[1], 25),
                    complete2Pending
                );
            }
        }

        return builder.build();
    }

    private Notification buildPublicNotification(String title, String[] tasks) {
        NotificationCompat.Builder pub = new NotificationCompat.Builder(this, CHANNEL_ID)
            .setSmallIcon(R.drawable.ic_stat_focus)
            .setContentTitle(title)
            .setVisibility(NotificationCompat.VISIBILITY_PUBLIC);

        if (tasks.length > 0) {
            NotificationCompat.InboxStyle inboxStyle = new NotificationCompat.InboxStyle();
            inboxStyle.setBigContentTitle(title);
            int max = Math.min(tasks.length, 5);
            for (int i = 0; i < max; i++) {
                inboxStyle.addLine("  ○  " + tasks[i]);
            }
            pub.setStyle(inboxStyle);
            pub.setContentText(tasks[0]);
        }

        return pub.build();
    }

    private String[] getPendingTasks() {
        SharedPreferences prefs = getSharedPreferences(PREFS_NAME, MODE_PRIVATE);
        String json = prefs.getString(KEY_TASKS_JSON, "[]");

        try {
            JSONArray arr = new JSONArray(json);
            int count = 0;
            for (int i = 0; i < arr.length(); i++) {
                JSONObject obj = arr.getJSONObject(i);
                if (!obj.optBoolean("completed", false)) count++;
            }

            String[] tasks = new String[count];
            int idx = 0;
            for (int i = 0; i < arr.length(); i++) {
                JSONObject obj = arr.getJSONObject(i);
                if (!obj.optBoolean("completed", false)) {
                    String taskTitle = obj.optString("title", "Task");
                    int done = obj.optInt("completedPomodoros", 0);
                    int est = obj.optInt("estimatedPomodoros", 1);
                    tasks[idx++] = taskTitle + "  (" + done + "/" + est + " 🍅)";
                }
            }
            return tasks;
        } catch (Exception e) {
            return new String[0];
        }
    }

    private void completeTask(int index) {
        SharedPreferences prefs = getSharedPreferences(PREFS_NAME, MODE_PRIVATE);
        String json = prefs.getString(KEY_TASKS_JSON, "[]");

        try {
            JSONArray arr = new JSONArray(json);
            int pendingIdx = 0;
            for (int i = 0; i < arr.length(); i++) {
                JSONObject obj = arr.getJSONObject(i);
                if (!obj.optBoolean("completed", false)) {
                    if (pendingIdx == index) {
                        obj.put("completed", true);
                        break;
                    }
                    pendingIdx++;
                }
            }
            prefs.edit().putString(KEY_TASKS_JSON, arr.toString()).apply();
        } catch (Exception e) {
            // ignore
        }

        NotificationManager manager = (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);
        if (manager != null) {
            manager.notify(NOTIFICATION_ID, buildNotification());
        }
    }

    private boolean isEnabled() {
        SharedPreferences prefs = getSharedPreferences(PREFS_NAME, MODE_PRIVATE);
        return prefs.getBoolean(KEY_ENABLED, false);
    }

    private String truncate(String s, int max) {
        if (s.length() <= max) return s;
        return s.substring(0, max) + "…";
    }

    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
    }
}

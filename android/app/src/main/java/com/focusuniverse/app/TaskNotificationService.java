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
import android.widget.RemoteViews;

import androidx.core.app.NotificationCompat;

import org.json.JSONArray;
import org.json.JSONObject;

/**
 * Persistent notification service that shows the to-do list on the lock screen.
 * Inspired by TickTick, Microsoft To Do, and Todoist.
 *
 * Uses VISIBILITY_PUBLIC + ongoing notification so it's always visible,
 * even on the lock screen without unlocking.
 */
public class TaskNotificationService extends Service {

    private static final String CHANNEL_ID = "tasks";
    private static final int NOTIFICATION_ID = 2001;
    public static final String ACTION_COMPLETE_TASK = "com.focusuniverse.COMPLETE_TASK";
    public static final String ACTION_REFRESH = "com.focusuniverse.REFRESH_TASKS";
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
        if (intent != null && ACTION_COMPLETE_TASK.equals(intent.getAction())) {
            int index = intent.getIntExtra(EXTRA_TASK_INDEX, -1);
            if (index >= 0) {
                completeTask(index);
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
            NotificationChannel channel = new NotificationChannel(
                CHANNEL_ID,
                "Tasks",
                NotificationManager.IMPORTANCE_LOW
            );
            channel.setDescription("Your to-do list on the lock screen");
            channel.setShowBadge(false);
            channel.setLockscreenVisibility(Notification.VISIBILITY_PUBLIC);
            channel.enableVibration(false);
            channel.setSound(null, null);

            NotificationManager manager = getSystemService(NotificationManager.class);
            if (manager != null) {
                manager.createNotificationChannel(channel);
            }
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

        NotificationCompat.Builder builder = new NotificationCompat.Builder(this, CHANNEL_ID)
            .setSmallIcon(R.drawable.ic_stat_focus)
            .setContentTitle(pendingCount > 0
                ? pendingCount + " task" + (pendingCount != 1 ? "s" : "") + " remaining"
                : "All tasks complete! ✓")
            .setContentIntent(openPending)
            .setOngoing(true)
            .setVisibility(NotificationCompat.VISIBILITY_PUBLIC)
            .setPriority(NotificationCompat.PRIORITY_LOW)
            .setCategory(NotificationCompat.CATEGORY_STATUS)
            .setShowWhen(false)
            .setOnlyAlertOnce(true);

        if (pendingCount > 0) {
            NotificationCompat.InboxStyle inboxStyle = new NotificationCompat.InboxStyle();
            inboxStyle.setBigContentTitle("📋 Focus Universe Tasks");

            int maxLines = Math.min(pendingCount, 6);
            for (int i = 0; i < maxLines; i++) {
                String prefix = "○  ";
                inboxStyle.addLine(prefix + tasks[i]);
            }

            if (pendingCount > 6) {
                inboxStyle.setSummaryText("+" + (pendingCount - 6) + " more tasks");
            } else {
                inboxStyle.setSummaryText("Tap to open Focus Universe");
            }

            builder.setStyle(inboxStyle);
            builder.setContentText(tasks[0]);
            builder.setNumber(pendingCount);

            if (pendingCount > 0) {
                Intent completeIntent = new Intent(this, TaskNotificationService.class);
                completeIntent.setAction(ACTION_COMPLETE_TASK);
                completeIntent.putExtra(EXTRA_TASK_INDEX, 0);
                PendingIntent completePending = PendingIntent.getService(
                    this, 100, completeIntent,
                    PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE
                );
                builder.addAction(0, "✓ Complete \"" + truncate(tasks[0], 20) + "\"", completePending);
            }

            Intent addIntent = new Intent(this, MainActivity.class);
            addIntent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            addIntent.putExtra("openPanel", "tasks");
            PendingIntent addPending = PendingIntent.getActivity(
                this, 200, addIntent,
                PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE
            );
            builder.addAction(0, "+ Add Task", addPending);
        }

        return builder.build();
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
                    String title = obj.optString("title", "Task");
                    int done = obj.optInt("completedPomodoros", 0);
                    int est = obj.optInt("estimatedPomodoros", 1);
                    tasks[idx++] = title + " (" + done + "/" + est + " 🍅)";
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

            NotificationManager manager = getSystemService(NotificationManager.class);
            if (manager != null) {
                manager.notify(NOTIFICATION_ID, buildNotification());
            }
        } catch (Exception e) {
            // ignore
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
        stopForeground(true);
        super.onDestroy();
    }
}

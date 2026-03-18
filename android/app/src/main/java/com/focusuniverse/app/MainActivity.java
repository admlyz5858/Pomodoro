package com.focusuniverse.app;

import android.Manifest;
import android.content.pm.PackageManager;
import android.os.Build;
import android.os.Bundle;
import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.view.WindowManager;

import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        registerPlugin(WidgetBridge.class);
        super.onCreate(savedInstanceState);

        createNotificationChannels();
        getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
        requestNotificationPermission();
    }

    private void createNotificationChannels() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationManager manager = getSystemService(NotificationManager.class);
            if (manager == null) return;

            NotificationChannel timerChannel = new NotificationChannel(
                "timer", "Timer", NotificationManager.IMPORTANCE_LOW
            );
            timerChannel.setDescription("Focus Universe timer notifications");
            timerChannel.enableVibration(true);
            timerChannel.setShowBadge(true);
            manager.createNotificationChannel(timerChannel);

            NotificationChannel focusChannel = new NotificationChannel(
                FocusService.CHANNEL_ID,
                "Focus Timer Active",
                NotificationManager.IMPORTANCE_HIGH
            );
            focusChannel.setDescription("Active timer on lock screen and AOD");
            focusChannel.setLockscreenVisibility(Notification.VISIBILITY_PUBLIC);
            focusChannel.setShowBadge(true);
            focusChannel.enableVibration(false);
            focusChannel.setSound(null, null);
            focusChannel.setBypassDnd(true);
            manager.createNotificationChannel(focusChannel);

            NotificationChannel tasksChannel = new NotificationChannel(
                "tasks_lockscreen",
                "Lock Screen Tasks",
                NotificationManager.IMPORTANCE_HIGH
            );
            tasksChannel.setDescription("Shows your to-do list on the lock screen");
            tasksChannel.setShowBadge(true);
            tasksChannel.setLockscreenVisibility(Notification.VISIBILITY_PUBLIC);
            tasksChannel.enableVibration(false);
            tasksChannel.setSound(null, null);
            tasksChannel.enableLights(false);
            manager.createNotificationChannel(tasksChannel);
        }
    }

    private void requestNotificationPermission() {
        if (Build.VERSION.SDK_INT >= 33) {
            if (ContextCompat.checkSelfPermission(this, Manifest.permission.POST_NOTIFICATIONS)
                    != PackageManager.PERMISSION_GRANTED) {
                ActivityCompat.requestPermissions(
                    this,
                    new String[]{ Manifest.permission.POST_NOTIFICATIONS },
                    1001
                );
            }
        }
    }
}

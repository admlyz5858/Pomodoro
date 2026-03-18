package com.focusuniverse.app;

import android.Manifest;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.pm.PackageManager;
import android.os.Build;

import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.getcapacitor.annotation.Permission;

@CapacitorPlugin(
    name = "LockScreenTasks",
    permissions = {
        @Permission(
            strings = { Manifest.permission.POST_NOTIFICATIONS },
            alias = "notifications"
        )
    }
)
public class LockScreenTasksBridge extends Plugin {

    private static final String PREFS_NAME = "focus_universe_tasks";
    private static final String KEY_TASKS_JSON = "tasks_json";
    private static final String KEY_ENABLED = "lock_screen_tasks_enabled";

    @PluginMethod()
    public void syncTasks(PluginCall call) {
        String tasksJson = call.getString("tasksJson", "[]");

        SharedPreferences prefs = getContext().getSharedPreferences(PREFS_NAME, 0);
        prefs.edit().putString(KEY_TASKS_JSON, tasksJson).apply();

        refreshNotification();
        call.resolve();
    }

    @PluginMethod()
    public void setEnabled(PluginCall call) {
        boolean enabled = call.getBoolean("enabled", false);

        if (enabled && Build.VERSION.SDK_INT >= 33) {
            if (ContextCompat.checkSelfPermission(getContext(), Manifest.permission.POST_NOTIFICATIONS)
                    != PackageManager.PERMISSION_GRANTED) {
                ActivityCompat.requestPermissions(
                    getActivity(),
                    new String[]{ Manifest.permission.POST_NOTIFICATIONS },
                    1001
                );
            }
        }

        SharedPreferences prefs = getContext().getSharedPreferences(PREFS_NAME, 0);
        prefs.edit().putBoolean(KEY_ENABLED, enabled).apply();

        if (enabled) {
            refreshNotification();
        } else {
            Intent intent = new Intent(getContext(), TaskNotificationService.class);
            intent.setAction(TaskNotificationService.ACTION_STOP);
            getContext().startService(intent);
        }

        call.resolve();
    }

    @PluginMethod()
    public void isEnabled(PluginCall call) {
        SharedPreferences prefs = getContext().getSharedPreferences(PREFS_NAME, 0);
        boolean enabled = prefs.getBoolean(KEY_ENABLED, false);

        JSObject result = new JSObject();
        result.put("enabled", enabled);
        call.resolve(result);
    }

    private void refreshNotification() {
        SharedPreferences prefs = getContext().getSharedPreferences(PREFS_NAME, 0);
        boolean enabled = prefs.getBoolean(KEY_ENABLED, false);
        if (!enabled) return;

        Intent intent = new Intent(getContext(), TaskNotificationService.class);
        intent.setAction(TaskNotificationService.ACTION_REFRESH);

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            getContext().startForegroundService(intent);
        } else {
            getContext().startService(intent);
        }
    }
}

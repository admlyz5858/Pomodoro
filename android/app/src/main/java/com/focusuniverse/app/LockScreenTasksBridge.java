package com.focusuniverse.app;

import android.content.Intent;
import android.content.SharedPreferences;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

/**
 * Capacitor plugin that bridges the web app's task store
 * to the native TaskNotificationService for lock screen display.
 */
@CapacitorPlugin(name = "LockScreenTasks")
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

        SharedPreferences prefs = getContext().getSharedPreferences(PREFS_NAME, 0);
        prefs.edit().putBoolean(KEY_ENABLED, enabled).apply();

        if (enabled) {
            refreshNotification();
        } else {
            Intent intent = new Intent(getContext(), TaskNotificationService.class);
            getContext().stopService(intent);
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

        if (enabled) {
            Intent intent = new Intent(getContext(), TaskNotificationService.class);
            intent.setAction(TaskNotificationService.ACTION_REFRESH);
            getContext().startService(intent);
        }
    }
}

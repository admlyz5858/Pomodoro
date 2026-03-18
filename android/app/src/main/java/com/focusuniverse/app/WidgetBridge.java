package com.focusuniverse.app;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

import android.appwidget.AppWidgetManager;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.os.Build;

@CapacitorPlugin(name = "WidgetBridge")
public class WidgetBridge extends Plugin {

    @PluginMethod()
    public void syncTimerState(PluginCall call) {
        TimerState state = new TimerState(getContext());

        String status = call.getString("status", "idle");
        String mode = call.getString("mode", "focus");
        long remainingMs = call.getLong("remainingMs", 25L * 60 * 1000);
        long totalMs = call.getLong("totalMs", 25L * 60 * 1000);
        int sessionsToday = call.getInt("sessionsToday", 0);
        int streak = call.getInt("streak", 0);

        state.setStatus(status);
        state.setMode(mode);
        state.setRemainingMs(remainingMs);
        state.setTotalMs(totalMs);
        state.setSessionsToday(sessionsToday);
        state.setStreak(streak);
        state.setLastUpdate(System.currentTimeMillis());

        refreshWidget();
        call.resolve();
    }

    @PluginMethod()
    public void getTimerState(PluginCall call) {
        TimerState state = new TimerState(getContext());

        JSObject result = new JSObject();
        result.put("status", state.getStatus());
        result.put("mode", state.getMode());
        result.put("remainingMs", state.getRemainingMs());
        result.put("totalMs", state.getTotalMs());
        result.put("sessionsToday", state.getSessionsToday());
        result.put("streak", state.getStreak());

        call.resolve(result);
    }

    @PluginMethod()
    public void startFocusService(PluginCall call) {
        String mode = call.getString("mode", "focus");
        long remainingMs = call.getLong("remainingMs", 25L * 60 * 1000);
        long totalMs = call.getLong("totalMs", 25L * 60 * 1000);

        Context ctx = getContext();
        Intent intent = new Intent(ctx, FocusService.class);
        intent.setAction(FocusService.ACTION_START);
        intent.putExtra(FocusService.EXTRA_MODE, mode);
        intent.putExtra(FocusService.EXTRA_REMAINING_MS, remainingMs);
        intent.putExtra(FocusService.EXTRA_TOTAL_MS, totalMs);

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            ctx.startForegroundService(intent);
        } else {
            ctx.startService(intent);
        }

        call.resolve();
    }

    @PluginMethod()
    public void stopFocusService(PluginCall call) {
        Context ctx = getContext();
        Intent intent = new Intent(ctx, FocusService.class);
        intent.setAction(FocusService.ACTION_STOP);
        ctx.startService(intent);

        call.resolve();
    }

    private void refreshWidget() {
        AppWidgetManager manager = AppWidgetManager.getInstance(getContext());
        ComponentName widget = new ComponentName(getContext(), TimerWidget.class);
        int[] ids = manager.getAppWidgetIds(widget);
        if (ids.length > 0) {
            Intent intent = new Intent(getContext(), TimerWidget.class);
            intent.setAction(AppWidgetManager.ACTION_APPWIDGET_UPDATE);
            intent.putExtra(AppWidgetManager.EXTRA_APPWIDGET_IDS, ids);
            getContext().sendBroadcast(intent);
        }
    }
}

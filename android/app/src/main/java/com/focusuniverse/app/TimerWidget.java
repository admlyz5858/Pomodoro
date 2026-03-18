package com.focusuniverse.app;

import android.app.PendingIntent;
import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.Context;
import android.content.Intent;
import android.widget.RemoteViews;

public class TimerWidget extends AppWidgetProvider {

    public static final String ACTION_PLAY_PAUSE = "com.focusuniverse.PLAY_PAUSE";
    public static final String ACTION_RESET = "com.focusuniverse.RESET";
    public static final String ACTION_SKIP = "com.focusuniverse.SKIP";

    @Override
    public void onUpdate(Context context, AppWidgetManager appWidgetManager, int[] appWidgetIds) {
        TimerState state = new TimerState(context);

        for (int appWidgetId : appWidgetIds) {
            RemoteViews views = new RemoteViews(context.getPackageName(), R.layout.widget_timer);

            // Timer display
            views.setTextViewText(R.id.widget_timer, state.getFormattedTime());
            views.setTextViewText(R.id.widget_mode, state.getModeLabel());
            views.setTextColor(R.id.widget_mode, state.getModeColor());

            // Progress bar
            views.setProgressBar(R.id.widget_progress_bar, 100, state.getProgressPercent(), false);

            // Status + sessions
            String status = state.getStatus();
            String statusText;
            if ("running".equals(status)) statusText = "Running";
            else if ("paused".equals(status)) statusText = "Paused";
            else statusText = "Ready";
            views.setTextViewText(R.id.widget_status, statusText);

            int sessions = state.getSessionsToday();
            views.setTextViewText(R.id.widget_sessions,
                sessions + " session" + (sessions != 1 ? "s" : "") + " today");

            // Streak
            int streak = state.getStreak();
            views.setTextViewText(R.id.widget_streak,
                streak > 0 ? ("🔥 " + streak) : "");

            // Play/pause button — toggle icon
            if ("running".equals(status)) {
                views.setImageViewResource(R.id.widget_btn_play, R.drawable.ic_pause);
            } else {
                views.setImageViewResource(R.id.widget_btn_play, R.drawable.ic_play);
            }

            // Button intents
            views.setOnClickPendingIntent(R.id.widget_btn_play,
                createActionIntent(context, ACTION_PLAY_PAUSE));
            views.setOnClickPendingIntent(R.id.widget_btn_reset,
                createActionIntent(context, ACTION_RESET));
            views.setOnClickPendingIntent(R.id.widget_btn_skip,
                createActionIntent(context, ACTION_SKIP));

            // Tap timer text → open app
            Intent openApp = new Intent(context, MainActivity.class);
            PendingIntent openPending = PendingIntent.getActivity(
                context, 0, openApp, PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
            views.setOnClickPendingIntent(R.id.widget_timer, openPending);

            appWidgetManager.updateAppWidget(appWidgetId, views);
        }
    }

    @Override
    public void onEnabled(Context context) {
        super.onEnabled(context);
        startService(context);
    }

    @Override
    public void onReceive(Context context, Intent intent) {
        super.onReceive(context, intent);

        String action = intent.getAction();
        if (action != null && (action.equals(ACTION_PLAY_PAUSE) ||
            action.equals(ACTION_RESET) || action.equals(ACTION_SKIP))) {

            Intent serviceIntent = new Intent(context, TimerWidgetService.class);
            serviceIntent.setAction(action);
            context.startService(serviceIntent);
        }
    }

    @Override
    public void onDisabled(Context context) {
        super.onDisabled(context);
        context.stopService(new Intent(context, TimerWidgetService.class));
    }

    private PendingIntent createActionIntent(Context context, String action) {
        Intent intent = new Intent(context, TimerWidget.class);
        intent.setAction(action);
        return PendingIntent.getBroadcast(context, action.hashCode(), intent,
            PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
    }

    private void startService(Context context) {
        Intent serviceIntent = new Intent(context, TimerWidgetService.class);
        context.startService(serviceIntent);
    }
}

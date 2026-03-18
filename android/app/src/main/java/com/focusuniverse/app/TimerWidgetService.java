package com.focusuniverse.app;

import android.app.Service;
import android.appwidget.AppWidgetManager;
import android.content.ComponentName;
import android.content.Intent;
import android.os.Handler;
import android.os.IBinder;
import android.os.Looper;

/**
 * Background service that ticks the widget every second while timer is running.
 */
public class TimerWidgetService extends Service {
    private static final long TICK_INTERVAL = 1000;
    private Handler handler;
    private Runnable tickRunnable;
    private TimerState timerState;
    private boolean isRunning = false;

    @Override
    public void onCreate() {
        super.onCreate();
        handler = new Handler(Looper.getMainLooper());
        timerState = new TimerState(this);
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        if (intent != null) {
            String action = intent.getAction();
            if (action != null) {
                handleAction(action);
            }
        }
        startTicking();
        return START_STICKY;
    }

    private void handleAction(String action) {
        switch (action) {
            case TimerWidget.ACTION_PLAY_PAUSE:
                String status = timerState.getStatus();
                if ("running".equals(status)) {
                    timerState.setStatus("paused");
                } else {
                    timerState.setStatus("running");
                    timerState.setLastUpdate(System.currentTimeMillis());
                }
                updateWidget();
                break;

            case TimerWidget.ACTION_RESET:
                timerState.setStatus("idle");
                timerState.setRemainingMs(timerState.getTotalMs());
                updateWidget();
                break;

            case TimerWidget.ACTION_SKIP:
                String mode = timerState.getMode();
                if ("focus".equals(mode)) {
                    timerState.setMode("shortBreak");
                    timerState.setTotalMs(5 * 60 * 1000);
                    timerState.setRemainingMs(5 * 60 * 1000);
                } else {
                    timerState.setMode("focus");
                    timerState.setTotalMs(25 * 60 * 1000);
                    timerState.setRemainingMs(25 * 60 * 1000);
                }
                timerState.setStatus("idle");
                updateWidget();
                break;
        }
    }

    private void startTicking() {
        if (isRunning) return;
        isRunning = true;

        tickRunnable = new Runnable() {
            @Override
            public void run() {
                if (!isRunning) return;

                String status = timerState.getStatus();
                if ("running".equals(status)) {
                    long now = System.currentTimeMillis();
                    long lastUpdate = timerState.getLastUpdate();
                    if (lastUpdate > 0) {
                        long elapsed = now - lastUpdate;
                        long remaining = timerState.getRemainingMs() - elapsed;

                        if (remaining <= 0) {
                            remaining = 0;
                            timerState.setStatus("idle");

                            String mode = timerState.getMode();
                            if ("focus".equals(mode)) {
                                timerState.setSessionsToday(timerState.getSessionsToday() + 1);
                                timerState.setMode("shortBreak");
                                timerState.setTotalMs(5 * 60 * 1000);
                                timerState.setRemainingMs(5 * 60 * 1000);
                            } else {
                                timerState.setMode("focus");
                                timerState.setTotalMs(25 * 60 * 1000);
                                timerState.setRemainingMs(25 * 60 * 1000);
                            }
                        } else {
                            timerState.setRemainingMs(remaining);
                        }
                    }
                    timerState.setLastUpdate(now);
                }

                updateWidget();
                handler.postDelayed(this, TICK_INTERVAL);
            }
        };

        handler.post(tickRunnable);
    }

    private void updateWidget() {
        AppWidgetManager manager = AppWidgetManager.getInstance(this);
        ComponentName widget = new ComponentName(this, TimerWidget.class);
        int[] ids = manager.getAppWidgetIds(widget);
        if (ids.length > 0) {
            Intent updateIntent = new Intent(this, TimerWidget.class);
            updateIntent.setAction(AppWidgetManager.ACTION_APPWIDGET_UPDATE);
            updateIntent.putExtra(AppWidgetManager.EXTRA_APPWIDGET_IDS, ids);
            sendBroadcast(updateIntent);
        }
    }

    @Override
    public void onDestroy() {
        isRunning = false;
        if (handler != null && tickRunnable != null) {
            handler.removeCallbacks(tickRunnable);
        }
        super.onDestroy();
    }

    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }
}

package com.focusuniverse.app;

import android.content.Context;
import android.content.SharedPreferences;

/**
 * Shared timer state bridge between WebView and native widget.
 * The web app writes state here via Capacitor plugin or JS bridge,
 * and the widget reads it for display.
 */
public class TimerState {
    private static final String PREFS_NAME = "focus_universe_timer";
    private static final String KEY_STATUS = "status";
    private static final String KEY_MODE = "mode";
    private static final String KEY_REMAINING_MS = "remaining_ms";
    private static final String KEY_TOTAL_MS = "total_ms";
    private static final String KEY_SESSIONS_TODAY = "sessions_today";
    private static final String KEY_STREAK = "streak";
    private static final String KEY_LAST_UPDATE = "last_update";

    private final SharedPreferences prefs;

    public TimerState(Context context) {
        prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);
    }

    public String getStatus() {
        return prefs.getString(KEY_STATUS, "idle");
    }

    public void setStatus(String status) {
        prefs.edit().putString(KEY_STATUS, status).apply();
    }

    public String getMode() {
        return prefs.getString(KEY_MODE, "focus");
    }

    public void setMode(String mode) {
        prefs.edit().putString(KEY_MODE, mode).apply();
    }

    public long getRemainingMs() {
        return prefs.getLong(KEY_REMAINING_MS, 25 * 60 * 1000);
    }

    public void setRemainingMs(long ms) {
        prefs.edit().putLong(KEY_REMAINING_MS, ms).apply();
    }

    public long getTotalMs() {
        return prefs.getLong(KEY_TOTAL_MS, 25 * 60 * 1000);
    }

    public void setTotalMs(long ms) {
        prefs.edit().putLong(KEY_TOTAL_MS, ms).apply();
    }

    public int getSessionsToday() {
        return prefs.getInt(KEY_SESSIONS_TODAY, 0);
    }

    public void setSessionsToday(int count) {
        prefs.edit().putInt(KEY_SESSIONS_TODAY, count).apply();
    }

    public int getStreak() {
        return prefs.getInt(KEY_STREAK, 0);
    }

    public void setStreak(int streak) {
        prefs.edit().putInt(KEY_STREAK, streak).apply();
    }

    public long getLastUpdate() {
        return prefs.getLong(KEY_LAST_UPDATE, 0);
    }

    public void setLastUpdate(long timestamp) {
        prefs.edit().putLong(KEY_LAST_UPDATE, timestamp).apply();
    }

    public int getProgressPercent() {
        long total = getTotalMs();
        if (total <= 0) return 0;
        long remaining = getRemainingMs();
        return (int) (((total - remaining) * 100) / total);
    }

    public String getFormattedTime() {
        long ms = getRemainingMs();
        long totalSeconds = (ms + 999) / 1000;
        long minutes = totalSeconds / 60;
        long seconds = totalSeconds % 60;
        return String.format("%02d:%02d", minutes, seconds);
    }

    public String getModeLabel() {
        String mode = getMode();
        switch (mode) {
            case "shortBreak": return "SHORT BREAK";
            case "longBreak": return "LONG BREAK";
            default: return "FOCUS";
        }
    }

    public int getModeColor() {
        String mode = getMode();
        if (mode.contains("Break")) return 0xFF6ba89a;
        return 0xFF7c6fae;
    }
}

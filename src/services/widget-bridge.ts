import { Capacitor, registerPlugin } from '@capacitor/core';

interface WidgetBridgePlugin {
  syncTimerState(options: {
    status: string;
    mode: string;
    remainingMs: number;
    totalMs: number;
    sessionsToday: number;
    streak: number;
  }): Promise<void>;
  getTimerState(): Promise<{
    status: string;
    mode: string;
    remainingMs: number;
    totalMs: number;
    sessionsToday: number;
    streak: number;
  }>;
  startFocusService(options: {
    mode: string;
    remainingMs: number;
    totalMs: number;
  }): Promise<void>;
  stopFocusService(): Promise<void>;
}

const WidgetBridge = Capacitor.isNativePlatform()
  ? registerPlugin<WidgetBridgePlugin>('WidgetBridge')
  : null;

export async function syncWidgetState(data: {
  status: string;
  mode: string;
  remainingMs: number;
  totalMs: number;
  sessionsToday: number;
  streak: number;
}): Promise<void> {
  if (!WidgetBridge) return;
  try {
    await WidgetBridge.syncTimerState(data);
  } catch {
    // Widget bridge not available
  }
}

export async function startNativeTimer(mode: string, remainingMs: number, totalMs: number): Promise<void> {
  if (!WidgetBridge) return;
  try {
    await WidgetBridge.startFocusService({ mode, remainingMs, totalMs });
  } catch {
    // Service not available
  }
}

export async function stopNativeTimer(): Promise<void> {
  if (!WidgetBridge) return;
  try {
    await WidgetBridge.stopFocusService();
  } catch {
    // Service not available
  }
}

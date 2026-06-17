'use client';
/**
 * @fileOverview A central event emitter for surfacing Firebase-specific errors to the UI.
 */

type ErrorListener = (error: any) => void;

class ErrorEmitter {
  private listeners: Record<string, ErrorListener[]> = {};

  on(event: 'permission-error', listener: ErrorListener) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(listener);
    return () => this.off(event, listener);
  }

  off(event: 'permission-error', listener: ErrorListener) {
    if (!this.listeners[event]) return;
    this.listeners[event] = this.listeners[event].filter((l) => l !== listener);
  }

  emit(event: 'permission-error', error: any) {
    if (!this.listeners[event]) return;
    this.listeners[event].forEach((listener) => listener(error));
  }
}

export const errorEmitter = new ErrorEmitter();

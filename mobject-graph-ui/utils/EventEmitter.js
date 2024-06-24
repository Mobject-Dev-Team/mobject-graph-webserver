export class EventEmitter {
  constructor() {
    this.listeners = {};
  }

  on(eventName, listener) {
    if (!this.listeners[eventName]) {
      this.listeners[eventName] = [];
    }
    this.listeners[eventName].push(listener);
  }

  off(eventName, listener) {
    const listeners = this.listeners[eventName];
    if (!listeners) return;
    const index = listeners.indexOf(listener);
    if (index !== -1) {
      listeners.splice(index, 1);
    }
  }

  emit(eventName, ...args) {
    const listeners = this.listeners[eventName];
    if (!listeners) return;
    listeners.forEach((listener) => {
      listener(...args);
    });
  }
}

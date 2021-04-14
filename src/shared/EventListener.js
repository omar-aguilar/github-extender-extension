class EventListener {
  constructor() {
    this.listeners = {};
  }

  hasEventListener(event, handler) {
    const listeners = this.listeners[event] || [];
    return listeners.some(listenerHandler => listenerHandler === handler);
  }

  addEventListener(event, handler) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    if (!this.hasEventListener(event, handler)) {
      this.subscriptions[event].push(handler);
    }
  }
}

export default EventListener;

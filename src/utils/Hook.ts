function Hook<T>(args?: EventHook.Arguments<T>): EventHook.Hook<T> {
  const subscriptions: EventHook.Subscriptions<T> = [];

  function isAlreadySubscribed(handler: EventHook.HandlerFn<T>): boolean {
    return subscriptions.some((subscription) => subscription.handler === handler);
  }

  function tap(name: string, handler: EventHook.HandlerFn<T>): void {
    if (isAlreadySubscribed(handler)) {
      return;
    }
    subscriptions.push({ name, handler });
  }

  function call(...callArgs: EventHook.AsArray<T>): void {
    subscriptions.forEach((subscription) => {
      subscription.handler(...callArgs);
    });
  }

  return {
    tap,
    call,
  };
}

export default Hook;

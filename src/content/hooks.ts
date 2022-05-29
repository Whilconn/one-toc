import { useState, useEffect } from 'react';

export function useTitle() {
  const [title, setTitle] = useState(document.title);
  const target = document.querySelector('title');
  const observer = new MutationObserver(() => setTitle(document.title));
  observer.observe(target as Node, { childList: true });
  return title;
}

export function useEventListener(target: EventTarget, eventName: string, handler: EventListener) {
  useEffect(() => {
    target.addEventListener(eventName, handler);
    return () => target.removeEventListener(eventName, handler);
  }, [target, eventName, handler]);
}

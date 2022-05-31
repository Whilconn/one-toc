import { useEffect, useState } from 'react';

export function useTitle() {
  const [title, setTitle] = useState(document.title);
  useEffect(() => {
    const target = document.querySelector('title');
    if (!target) return;

    const observer = new MutationObserver(() => setTitle(document.title));
    observer.observe(target as Node, { childList: true });
    return () => observer.disconnect();
  }, []);
  return title;
}

export function useEventListener(target: EventTarget, eventName: string, handler: EventListener) {
  useEffect(() => {
    target.addEventListener(eventName, handler);
    return () => target.removeEventListener(eventName, handler);
  }, [target, eventName, handler]);
}

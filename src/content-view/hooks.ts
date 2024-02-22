import { useEffect, useState } from 'react';

export function useTitle() {
  const [title, setTitle] = useState(document.title);

  // 监听 title 变化
  useEffect(() => {
    const target = document.querySelector('title');
    if (!target) return;

    const observer = new MutationObserver(() => setTitle(document.title));
    observer.observe(target as Node, { childList: true });
    return () => observer.disconnect();
  }, []);

  // 兼容特殊情况，使用 window.navigation api 需要浏览器版本 > 102
  // 参考：https://developer.chrome.com/docs/web-platform/navigation-api/
  useEffect(() => {
    const navigation = window.navigation;
    if (!navigation) return;

    const evtName = 'navigatesuccess';
    const handler = () => {
      setTimeout(() => setTitle(document.title), 500);
    };

    navigation.addEventListener(evtName, handler);
    return () => navigation.removeEventListener(evtName, handler);
  }, []);

  return title;
}

export function useEventListener(
  target: EventTarget,
  eventName: string,
  handler: (evt: Event) => unknown | Promise<unknown>,
) {
  useEffect(() => {
    target.addEventListener(eventName, handler);
    return () => target.removeEventListener(eventName, handler);
  }, [target, eventName, handler]);
}

import interact from 'interactjs';
import { useEffect } from 'react';
import { Element } from '@interactjs/core/types';
import { DragEvent } from '@interactjs/actions/drag/plugin';
import { ResizeEvent } from '@interactjs/actions/resize/plugin';

export function useDragResize(opts: Options) {
  useEffect(() => {
    const { containerSelector, dragSelector, dragDisabled, resizeDisabled } = opts;

    const MW = window.innerWidth;
    const MH = window.innerHeight;

    /* eslint-disable */

    function getTranslate(node: Element) {
      const transform: any = (node as any).computedStyleMap().get('transform');
      if (!transform?.length) return null;

      const translate: any = transform.toMatrix();
      return { x: translate.m41 as number, y: translate.m42 as number };
    }

    /* eslint-enable */

    function setTranslate(node: Element, x: number, y: number) {
      node.style.transform = `translate(${x}px, ${y}px)`;
    }

    function startHandler(node: Element) {
      const translate = getTranslate(node);
      if (!translate) setTranslate(node, 0, 0);
    }

    const interactable = interact(containerSelector);

    interactable.draggable({
      allowFrom: dragSelector,
      enabled: !dragDisabled,
      modifiers: [
        interact.modifiers.restrictRect({
          restriction: new DOMRect(0, 0, MW, MH),
        }),
      ],
      listeners: {
        start(event: DragEvent) {
          startHandler(event.target);
        },
        move(event: DragEvent) {
          const translate = getTranslate(event.target);
          if (!translate) return;

          const { x, y } = translate;
          setTranslate(event.target, x + event.dx, y + event.dy);
        },
      },
    });

    // Warning: box-sizing 需要设置为 border-box！否则会出现宽高跳跃性变化！
    interactable.resizable({
      enabled: !resizeDisabled,
      edges: { left: true, right: true },
      modifiers: [
        interact.modifiers.restrictSize({
          min: { width: 300, height: 100 },
          max: { width: 0.8 * MW, height: 0.8 * MH },
        }),
      ],
      listeners: {
        start(event: ResizeEvent) {
          startHandler(event.target);
        },
        move: function (event: ResizeEvent) {
          const translate = getTranslate(event.target);
          if (!translate) return;

          // update width and height
          Object.assign(event.target.style, {
            width: `${event.rect.width}px`,
            height: `${event.rect.height}px`,
          });

          // update translate
          let { x, y } = translate;
          x += event.deltaRect?.left || 0;
          y += event.deltaRect?.top || 0;

          setTranslate(event.target, x, y);
        },
      },
    });

    return () => interactable.unset();
  }, [opts]);
}

type Options = {
  containerSelector: string;
  dragSelector: string;
  dragDisabled: boolean;
  resizeDisabled: boolean;
};

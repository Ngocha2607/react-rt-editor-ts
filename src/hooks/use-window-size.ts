import { useEffect, useState } from 'react';
interface VisualViewport {
  width: number;
  height: number;
  offsetLeft: number;
  offsetTop: number;
  pageLeft: number;
  pageTop: number;
  scale: number;
  onresize: ((this: VisualViewport, ev: Event) => any) | null;
  onscroll: ((this: VisualViewport, ev: Event) => any) | null;
  addEventListener(
    type: 'resize' | 'scroll',
    listener: (this: VisualViewport, ev: Event) => any,
    options?: boolean | AddEventListenerOptions,
  ): void;
  removeEventListener(
    type: 'resize' | 'scroll',
    listener: (this: VisualViewport, ev: Event) => any,
    options?: boolean | EventListenerOptions,
  ): void;
}
interface ViewportSize {
  width: number;
  height: number;
  offsetTop: number;
}

export function useWindowSize(): ViewportSize {
  const [size, setSize] = useState<ViewportSize>({
    width: 0,
    height: 0,
    offsetTop: 0,
  });

  useEffect(() => {
    const updateSize = () => {
      const vv = (window as Window & { visualViewport?: VisualViewport })
        .visualViewport;
      if (!vv) return;

      const { width, height, offsetTop } = vv;

      setSize((prev) =>
        width === prev.width &&
        height === prev.height &&
        offsetTop === prev.offsetTop
          ? prev
          : { width, height, offsetTop },
      );
    };

    const vv = (window as Window & { visualViewport?: VisualViewport })
      .visualViewport;
    vv?.addEventListener('resize', updateSize);
    vv?.addEventListener('scroll', updateSize);

    updateSize();

    return () => {
      vv?.removeEventListener('resize', updateSize);
      vv?.removeEventListener('scroll', updateSize);
    };
  }, []);

  return size;
}

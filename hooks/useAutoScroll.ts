import { useEffect, useRef, type RefObject } from "react";

export function useAutoScroll(
    containerRef: RefObject<HTMLDivElement | null>,
    deps: unknown[]
) {
    const nearBottom = useRef(true);

    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;

        const handler = () => {
            nearBottom.current = el.scrollHeight - el.scrollTop - el.clientHeight < 150;
        };

        el.addEventListener("scroll", handler, { passive: true });
        return () => el.removeEventListener("scroll", handler);
    }, [containerRef]);

    useEffect(() => {
        if (nearBottom.current && containerRef.current) {
            containerRef.current.scrollTo({
                top: containerRef.current.scrollHeight,
                behavior: "smooth",
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, deps);
}

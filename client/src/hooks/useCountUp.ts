"use client";
import { useEffect, useRef, useState } from 'react';

interface UseCountUpOptions {
    target: number;
    duration?: number;    // ms, default 1200
    delay?: number;       // ms, default 0
    prefix?: string;
    suffix?: string;
}

/**
 * Animates a number from 0 to `target` when the element enters the viewport.
 * Returns { ref, displayValue } – attach ref to the container element.
 */
export function useCountUp({
    target,
    duration = 1200,
    delay = 0,
    prefix = '',
    suffix = '',
}: UseCountUpOptions) {
    const [count, setCount] = useState(0);
    const [started, setStarted] = useState(false);
    const ref = useRef<HTMLElement | null>(null);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting && !started) setStarted(true); },
            { threshold: 0.3 }
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, [started]);

    useEffect(() => {
        if (!started) return;

        let startTime: number;
        let frame: number;

        const startAnimation = () => {
            const animate = (timestamp: number) => {
                if (!startTime) startTime = timestamp;
                const elapsed = timestamp - startTime;
                const progress = Math.min(elapsed / duration, 1);

                // Ease out cubic
                const eased = 1 - Math.pow(1 - progress, 3);
                setCount(Math.floor(eased * target));

                if (progress < 1) {
                    frame = requestAnimationFrame(animate);
                } else {
                    setCount(target);
                }
            };
            frame = requestAnimationFrame(animate);
        };

        if (delay > 0) {
            const timer = setTimeout(startAnimation, delay);
            return () => { clearTimeout(timer); cancelAnimationFrame(frame); };
        } else {
            startAnimation();
            return () => cancelAnimationFrame(frame);
        }
    }, [started, target, duration, delay]);

    const displayValue = `${prefix}${count.toLocaleString()}${suffix}`;
    return { ref, displayValue, rawValue: count };
}

/**
 * Simpler version: just returns the animated string from 0 to target.
 * No observer – starts immediately on mount (use in cards that are already visible).
 */
export function useCountUpImmediate(target: number, duration = 800, delay = 0) {
    const [count, setCount] = useState(0);

    useEffect(() => {
        let frame: number;
        let startTime: number;

        const start = () => {
            const animate = (timestamp: number) => {
                if (!startTime) startTime = timestamp;
                const elapsed = timestamp - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 3);
                setCount(Math.floor(eased * target));
                if (progress < 1) frame = requestAnimationFrame(animate);
                else setCount(target);
            };
            frame = requestAnimationFrame(animate);
        };

        const timer = delay > 0 ? setTimeout(start, delay) : null;
        if (!timer) start();

        return () => {
            if (timer) clearTimeout(timer);
            cancelAnimationFrame(frame);
        };
    }, [target, duration, delay]);

    return count;
}

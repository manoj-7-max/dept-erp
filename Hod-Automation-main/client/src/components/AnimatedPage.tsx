"use client";
import { useEffect, useRef, ReactNode } from 'react';

interface AnimatedPageProps {
    children: ReactNode;
    className?: string;
}

/**
 * AnimatedPage wraps page content with:
 * - Page-enter fade + slide animation on mount
 * - Intersection Observer for .reveal elements (scroll reveal)
 */
export default function AnimatedPage({ children, className = '' }: AnimatedPageProps) {
    const pageRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const el = pageRef.current;
        if (!el) return;

        // Set up Intersection Observer for all .reveal elements
        const revealEls = el.querySelectorAll('.reveal');
        if (revealEls.length === 0) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('revealed');
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
        );

        revealEls.forEach((el) => observer.observe(el));
        return () => observer.disconnect();
    }, []);

    return (
        <div ref={pageRef} className={`page-enter ${className}`}>
            {children}
        </div>
    );
}

import { useState, useEffect, useCallback, useRef } from 'react';

interface UseSliderOptions {
  totalSlides: number;
  autoAdvanceInterval?: number;
}

export function useSlider({ totalSlides, autoAdvanceInterval = 6000 }: UseSliderOptions) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(1);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isHoveredRef = useRef(false);

  const resetInterval = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    intervalRef.current = setInterval(() => {
      if (!isHoveredRef.current) {
        setDirection(1);
        setCurrentSlide((prev) => (prev + 1) % totalSlides);
      }
    }, autoAdvanceInterval);
  }, [autoAdvanceInterval, totalSlides]);

  useEffect(() => {
    resetInterval();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [resetInterval]);

  const goToSlide = useCallback((index: number) => {
    setDirection(index > currentSlide ? 1 : -1);
    setCurrentSlide(index);
    resetInterval();
  }, [currentSlide, resetInterval]);

  const goNext = useCallback(() => {
    setDirection(1);
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
    resetInterval();
  }, [totalSlides, resetInterval]);

  const goPrev = useCallback(() => {
    setDirection(-1);
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
    resetInterval();
  }, [totalSlides, resetInterval]);

  const setHovered = useCallback((hovered: boolean) => {
    isHoveredRef.current = hovered;
  }, []);

  return {
    currentSlide,
    direction,
    goToSlide,
    goNext,
    goPrev,
    setHovered,
  };
}

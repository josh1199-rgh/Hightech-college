import React, { useState, useRef, useEffect } from 'react';

interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  fallback?: string;
}

export const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  fallback = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23e2e8f0" width="400" height="300"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" fill="%2394a3b8" font-family="sans-serif" font-size="14"%3EImage%3C/text%3E%3C/svg%3E',
  className = '',
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && imgRef.current && src) {
            imgRef.current.src = src;
            observer.disconnect();
          }
        });
      },
      { rootMargin: '100px' }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [src]);

  const handleError = () => {
    setHasError(true);
    if (imgRef.current && fallback && !fallback.startsWith('data:')) {
      imgRef.current.src = fallback;
    }
    if (imgRef.current && fallback && fallback.startsWith('data:')) {
      imgRef.current.src = fallback;
    }
  };

  return (
    <img
      ref={imgRef}
      alt={alt}
      data-src={src}
      loading="lazy"
      decoding="async"
      onLoad={() => setIsLoaded(true)}
      onError={handleError}
      className={`transition-opacity duration-500 ${
        isLoaded && !hasError ? 'opacity-100' : 'opacity-0'
      } ${className}`}
      {...props}
    />
  );
};

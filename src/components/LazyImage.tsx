import React, { useState, useRef, useEffect } from 'react';

interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  fallback?: string;
}

export const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  fallback = '/src/assets/images/site-placeholder.jpeg',
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

  return (
    <img
      ref={imgRef}
      alt={alt}
      data-src={src}
      loading="lazy"
      decoding="async"
      onLoad={() => setIsLoaded(true)}
      onError={() => {
        setHasError(true);
        if (imgRef.current && fallback) {
          imgRef.current.src = fallback;
        }
      }}
      className={`transition-opacity duration-500 ${
        isLoaded ? 'opacity-100' : 'opacity-0'
      } ${className}`}
      {...props}
    />
  );
};

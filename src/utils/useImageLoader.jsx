import { useState, useEffect } from 'react';

export const useImageLoader = (images) => {
  const [imagesLoaded, setImagesLoaded] = useState(false);

  useEffect(() => {
    let loadedCount = 0;
    const handleImageLoad = () => {
      loadedCount += 1;
      if (loadedCount === images.length) {
        setImagesLoaded(true);
      }
    };

    images.forEach((src) => {
      const img = new Image();
      img.src = src;
      img.onload = handleImageLoad;
    });
  }, [images]);

  return imagesLoaded;
};
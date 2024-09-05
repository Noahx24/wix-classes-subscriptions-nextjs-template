'use client';
import Image from 'next/image';
import { Carousel, Flowbite, useTheme } from 'flowbite-react';

export default function ImageGalleryClient({
  items,
  width,
  height,
}: {
  items: { src: string; alt?: string }[];
  width: number;
  height: number;
}) {
  const { theme } = useTheme();

  return (
    <div className="h-56 sm:h-96 max-h-96 max-w-xl mx-auto">
      <Flowbite
        theme={{
          theme: {
            carousel: {
              scrollContainer: {
                ...theme.carousel.scrollContainer,
                base: theme.carousel.scrollContainer.base + ' rounded-none',
              },
            },
          },
        }}
      >
        <Carousel slide={false}>
          {items.map(({ src, alt }, index) => (
            <div key={index} className="relative" style={{ width, height }}>
              <Image
                src={src}
                alt={alt ?? ''}
                layout="fill" // Use `layout="fill"` to cover the container with the image
                objectFit="cover" // Ensure the image covers the container
              />
            </div>
          ))}
        </Carousel>
      </Flowbite>
    </div>
  );
}

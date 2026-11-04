
"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Image as ImageIcon } from "lucide-react";

type ProductImageGalleryProps = {
  images: string[];
  title: string;
};

export default function ProductImageGallery({
  images,
  title,
}: ProductImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  const validImages = images.filter(Boolean);

  if (validImages.length === 0) {
    return (
      <div className="flex h-72 items-center justify-center rounded-xl bg-gray-50 text-gray-300 sm:h-96">
        <ImageIcon size={56} />
      </div>
    );
  }

  const showPrevious = () => {
    setActiveIndex((current) =>
      current === 0 ? validImages.length - 1 : current - 1
    );
  };

  const showNext = () => {
    setActiveIndex((current) =>
      current === validImages.length - 1 ? 0 : current + 1
    );
  };

  return (
    <div>
      {/* Main image */}
      <div className="group relative flex h-72 items-center justify-center overflow-hidden rounded-xl bg-gray-50 sm:h-96">
        <img
          src={validImages[activeIndex]}
          alt={`${title} - image ${activeIndex + 1}`}
          className="h-full w-full object-fill"
        />

        {validImages.length > 1 && (
          <>
            <button
              type="button"
              onClick={showPrevious}
              aria-label="Previous image"
              className="absolute left-3 rounded-full border border-gray-200 bg-white/90 p-2 text-gray-700 shadow-sm transition hover:bg-white"
            >
              <ChevronLeft size={20} />
            </button>

            <button
              type="button"
              onClick={showNext}
              aria-label="Next image"
              className="absolute right-3 rounded-full border border-gray-200 bg-white/90 p-2 text-gray-700 shadow-sm transition hover:bg-white"
            >
              <ChevronRight size={20} />
            </button>

            <span className="absolute bottom-3 right-3 rounded-full bg-gray-900/70 px-2.5 py-1 text-xs text-white">
              {activeIndex + 1} / {validImages.length}
            </span>
          </>
        )}
      </div>

      {/* Clickable thumbnails */}
      {validImages.length > 1 && (
        <ul className="mt-4 flex gap-3 overflow-x-auto pb-1">
          {validImages.map((image, index) => (
            <li key={`${image}-${index}`} className="shrink-0">
              <button
                type="button"
                onClick={() => setActiveIndex(index)}
                aria-label={`Show image ${index + 1}`}
                aria-pressed={activeIndex === index}
                className={`flex h-20 w-20 items-center justify-center rounded-xl border-2 bg-gray-50 transition ${
                  activeIndex === index
                    ? "border-violet-500 ring-2 ring-violet-100"
                    : "border-gray-200 hover:border-violet-300"
                }`}
              >
                <img
                  src={image}
                  alt=""
                  className="h-full w-full object-fill rounded-xl"
                />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Package, Image as ImageIcon } from 'lucide-react';

interface ItemImageProps {
  src: string;
  alt: string;
  className?: string;
}

export const ItemImage: React.FC<ItemImageProps> = ({ src, alt, className = '' }) => {
  const [hasError, setHasError] = useState(false);

  if (hasError || !src) {
    return (
      <div
        className={`flex items-center justify-center bg-stone-200 text-stone-500 ${className}`}
        aria-label={alt}
      >
        <div className="flex flex-col items-center gap-1 p-2 text-center text-xs">
          <Package className="h-6 w-6 text-stone-400" />
          <span className="text-[10px] text-stone-600 line-clamp-1">{alt}</span>
        </div>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setHasError(true)}
      loading="lazy"
      referrerPolicy="no-referrer"
    />
  );
};


import React from 'react';
import ImageCard from './ImageCard';
import { GeneratedImage } from '../types';

interface ImageGalleryProps {
  images: GeneratedImage[];
  isGenerating: boolean;
  onDelete: (id: string) => void;
  n8nUrl?: string;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ images, isGenerating, onDelete, n8nUrl }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {isGenerating && (
        <div className="aspect-square bg-white/5 rounded-3xl border border-gray-800 flex flex-col items-center justify-center p-8 text-center animate-pulse">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-blue-400 font-bold">جاري الرسم...</p>
        </div>
      )}
      {images.map((img) => (
        <ImageCard key={img.id} image={img} onDelete={onDelete} n8nUrl={n8nUrl} />
      ))}
    </div>
  );
};

export default ImageGallery;

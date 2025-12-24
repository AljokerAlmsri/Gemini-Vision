
import React, { useState } from 'react';
import { GeneratedImage } from '../types';

interface ImageCardProps {
  image: GeneratedImage;
  onDelete: (id: string) => void;
  n8nUrl?: string;
}

const ImageCard: React.FC<ImageCardProps> = ({ image, onDelete, n8nUrl }) => {
  const [isSending, setIsSending] = useState(false);
  const [sentStatus, setSentStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = image.url;
    link.download = `gemini-image-${image.id}.png`;
    link.click();
  };

  const sendToN8n = async () => {
    if (!n8nUrl) {
      alert("يرجى ضبط رابط Webhook n8n في الإعدادات أولاً.");
      return;
    }

    setIsSending(true);
    setSentStatus('idle');

    try {
      const response = await fetch(n8nUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: image.id,
          prompt: image.prompt,
          imageUrl: image.url,
          timestamp: image.timestamp,
          source: 'Gemini Vision App'
        })
      });

      if (response.ok) {
        setSentStatus('success');
        setTimeout(() => setSentStatus('idle'), 3000);
      } else {
        throw new Error();
      }
    } catch (e) {
      setSentStatus('error');
      setTimeout(() => setSentStatus('idle'), 3000);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="group relative overflow-hidden bg-gray-900 rounded-3xl border border-gray-800 transition-all hover:border-blue-500/30">
      <div className={`relative w-full overflow-hidden ${image.aspectRatio === '16:9' ? 'aspect-video' : 'aspect-square'}`}>
        <img src={image.url} alt={image.prompt} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-end">
          <p className="text-white text-xs mb-4 line-clamp-2">{image.prompt}</p>
          <div className="flex flex-col gap-2">
            <div className="flex gap-2">
              <button onClick={handleDownload} className="flex-grow py-2 bg-white text-black rounded-xl text-[10px] font-bold hover:bg-gray-200 flex items-center justify-center gap-1">
                تحميل
              </button>
              <button 
                onClick={sendToN8n} 
                disabled={isSending}
                className={`flex-grow py-2 rounded-xl text-[10px] font-bold flex items-center justify-center gap-1 transition-all ${
                  sentStatus === 'success' ? 'bg-green-600 text-white' : 
                  sentStatus === 'error' ? 'bg-red-600 text-white' : 
                  'bg-blue-600 text-white hover:bg-blue-500'
                }`}
              >
                {isSending ? 'جاري الإرسال...' : sentStatus === 'success' ? 'تم الإرسال ✓' : sentStatus === 'error' ? 'فشل الإرسال' : 'إرسال لـ n8n'}
              </button>
            </div>
            <button onClick={() => onDelete(image.id)} className="py-2 bg-white/10 hover:bg-red-600/20 text-white/50 hover:text-red-500 rounded-xl text-[10px] transition-all">
              حذف الصورة
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageCard;

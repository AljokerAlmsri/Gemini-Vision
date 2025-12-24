
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import PromptInput from './components/PromptInput';
import ImageGallery from './components/ImageGallery';
import N8nSettings from './components/N8nSettings';
import { generateImage } from './services/geminiService';
import { GeneratedImage, GenerationParams } from './types';

const App: React.FC = () => {
  const [images, setImages] = useState<GeneratedImage[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [n8nWebhookUrl, setN8nWebhookUrl] = useState<string>(localStorage.getItem('n8n_webhook_url') || '');
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('gemini_images_history');
    if (saved) {
      try { setImages(JSON.parse(saved)); } catch (e) { console.error("Failed to parse history"); }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('gemini_images_history', JSON.stringify(images));
  }, [images]);

  const handleGenerate = async (params: GenerationParams) => {
    setIsGenerating(true);
    setError(null);
    try {
      if (params.isPro) {
        // @ts-ignore
        if (window.aistudio && !(await window.aistudio.hasSelectedApiKey())) {
          // @ts-ignore
          await window.aistudio.openSelectKey();
        }
      }
      const imageUrl = await generateImage(params);
      const newImage: GeneratedImage = {
        id: Date.now().toString(),
        url: imageUrl,
        prompt: params.prompt,
        timestamp: Date.now(),
        aspectRatio: params.aspectRatio,
        isPro: params.isPro
      };
      setImages(prev => [newImage, ...prev]);
    } catch (err: any) {
      setError(err.message || "حدث خطأ غير متوقع.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleN8nUrlChange = (url: string) => {
    setN8nWebhookUrl(url);
    localStorage.setItem('n8n_webhook_url', url);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header onSettingsClick={() => setShowSettings(true)} />
      
      <main className="flex-grow container mx-auto px-4 py-8 max-w-6xl">
        <section className="mb-12">
          <div className="text-center mb-10">
            <h1 className="text-4xl md:text-6xl font-black mb-4 bg-clip-text text-transparent bg-gradient-to-l from-blue-400 to-purple-500">
              مبدع الصور الذكي
            </h1>
            <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto">
              تكامل مباشر مع n8n لتوليد الصور وأتمتة المهام.
            </p>
          </div>

          <PromptInput onGenerate={handleGenerate} isGenerating={isGenerating} />
          {error && <div className="mt-6 p-4 bg-red-900/30 border border-red-500/50 rounded-xl text-red-200 text-center">{error}</div>}
        </section>

        <section id="gallery" className="border-t border-gray-800 pt-12">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">معرض الصور</h2>
          </div>
          <ImageGallery images={images} isGenerating={isGenerating} onDelete={(id) => setImages(prev => prev.filter(i => i.id !== id))} n8nUrl={n8nWebhookUrl} />
        </section>
      </main>

      {showSettings && <N8nSettings url={n8nWebhookUrl} onSave={handleN8nUrlChange} onClose={() => setShowSettings(false)} />}
    </div>
  );
};

export default App;

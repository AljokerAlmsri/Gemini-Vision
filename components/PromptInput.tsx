
import React, { useState } from 'react';
import { AspectRatio, GenerationParams } from '../types';

interface PromptInputProps {
  onGenerate: (params: GenerationParams) => void;
  isGenerating: boolean;
}

const PromptInput: React.FC<PromptInputProps> = ({ onGenerate, isGenerating }) => {
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('1:1');
  const [isPro, setIsPro] = useState(false);

  const ratios: { label: string, value: AspectRatio }[] = [
    { label: '1:1', value: '1:1' },
    { label: '16:9', value: '16:9' },
    { label: '9:16', value: '9:16' },
    { label: '4:3', value: '4:3' },
    { label: '3:4', value: '3:4' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isGenerating) return;
    onGenerate({ prompt, aspectRatio, isPro });
  };

  const examples = [
    "رائد فضاء يركب خيلاً على سطح القمر بأسلوب واقعي",
    "منظر طبيعي لغابة خريفية ساحرة في المساء مع ضوء شمس ذهبي",
    "سيارة رياضية مستقبلية تسير في شوارع مدينة دبي ليلاً",
    "قطة صغيرة ترتدي تاجاً وتجلس على عرش من الحلوى"
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="relative group">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="صف المشهد الذي تتخيله هنا بالتفصيل..."
            className="w-full h-40 p-6 bg-gray-900/50 border border-gray-700 rounded-3xl text-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all placeholder:text-gray-600"
            required
          />
          <button
            type="submit"
            disabled={isGenerating || !prompt.trim()}
            className={`absolute bottom-4 left-4 px-8 py-3 rounded-2xl font-bold flex items-center gap-2 transition-all ${
              isGenerating || !prompt.trim() 
              ? 'bg-gray-800 text-gray-500 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/30 active:scale-95'
            }`}
          >
            {isGenerating ? (
              <>
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                جاري التوليد...
              </>
            ) : (
              <>
                <span>ابدأ الرسم</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </>
            )}
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between bg-white/5 p-6 rounded-3xl border border-gray-800">
          <div className="space-y-3 w-full md:w-auto">
            <label className="text-sm font-semibold text-gray-400 block">أبعاد الصورة (Aspect Ratio)</label>
            <div className="flex flex-wrap gap-2">
              {ratios.map((r) => (
                <button
                  key={r.value}
                  type="button"
                  onClick={() => setAspectRatio(r.value)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                    aspectRatio === r.value 
                    ? 'bg-blue-500/20 border-blue-500 text-blue-400' 
                    : 'bg-transparent border-gray-700 text-gray-400 hover:border-gray-500'
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <span className={`text-sm font-semibold ${isPro ? 'text-purple-400' : 'text-gray-400'}`}>وضع المحترفين (Pro)</span>
              <button
                type="button"
                onClick={() => setIsPro(!isPro)}
                className={`w-12 h-6 rounded-full relative transition-all ${isPro ? 'bg-purple-600' : 'bg-gray-700'}`}
              >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${isPro ? 'left-7' : 'left-1'}`} />
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">أو جرب أحد هذه الأمثلة:</span>
          <div className="flex flex-wrap gap-2">
            {examples.map((ex, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setPrompt(ex)}
                className="text-xs px-4 py-2 bg-gray-900 hover:bg-gray-800 border border-gray-800 rounded-full text-gray-400 hover:text-gray-200 transition-colors"
              >
                {ex}
              </button>
            ))}
          </div>
        </div>
      </form>
    </div>
  );
};

export default PromptInput;

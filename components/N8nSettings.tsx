
import React, { useState } from 'react';

interface N8nSettingsProps {
  url: string;
  onSave: (url: string) => void;
  onClose: () => void;
}

const N8nSettings: React.FC<N8nSettingsProps> = ({ url, onSave, onClose }) => {
  const [inputUrl, setInputUrl] = useState(url);

  const handleSave = () => {
    onSave(inputUrl);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-md bg-gray-900 border border-gray-800 rounded-3xl p-8 shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold">إعدادات n8n Webhook</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-white">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <p className="text-gray-400 text-sm mb-6 leading-relaxed">
          أدخل رابط <strong>Webhook URL</strong> الخاص بـ n8n لاستقبال بيانات الصور المولدة مباشرة في سير العمل (Workflow) الخاص بك.
        </p>
        
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">رابط الويب هوك</label>
            <input 
              type="url"
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              placeholder="https://your-n8n.com/webhook/..."
              className="w-full bg-black/50 border border-gray-700 rounded-xl px-4 py-3 text-sm focus:border-blue-500 outline-none transition-all"
            />
          </div>
          
          <button 
            onClick={handleSave}
            className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold shadow-lg shadow-blue-900/20 active:scale-95 transition-all"
          >
            حفظ الإعدادات
          </button>
        </div>
      </div>
    </div>
  );
};

export default N8nSettings;

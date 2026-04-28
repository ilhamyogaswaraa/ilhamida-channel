import React from 'react';
import { AppState } from '../types';

interface InputFormProps {
  data: AppState;
  onChange: (data: AppState) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

export function InputForm({ data, onChange, onSubmit, isLoading }: InputFormProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    onChange({ ...data, [name]: name === 'durasi' ? parseInt(value, 10) || 0 : value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 lg:sticky lg:top-24 flex flex-col">
      <div className="flex justify-between items-start mb-6">
        <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-1 rounded font-bold uppercase tracking-wider">Parameters</span>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        
        {/* Niche */}
        <div className="space-y-2">
          <label htmlFor="niche" className="block text-[11px] font-bold uppercase text-slate-500">Niche</label>
          <input
            type="text"
            id="niche"
            name="niche"
            required
            value={data.niche}
            onChange={handleChange}
            placeholder="e.g. cerita misteri, edukasi, motivasi"
            className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2.5 px-3 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm"
          />
        </div>

        {/* Ide / Topik */}
        <div className="space-y-2">
          <label htmlFor="ide" className="block text-[11px] font-bold uppercase text-slate-500">Ide / Topik</label>
          <textarea
            id="ide"
            name="ide"
            required
            value={data.ide}
            onChange={handleChange}
            placeholder="Detail ide cerita. e.g. Anak kos nemu cermin tua..."
            rows={3}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2.5 px-3 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm resize-none"
          />
        </div>

        {/* Style Visual */}
        <div className="space-y-2">
          <label htmlFor="style" className="block text-[11px] font-bold uppercase text-slate-500">Style Visual</label>
          <input
            type="text"
            id="style"
            name="style"
            required
            value={data.style}
            onChange={handleChange}
            placeholder="e.g. cinematic, anime, 3D Pixar, dark moody"
            className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2.5 px-3 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm"
          />
        </div>

        {/* Durasi */}
        <div className="space-y-2">
          <label htmlFor="durasi" className="block text-[11px] font-bold uppercase text-slate-500">Durasi Target (detik)</label>
          <input
            type="number"
            id="durasi"
            name="durasi"
            required
            min={15}
            max={60}
            value={data.durasi || ''}
            onChange={handleChange}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2.5 px-3 text-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm"
          />
        </div>

        {/* Karakter Utama */}
        <div className="space-y-2">
          <label htmlFor="karakter" className="block text-[11px] font-bold uppercase text-slate-500">Deskripsi Karakter Utama</label>
          <textarea
            id="karakter"
            name="karakter"
            required
            value={data.karakter}
            onChange={handleChange}
            placeholder="Fisik dominan, pakaian, gaya, umur..."
            rows={3}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2.5 px-3 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm resize-none"
          />
        </div>

        {/* Tone / Voice */}
        <div className="space-y-2">
          <label htmlFor="tone" className="block text-[11px] font-bold uppercase text-slate-500">Tone / Voice Profile</label>
          <select
            id="tone"
            name="tone"
            value={data.tone}
            onChange={handleChange}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2.5 px-3 text-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm"
          >
            <option value="narator_pria_dewasa_misterius">Narator Pria Dewasa Misterius</option>
            <option value="narator_pria_dewasa_semangat">Narator Pria Dewasa Semangat</option>
            <option value="narator_wanita_dewasa_lembut">Narator Wanita Dewasa Lembut</option>
            <option value="narator_wanita_dewasa_tegas">Narator Wanita Dewasa Tegas</option>
            <option value="narator_anak">Narator Anak</option>
            <option value="narator_remaja_santai">Narator Remaja Santai</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full mt-6 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-4 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              RUNNING PIPELINE...
            </>
          ) : (
            'RUN PRODUCTION PIPELINE'
          )}
        </button>
      </form>
    </div>
  );
}

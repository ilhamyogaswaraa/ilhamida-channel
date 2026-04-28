import { useState } from 'react';
import { Sparkles, Youtube, Facebook, Video, Settings2 } from 'lucide-react';
import { AppState, GeneratedScript } from './types';
import { InputForm } from './components/InputForm';
import { ResultDisplay } from './components/ResultDisplay';
import { generateScriptPipeline } from './services/geminiService';

export default function App() {
  const [formData, setFormData] = useState<AppState>({
    niche: 'Cerita Misteri Pendek',
    ide: 'Anak kos nemu cermin tua di gudang yang mantulin sosok lain yang ngikutin geraknya.',
    style: 'Cinematic horor Indonesia, dark moody, film grain',
    durasi: 50,
    karakter: 'Cewek 22 tahun, rambut hitam panjang, kaos oversize abu-abu, wajah ayu sedikit pucat, tinggi sedang',
    tone: 'narator_wanita_dewasa_lembut'
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<GeneratedScript | null>(null);

  const handleSubmit = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const generated = await generateScriptPipeline(formData);
      setResult(generated);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-indigo-500/30 overflow-x-hidden">
      
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-950 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <span className="bg-red-600 px-2 py-0.5 rounded text-xs uppercase tracking-widest text-white">Pro</span>
              ShortsGen AI <span className="text-slate-500 font-light hidden sm:inline">/ v2.5</span>
            </h1>
            <p className="text-xs text-slate-400 mt-1 uppercase tracking-widest">Indonesian Viral Scripting Engine</p>
          </div>
          <div className="flex gap-3 items-center">
            <div className="bg-slate-900 border border-slate-700 px-4 py-2 rounded-lg hidden md:block">
              <span className="text-[10px] block text-slate-500 uppercase font-semibold">System</span>
              <span className="font-mono text-sm">OPTIMIZED</span>
            </div>
            <div className="flex items-center gap-3 text-xs font-medium text-slate-500 bg-slate-900 border border-slate-800 px-4 py-2 rounded-lg h-[46px]">
              <div className="flex items-center gap-1.5"><Youtube className="w-5 h-5 text-[#FF0000]" /></div>
              <div className="flex items-center gap-1.5"><Facebook className="w-5 h-5 text-[#0866FF]" /></div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-6 border-transparent">
        
        {error && (
          <div className="mb-6 bg-red-500/10 border border-red-500/30 text-red-200 px-4 py-3 rounded-lg flex items-start gap-3">
            <span className="text-2xl leading-none">⚠️</span>
            <div>
              <h3 className="font-semibold text-sm">Generation Failed</h3>
              <p className="text-sm opacity-80 mt-1">{error}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: Form */}
          <div className="lg:col-span-4 rounded-xl">
            <InputForm 
              data={formData} 
              onChange={setFormData} 
              onSubmit={handleSubmit} 
              isLoading={isLoading} 
            />
          </div>

          {/* Right Column: Result or Placeholder */}
          <div className="lg:col-span-8">
            {result ? (
              <ResultDisplay result={result} />
            ) : (
              <div className="h-[600px] border border-slate-800 border-dashed rounded-2xl flex flex-col items-center justify-center text-center p-8 bg-slate-900/30">
                <div className="bg-slate-800 p-4 rounded-full mb-4 animate-pulse">
                  <Settings2 className="w-8 h-8 text-slate-500" />
                </div>
                <h3 className="text-xl font-bold tracking-tight text-white mb-2">Awaiting Generation</h3>
                <p className="text-slate-500 max-w-sm text-sm">
                  Isi parameter di samping dan klik Run Production Pipeline untuk membuat Full Production Package (Scripts, Prompts, Metadata).
                </p>
                <div className="mt-8 grid grid-cols-2 gap-4 text-left w-full max-w-md">
                  <div className="bg-slate-900/50 border border-slate-800 py-3 px-4 rounded-lg text-[11px] uppercase tracking-wide text-slate-400 flex items-center gap-2">
                    <span className="text-indigo-400 font-bold">✓</span> Veo 3 Configured
                  </div>
                  <div className="bg-slate-900/50 border border-slate-800 py-3 px-4 rounded-lg text-[11px] uppercase tracking-wide text-slate-400 flex items-center gap-2">
                    <span className="text-indigo-400 font-bold">✓</span> Nano Banana Params
                  </div>
                  <div className="bg-slate-900/50 border border-slate-800 py-3 px-4 rounded-lg text-[11px] uppercase tracking-wide text-slate-400 flex items-center gap-2">
                    <span className="text-indigo-400 font-bold">✓</span> TTS Timings Set
                  </div>
                  <div className="bg-slate-900/50 border border-slate-800 py-3 px-4 rounded-lg text-[11px] uppercase tracking-wide text-slate-400 flex items-center gap-2">
                    <span className="text-indigo-400 font-bold">✓</span> SEO Metadata Ready
                  </div>
                </div>
              </div>
            )}
          </div>
          
        </div>
      </main>

    </div>
  );
}

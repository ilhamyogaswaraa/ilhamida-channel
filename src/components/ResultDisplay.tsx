import React, { useState } from 'react';
import { GeneratedScript } from '../types';
import { Copy, CheckCircle, Video, User, FileText, Share2, Youtube, Facebook, Image as ImageIcon, Loader2 } from 'lucide-react';
import { generateImageFree } from '../services/geminiService';

interface ResultDisplayProps {
  result: GeneratedScript;
}

export function ResultDisplay({ result }: ResultDisplayProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'character' | 'scenes' | 'metadata'>('overview');
  const [copied, setCopied] = useState<string | null>(null);
  const [charImage, setCharImage] = useState<string | null>(null);
  const [isGeneratingChar, setIsGeneratingChar] = useState(false);
  const [sceneImages, setSceneImages] = useState<Record<number, string>>({});
  const [settingImages, setSettingImages] = useState<Record<number, string>>({});
  const [isGeneratingSetting, setIsGeneratingSetting] = useState<Record<number, boolean>>({});
  const [isGeneratingScene, setIsGeneratingScene] = useState<Record<number, boolean>>({});
  const [imageError, setImageError] = useState<string | null>(null);
  const [sessionSeed] = useState<number>(() => Math.floor(Math.random() * 1000000));

  const characterPrompt = result.stage_2_assets?.character_turnaround_prompt || (result as any).stage_2_character_reference_prompt;
  const settingPrompts = result.stage_2_assets?.setting_prompts || [];

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const copyButton = (text: string, id: string) => (
    <button
      onClick={() => handleCopy(text, id)}
      className="p-1.5 text-slate-500 hover:text-white hover:bg-slate-800 rounded transition-colors bg-black/10"
      title="Copy to clipboard"
    >
      {copied === id ? <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
    </button>
  );

  const handleGenerateCharImage = async () => {
    setIsGeneratingChar(true);
    setImageError(null);
    try {
      const prompt = characterPrompt;
      const image = await generateImageFree(prompt, '16:9', sessionSeed);
      setCharImage(image);
    } catch (e: any) {
      setImageError(e.message);
    } finally {
      setIsGeneratingChar(false);
    }
  };

  const handleGenerateSettingImage = async (idx: number, prompt: string) => {
    setIsGeneratingSetting(prev => ({ ...prev, [idx]: true }));
    setImageError(null);
    try {
      const fullPrompt = `${result.metadata.style_visual} style. Setting/Background only (no characters): ${prompt}.`;
      const image = await generateImageFree(fullPrompt, '16:9', sessionSeed);
      setSettingImages(prev => ({ ...prev, [idx]: image }));
    } catch (e: any) {
      setImageError(e.message);
    } finally {
      setIsGeneratingSetting(prev => ({ ...prev, [idx]: false }));
    }
  };

  const handleGenerateSceneImage = async (sceneIdx: number, prompt: string) => {
    setIsGeneratingScene(prev => ({ ...prev, [sceneIdx]: true }));
    setImageError(null);
    try {
      // By putting the character description and the visual style at the very start of the prompt,
      // and maintaining the same seed, we force the AI to try and maintain subject consistency.
      const fullPrompt = `${result.metadata.style_visual} style. Character: ${result.stage_1_script.karakter_master.deskripsi_singkat}, wearing exact same clothes. Setting: ${result.stage_1_script.setting_master.waktu}, ${result.stage_1_script.setting_master.lokasi}. Action: ${prompt}. Camera: Ensure standard portrait framing, consistent face.`;
      const image = await generateImageFree(fullPrompt, '9:16', sessionSeed);
      setSceneImages(prev => ({ ...prev, [sceneIdx]: image }));
    } catch (e: any) {
      setImageError(e.message);
    } finally {
      setIsGeneratingScene(prev => ({ ...prev, [sceneIdx]: false }));
    }
  };

  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden flex flex-col h-full min-h-[600px]">
      
      {/* Header / Tabs */}
      <div className="flex border-b border-slate-800 bg-slate-950 overflow-x-auto">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex items-center gap-2 px-6 py-4 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 whitespace-nowrap ${
            activeTab === 'overview' ? 'border-indigo-500 text-indigo-400 bg-slate-900/50' : 'border-transparent text-slate-500 hover:text-slate-300 hover:bg-slate-900/30'
          }`}
        >
          <FileText className="w-4 h-4" /> Stage 1: Scripting
        </button>
        <button
          onClick={() => setActiveTab('character')}
          className={`flex items-center gap-2 px-6 py-4 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 whitespace-nowrap ${
            activeTab === 'character' ? 'border-emerald-500 text-emerald-400 bg-slate-900/50' : 'border-transparent text-slate-500 hover:text-slate-300 hover:bg-slate-900/30'
          }`}
        >
          <User className="w-4 h-4" /> Stage 2: Master Char
        </button>
        <button
          onClick={() => setActiveTab('scenes')}
          className={`flex items-center gap-2 px-6 py-4 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 whitespace-nowrap ${
            activeTab === 'scenes' ? 'border-blue-500 text-blue-400 bg-slate-900/50' : 'border-transparent text-slate-500 hover:text-slate-300 hover:bg-slate-900/30'
          }`}
        >
          <Video className="w-4 h-4" /> Stage 3: Timeline
        </button>
        <button
          onClick={() => setActiveTab('metadata')}
          className={`flex items-center gap-2 px-6 py-4 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 whitespace-nowrap ${
            activeTab === 'metadata' ? 'border-orange-500 text-orange-400 bg-slate-900/50' : 'border-transparent text-slate-500 hover:text-slate-300 hover:bg-slate-900/30'
          }`}
        >
          <Share2 className="w-4 h-4" /> Stage 4: Social Meta
        </button>
      </div>

      {/* Content Area */}
      <div className="p-6 flex-1 overflow-y-auto">
        
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6 transition-all duration-300">
            <div>
               <div className="flex justify-between items-start mb-4">
                  <span className="text-[10px] bg-indigo-500/20 text-indigo-400 px-2 py-1 rounded font-bold uppercase tracking-wider">Project Info</span>
                  <span className="text-xs text-slate-500">{result.metadata.estimasi_durasi}s</span>
              </div>
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-wrap gap-x-8 gap-y-4">
                <div>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wide">Judul Internal</p>
                  <p className="text-white text-sm font-medium mt-1">{result.metadata.judul_internal}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wide">Durasi</p>
                  <p className="text-white text-sm font-medium mt-1">{result.metadata.estimasi_durasi}s</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wide">Style</p>
                  <p className="text-white text-sm font-medium mt-1">{result.metadata.style_visual}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wide">Setting Master</p>
                  <p className="text-white text-sm font-medium mt-1">{result.stage_1_script.setting_master.waktu}, {result.stage_1_script.setting_master.lokasi}</p>
                </div>
              </div>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border-l-4 border-l-red-500 border-y border-y-slate-800 border-r border-r-slate-800 relative group">
              <div className="flex justify-between items-start mb-2">
                 <p className="text-[10px] text-red-500 font-bold uppercase">Viral Hook (3s)</p>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                   {copyButton(result.stage_1_script.hook_text, 'hook')}
                </div>
              </div>
              <p className="text-lg font-bold leading-tight italic text-white pr-8">
                "{result.stage_1_script.hook_text}"
              </p>
            </div>

            <div>
              <h3 className="text-[10px] text-slate-500 font-bold uppercase tracking-wide mb-3">Full Script Preview</h3>
              <div className="space-y-3 font-mono text-xs text-slate-300 leading-relaxed bg-slate-950 p-4 rounded-xl border border-slate-800">
                  {result.stage_1_script.scenes.map((s, i) => (
                    <p key={i}>
                      <span className="text-indigo-400 font-semibold">[SCENE {s.scene_number}]</span> {s.voiceover_text}
                    </p>
                  ))}
              </div>
            </div>
          </div>
        )}

        {/* Character Tab */}
        {activeTab === 'character' && (
          <div className="space-y-6 transition-all duration-300">
             <div>
               <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded font-bold uppercase tracking-wider mb-4 inline-block">Master Character</span>
              <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-4">
                <div>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wide mb-1">Nama / Identitas</p>
                  <p className="text-white font-bold text-sm tracking-tight">{result.stage_1_script.karakter_master.nama}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wide mb-1">Deskripsi Fisik (Guideline)</p>
                  <p className="text-slate-300 text-xs leading-relaxed">{result.stage_1_script.karakter_master.deskripsi_fisik}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wide mb-1 flex items-center gap-2">Anchor Singkat <span className="px-1.5 py-0.5 bg-slate-800 rounded text-[9px] text-emerald-400">VE-O 3 Injection</span></p>
                  <div className="bg-slate-900 border border-slate-800 px-3 py-2 rounded-lg text-emerald-200 text-xs mt-1">
                    {result.stage_1_script.karakter_master.deskripsi_singkat}
                  </div>
                </div>
              </div>
            </div>

            {imageError && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-lg">
                <span className="font-bold">Generation Error:</span> {imageError}
              </div>
            )}

            <div>
              <div className="flex justify-between items-end mb-2">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wide flex items-center gap-2">Character Turnaround Prompt <span className="px-1.5 py-0.5 bg-slate-800 rounded text-[9px] text-emerald-400">Copy to Gemini Imagen</span></span>
                <div className="flex items-center gap-2">
                  <span className="text-[9px] text-slate-500 font-mono bg-slate-900 px-2 py-1 rounded">Seed: {sessionSeed}</span>
                  <button
                    onClick={handleGenerateCharImage}
                    disabled={isGeneratingChar}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-medium transition-colors disabled:opacity-50"
                  >
                    {isGeneratingChar ? <Loader2 className="w-3 h-3 animate-spin"/> : <ImageIcon className="w-3 h-3"/>}
                    {isGeneratingChar ? 'Generating...' : 'Generate Ref (Free)'}
                  </button>
                  {copyButton(characterPrompt, 'nano_prompt')}
                </div>
              </div>
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-xs text-emerald-300 whitespace-pre-wrap leading-relaxed">
                {characterPrompt}
              </div>
            </div>

            {charImage && (
              <div className="mt-4 border border-slate-800 rounded-xl overflow-hidden bg-slate-950">
                <div className="px-4 py-2 bg-slate-900 border-b border-slate-800 text-xs font-bold text-slate-400 uppercase tracking-wide">
                  Generated Character Reference (Turnaround)
                </div>
                <img src={charImage} alt="Character Reference" className="w-full h-auto" />
              </div>
            )}

            {settingPrompts.length > 0 && (
              <div className="mt-8 space-y-4">
                <span className="text-[10px] bg-indigo-500/20 text-indigo-400 px-2 py-1 rounded font-bold uppercase tracking-wider mb-2 inline-block">Establishing Settings</span>
                
                {settingPrompts.map((prompt, idx) => (
                  <div key={idx} className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden group">
                    <div className="bg-slate-900 border-b border-slate-800 px-4 py-3 flex justify-between items-center">
                      <span className="text-xs font-bold text-slate-400 uppercase">Setting {idx + 1}</span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleGenerateSettingImage(idx, prompt)}
                          disabled={isGeneratingSetting[idx]}
                          className="opacity-0 group-hover:opacity-100 flex items-center gap-1 px-2 py-1 bg-slate-800 hover:bg-slate-700 text-white rounded text-[10px] font-medium transition-all disabled:opacity-50"
                        >
                          {isGeneratingSetting[idx] ? <Loader2 className="w-3 h-3 animate-spin"/> : <ImageIcon className="w-3 h-3"/>}
                          Gen Image (Free)
                        </button>
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                          {copyButton(prompt, `setting_${idx}`)}
                        </div>
                      </div>
                    </div>
                    <div className="p-4 grid grid-cols-1 gap-4">
                      <div className="text-xs text-slate-300 font-mono leading-relaxed">
                        {prompt}
                      </div>
                      {settingImages[idx] && (
                        <div className="w-full border border-slate-800 rounded overflow-hidden">
                           <img src={settingImages[idx]} alt={`Setting ${idx + 1}`} className="w-full h-auto" />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Scenes Tab */}
        {activeTab === 'scenes' && (
          <div className="space-y-6 transition-all duration-300">
            <div className="flex justify-between items-center mb-2">
               <span className="text-[10px] bg-blue-500/20 text-blue-400 px-2 py-1 rounded font-bold uppercase tracking-wider">Video Timeline</span>
               <span className="text-[10px] text-slate-500 uppercase">{result.stage_1_script.scenes.length} Scenes • 9:16 Vertical</span>
            </div>

            <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-3 mb-4 text-xs text-slate-300 flex items-start gap-3">
              <span className="text-lg">💡</span>
              <div className="w-full">
                <div className="flex justify-between items-start mb-0.5">
                  <span className="font-bold text-slate-200 block">Production Instructions:</span>
                  <span className="text-[9px] text-slate-500 font-mono bg-slate-900 px-2 py-1 rounded">Seed Locked: {sessionSeed}</span>
                </div>
                Generate placeholder images for your scenes. All scenes share a locked seed and master character description for improved visual consistency.
              </div>
            </div>

            {imageError && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-lg">
                <span className="font-bold">Generation Error:</span> {imageError}
              </div>
            )}

            <div className="space-y-4">
              {result.stage_1_script.scenes.map((scene, idx) => (
                <div key={idx} className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden group">
                  <div className="bg-slate-900 border-b border-slate-800 px-4 py-3 flex justify-between items-center">
                    <h4 className="font-bold text-white text-xs flex items-center gap-2">
                      <span className="bg-indigo-600 text-white w-5 h-5 rounded flex items-center justify-center text-[10px]">{(idx+1).toString().padStart(2, '0')}</span>
                      SCENE {scene.scene_number}
                    </h4>
                    <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-1 rounded font-mono">{scene.durasi_detik}s</span>
                  </div>
                  
                  <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-4">
                      <div className="bg-slate-900/50 rounded-lg p-3 border border-slate-800/80">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">🎥 Veo 3 Prompt</span>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleGenerateSceneImage(idx, scene.veo_prompt)}
                              disabled={isGeneratingScene[idx]}
                              className="opacity-0 group-hover:opacity-100 flex items-center gap-1 px-2 py-1 bg-slate-800 hover:bg-slate-700 text-white rounded text-[10px] font-medium transition-all disabled:opacity-50"
                            >
                              {isGeneratingScene[idx] ? <Loader2 className="w-3 h-3 animate-spin"/> : <ImageIcon className="w-3 h-3"/>}
                              Gen Image (Free)
                            </button>
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                              {copyButton(scene.veo_prompt, `veo_${idx}`)}
                            </div>
                          </div>
                        </div>
                        <div className="font-mono text-[11px] text-pink-300 whitespace-pre-wrap leading-relaxed">
                          {scene.veo_prompt}
                        </div>
                      </div>

                      <div className="bg-slate-900/50 rounded-lg p-3 border border-slate-800/80">
                         <div className="flex justify-between items-center mb-2">
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1">🎙️ TTS Audio</span>
                           <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                             {copyButton(scene.tts_prompt, `tts_${idx}`)}
                           </div>
                        </div>
                        <div className="font-mono text-[11px] text-blue-300 whitespace-pre-wrap leading-relaxed">
                          {scene.tts_prompt}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-center bg-slate-900/30 rounded-lg border border-slate-800/50 min-h-[240px] overflow-hidden">
                      {sceneImages[idx] ? (
                        <div className="relative w-full h-full flex justify-center items-center p-2">
                          <img src={sceneImages[idx]} alt={`Scene ${scene.scene_number}`} className="h-full max-h-[300px] w-auto rounded object-contain shadow-lg" />
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center text-slate-600 gap-2">
                          <ImageIcon className="w-8 h-8 opacity-50" />
                          <span className="text-[10px] uppercase tracking-wider font-bold">No Image Generated</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Metadata Tab */}
        {activeTab === 'metadata' && (
          <div className="space-y-6 transition-all duration-300">
            <span className="text-[10px] bg-orange-500/20 text-orange-400 px-2 py-1 rounded font-bold uppercase tracking-wider mb-2 inline-block">Social Meta</span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* YouTube Shorts */}
              <div className="bg-slate-950 p-5 rounded-xl border border-[#FF0000]/20 space-y-4 hover:border-[#FF0000]/40 transition-colors">
                <h3 className="text-white text-sm font-bold tracking-tight whitespace-nowrap flex items-center gap-2 mb-4">
                  <Youtube className="w-4 h-4 text-[#FF0000]" />
                  YouTube Shorts
                </h3>
                
                <div>
                   <div className="flex justify-between items-center mb-1.5">
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wide">Judul (Max 60 char)</span>
                    {copyButton(result.stage_4_metadata.youtube_shorts.judul, 'yt_judul')}
                  </div>
                  <p className="text-white text-sm font-semibold bg-slate-900 border border-slate-800 p-2.5 rounded-lg">{result.stage_4_metadata.youtube_shorts.judul}</p>
                </div>

                <div>
                   <div className="flex justify-between items-center mb-1.5">
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wide">Deskripsi</span>
                    {copyButton(result.stage_4_metadata.youtube_shorts.deskripsi, 'yt_desc')}
                  </div>
                  <p className="text-slate-400 text-xs bg-slate-900 border border-slate-800 p-3 rounded-lg whitespace-pre-wrap leading-relaxed">{result.stage_4_metadata.youtube_shorts.deskripsi}</p>
                </div>
                
                 <div>
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wide block mb-2">Hashtags</span>
                  <div className="flex flex-wrap gap-1.5">
                    {result.stage_4_metadata.youtube_shorts.hashtag.map((tag, i) => (
                      <span key={i} className="text-[10px] bg-[#FF0000]/10 text-[#FF0000] px-2 py-1 rounded-md">{tag}</span>
                    ))}
                  </div>
                </div>
              </div>

              {/* FB Reels */}
              <div className="bg-slate-950 p-5 rounded-xl border border-[#0866FF]/20 space-y-4 hover:border-[#0866FF]/40 transition-colors">
                <h3 className="text-white text-sm font-bold tracking-tight flex items-center gap-2 mb-4">
                   <Facebook className="w-4 h-4 text-[#0866FF]" />
                  Facebook Reels
                </h3>
                
                <div>
                   <div className="flex justify-between items-center mb-1.5">
                     <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wide">Caption Storytelling</span>
                    {copyButton(result.stage_4_metadata.facebook_reels.caption, 'fb_caption')}
                  </div>
                  <p className="text-slate-400 text-xs bg-slate-900 border border-slate-800 p-3 rounded-lg whitespace-pre-wrap leading-relaxed">{result.stage_4_metadata.facebook_reels.caption}</p>
                </div>
                
                 <div>
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wide block mb-2">Hashtags</span>
                  <div className="flex flex-wrap gap-1.5">
                    {result.stage_4_metadata.facebook_reels.hashtag.map((tag, i) => (
                      <span key={i} className="text-[10px] bg-[#0866FF]/10 text-blue-400 px-2 py-1 rounded-md">{tag}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 mt-4 flex justify-between items-center">
              <div>
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wide block mb-1 italic">YT Title Idea (Cover)</span>
                <p className="text-white font-bold text-sm">{result.stage_4_metadata.thumbnail_text_idea}</p>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wide block mb-1 italic">End CTA Overlay</span>
                <p className="text-white font-bold text-sm tracking-tight">{result.stage_4_metadata.text_overlay.cta_akhir}</p>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}

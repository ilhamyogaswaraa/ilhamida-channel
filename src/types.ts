export interface AppState {
  niche: string;
  ide: string;
  style: string;
  durasi: number;
  karakter: string;
  tone: string;
}

export interface GeneratedMetadataOptions {
  youtube_shorts: {
    judul: string;
    deskripsi: string;
    hashtag: string[];
    tags_seo: string[];
  };
  facebook_reels: {
    caption: string;
    hashtag: string[];
  };
  text_overlay: {
    hook_3_detik: string;
    cta_akhir: string;
  };
  thumbnail_text_idea: string;
}

export interface CharacterMaster {
  nama: string;
  deskripsi_fisik: string;
  deskripsi_singkat: string;
  ekspresi_dominan: string;
}

export interface SettingMaster {
  lokasi: string;
  waktu: string;
  mood_lighting: string;
}

export interface GeneratedScene {
  scene_number: number;
  durasi_detik: number;
  voiceover_text: string;
  veo_prompt: string;
  tts_prompt: string;
  visual_description?: string;
  camera_movement?: string;
  emotion_in_scene?: string;
}

export interface GeneratedScript {
  metadata: {
    judul_internal: string;
    estimasi_durasi: number;
    style_visual: string;
  };
  stage_1_script: {
    hook_text: string;
    karakter_master: CharacterMaster;
    setting_master: SettingMaster;
    scenes: GeneratedScene[];
  };
  stage_2_assets: {
    character_turnaround_prompt: string;
    setting_prompts: string[];
  };
  stage_4_metadata: GeneratedMetadataOptions;
}

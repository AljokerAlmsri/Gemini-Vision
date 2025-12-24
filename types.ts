
export type AspectRatio = '1:1' | '16:9' | '9:16' | '4:3' | '3:4';

export interface GeneratedImage {
  id: string;
  url: string;
  prompt: string;
  timestamp: number;
  aspectRatio: AspectRatio;
  isPro: boolean;
}

export interface GenerationParams {
  prompt: string;
  aspectRatio: AspectRatio;
  isPro: boolean;
}

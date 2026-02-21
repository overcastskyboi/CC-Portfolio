import { describe, it, expect } from 'vitest';
import { MusicManifestSchema } from '../data/schemas';
import musicManifest from '../data/music_manifest.json';

describe('API & Data Integrity Tests', () => {
  it('should validate the music_manifest.json structure', () => {
    const result = MusicManifestSchema.safeParse(musicManifest);
    if (!result.success) {
      console.error('Validation Errors:', result.error.format());
    }
    expect(result.success).toBe(true);
  });

  it('should verify all music tracks have valid URLs', () => {
    musicManifest.forEach(album => {
      album.tracks.forEach(track => {
        expect(track.url).toMatch(/^https?:\/\//);
      });
    });
  });

  it('should check if Proxy URL is defined in production-like environments (CI)', () => {
    // This is more of a configuration check
    const proxyUrl = process.env.VITE_PROXY_URL;
    if (process.env.NODE_ENV === 'production') {
      expect(proxyUrl).toBeDefined();
    }
  });
});

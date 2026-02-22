import { z } from 'zod';

export const MediaSchema = z.object({
  id: z.number().optional(),
  title: z.string(),
  type: z.enum(['Anime', 'Manga', 'Game', 'Music']),
  score: z.number().min(0).max(10).optional(),
  progress: z.string().optional(),
  status: z.enum(['Reading', 'Watching', 'Completed', 'Plan to Watch', 'Paused', 'Dropped']),
  coverImage: z.string().url().optional(),
  updatedAt: z.string().optional(),
});

export const APIResponseSchema = z.object({
  data: z.array(MediaSchema),
  meta: z.object({
    total: z.number(),
    page: z.number(),
    lastPage: z.number(),
  }).optional(),
});

export const TrackSchema = z.object({
  title: z.string(),
  track_number: z.number().nullable().optional(),
  url: z.string().url(),
  duration: z.string().optional(),
});

export const AlbumSchema = z.object({
  album_name: z.string(),
  artist: z.string(),
  type: z.enum(['Single', 'Album', 'EP', 'LP']),
  cover_url: z.string().url(),
  tracks: z.array(TrackSchema),
  releaseDate: z.string(),
});

export const MusicManifestSchema = z.array(AlbumSchema).refine(
  (albums) => albums.every(album => album.tracks.length > 0),
  {
    message: 'Each album must contain at least one track',
    code: 'invalid_manifest',
  }
);

export const CoverSchema = z.object({
  title: z.string(),
  coverImage: z.string().url(),
});

export const AnimeCoversSchema = z.array(CoverSchema);
export const GameCoversSchema = z.array(CoverSchema);

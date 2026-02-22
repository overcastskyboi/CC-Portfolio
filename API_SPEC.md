# CherryOS API Specifications

All external data in CherryOS is strictly validated using **Zod** schemas to ensure frontend stability and security.

## 1. Music Manifest API

**Source**: `https://objectstorage.us-ashburn-1.oraclecloud.com/.../music_manifest.json`

### `AlbumSchema`
| Parameter | Type | Description |
| :--- | :--- | :--- |
| `album_name` | `string` | Title of the collection |
| `artist` | `string` | Artist name (e.g., Colin Cherry) |
| `type` | `enum` | `'Single'`, `'Album'`, `'EP'`, `'LP'` |
| `cover_url` | `string (url)` | Fully qualified URL to album art |
| `tracks` | `Array<Track>` | List of audio tracks |

### `TrackSchema`
| Parameter | Type | Description |
| :--- | :--- | :--- |
| `title` | `string` | Track name |
| `track_number`| `int \| null` | Order in album |
| `url` | `string (url)` | Direct URL to `.wav` or `.mp3` file |
| `duration` | `string?` | Optional duration (e.g., "3:45") |

## 2. Watch List (AniList) Integration

**Proxy Pattern**: Data is routed through `VITE_PROXY_URL` to hide API keys.

### `MediaSchema`
| Parameter | Type | Description |
| :--- | :--- | :--- |
| `title` | `string` | Display title |
| `type` | `enum` | `'Anime'`, `'Manga'`, `'Game'`, `'Music'` |
| `score` | `float (0-10)` | User rating |
| `status` | `enum` | `'Watching'`, `'Completed'`, etc. |
| `progress` | `string` | e.g., "12/24 Eps" |

## 3. Error Codes & Handling

| Context | Error | Description |
| :--- | :--- | :--- |
| **Fetching** | `Connection failed` | Network issue or CORS rejection |
| **Validation** | `ZodError` | Data structure mismatch (check `schemas.js`) |
| **Audio** | `Autoplay blocked` | Browser policy prevented sound from starting |

## 4. Security Pattern
**Zero-Exposure Policy**:
- API Keys are **never** stored in the repository.
- Use `import.meta.env.VITE_PROXY_URL` for authenticated requests.
- Fail-over: If proxy is undefined, the app switches to **Demo Mode** using `src/data/constants.js`.

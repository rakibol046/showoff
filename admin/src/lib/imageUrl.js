const BASE = import.meta.env.VITE_IMAGE_URL || "";

// Placeholder — shown when an image path is missing or fails to load
export const IMG_FALLBACK =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'%3E%3Crect width='80' height='80' fill='%23f1f5f9'/%3E%3Cpath d='M28 52l10-14 7 9 5-6 10 11H28z' fill='%23cbd5e1'/%3E%3Ccircle cx='52' cy='30' r='5' fill='%23cbd5e1'/%3E%3C/svg%3E";

export function imgUrl(path) {
  if (!path) return IMG_FALLBACK;
  if (path.startsWith("http://") || path.startsWith("https://") || path.startsWith("data:")) return path;
  return `${BASE}${path}`;
}

export function onImgError(e) {
  if (e.target.src !== IMG_FALLBACK) {
    e.target.src = IMG_FALLBACK;
  }
}

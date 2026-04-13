const DEFAULT_API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  (process.env.NODE_ENV === 'production' ? '/_/backend' : 'http://localhost:8080');

export function getApiUrl(path: string): string {
  return `${DEFAULT_API_BASE_URL}${path}`;
}

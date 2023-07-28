const isClient = typeof window !== 'undefined';

export function useIsClient() {
  return isClient;
}

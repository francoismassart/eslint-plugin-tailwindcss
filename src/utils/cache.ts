import { PluginTailwindcssSettings } from "../utils/parse-plugin-settings";

type CacheOptions = {
  cacheMaxSize: number;
  cacheMaxAge: number;
};

export const getCacheSettings = (
  settings: PluginTailwindcssSettings,
): CacheOptions => {
  const cacheMaxSize = settings.cacheMaxSize || 0;
  const cacheMaxAge = settings.cacheMaxAge || 0;
  return { cacheMaxSize, cacheMaxAge };
};

type CacheObject = Set<unknown> | Map<unknown, unknown>;

export const resetCache = (
  cache: CacheObject,
  { cacheMaxSize, cacheMaxAge }: CacheOptions,
  cacheCreationTime: number = Date.now(),
) => {
  if (
    cache.size > cacheMaxSize ||
    Date.now() - cacheCreationTime > cacheMaxAge
  ) {
    cache.clear();
    return Date.now();
  }
  return -1;
};

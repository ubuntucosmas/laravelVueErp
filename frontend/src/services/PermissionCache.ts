interface PermissionCache {
  [key: string]: boolean
}

const cache: PermissionCache = {}

export const permissionCache = {
  get: (key: string): boolean | undefined => {
    return cache[key]
  },
  set: (key: string, value: boolean): void => {
    cache[key] = value
  },
  has: (key: string): boolean => {
    return key in cache
  },
  clear: (): void => {
    Object.keys(cache).forEach(key => delete cache[key])
  }
}

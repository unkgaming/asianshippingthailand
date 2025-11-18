import { LRUCache } from 'lru-cache';

// In-memory cache for high-performance reads
// Reduces database load for frequently accessed data
const cache = new LRUCache<string, any>({
  max: 500, // Maximum 500 items
  ttl: 1000 * 60 * 5, // 5 minutes
  allowStale: false,
  updateAgeOnGet: true,
  updateAgeOnHas: false,
});

export const cacheKeys = {
  shipment: (id: string) => `shipment:${id}`,
  shipmentByCode: (code: string) => `shipment:code:${code}`,
  shipmentsByCustomer: (email: string) => `shipments:customer:${email}`,
  inquiry: (id: string) => `inquiry:${id}`,
  inquiries: (limit: number) => `inquiries:list:${limit}`,
  emailMessages: (limit: number) => `emails:list:${limit}`,
  user: (email: string) => `user:${email}`,
};

export const cacheService = {
  get: <T>(key: string): T | undefined => {
    return cache.get(key) as T | undefined;
  },

  set: (key: string, value: any, ttl?: number): void => {
    cache.set(key, value, { ttl });
  },

  delete: (key: string): void => {
    cache.delete(key);
  },

  clear: (): void => {
    cache.clear();
  },

  // Invalidate related caches
  invalidateShipment: (id: string, code?: string, customerEmail?: string): void => {
    cache.delete(cacheKeys.shipment(id));
    if (code) cache.delete(cacheKeys.shipmentByCode(code));
    if (customerEmail) cache.delete(cacheKeys.shipmentsByCustomer(customerEmail));
  },

  invalidateInquiries: (): void => {
    // Clear all inquiry list caches
    for (const key of cache.keys()) {
      if (key.startsWith('inquiries:')) {
        cache.delete(key);
      }
    }
  },

  invalidateEmails: (): void => {
    // Clear all email list caches
    for (const key of cache.keys()) {
      if (key.startsWith('emails:')) {
        cache.delete(key);
      }
    }
  },

  // Get cache statistics
  getStats: () => {
    return {
      size: cache.size,
      max: cache.max,
      calculatedSize: cache.calculatedSize,
    };
  },
};

export default cacheService;

import { RateLimiter } from 'limiter';
import { NextRequest } from 'next/server';

// Rate limiters for different endpoints
const limiters = new Map<string, RateLimiter>();

// Get client identifier (IP address or user email)
export function getClientId(req: NextRequest, userEmail?: string): string {
  if (userEmail) return `user:${userEmail}`;
  
  const forwarded = req.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0] : req.headers.get('x-real-ip') || 'unknown';
  return `ip:${ip}`;
}

// Create or get rate limiter for a client
function getRateLimiter(clientId: string, tokensPerInterval: number, interval: 'second' | 'minute' | 'hour' | 'day'): RateLimiter {
  const key = `${clientId}:${tokensPerInterval}:${interval}`;
  
  if (!limiters.has(key)) {
    limiters.set(key, new RateLimiter({ 
      tokensPerInterval, 
      interval 
    }));
  }
  
  return limiters.get(key)!;
}

// Rate limiting configurations for different endpoints
export const rateLimitConfig = {
  // Contact form: 5 requests per minute per IP
  contact: { tokensPerInterval: 5, interval: 'minute' as const },
  
  // API reads: 100 requests per minute per user
  apiRead: { tokensPerInterval: 100, interval: 'minute' as const },
  
  // API writes: 20 requests per minute per user
  apiWrite: { tokensPerInterval: 20, interval: 'minute' as const },
  
  // Authentication: 10 attempts per minute per IP
  auth: { tokensPerInterval: 10, interval: 'minute' as const },
  
  // File uploads: 10 per hour per user
  upload: { tokensPerInterval: 10, interval: 'hour' as const },
};

// Check rate limit
export async function checkRateLimit(
  clientId: string,
  config: { tokensPerInterval: number; interval: 'second' | 'minute' | 'hour' | 'day' }
): Promise<{ allowed: boolean; remaining: number; reset: Date }> {
  const limiter = getRateLimiter(clientId, config.tokensPerInterval, config.interval);
  
  try {
    const allowed = await limiter.tryRemoveTokens(1);
    const remaining = limiter.getTokensRemaining();
    
    // Calculate reset time
    const intervalMs = {
      second: 1000,
      minute: 60000,
      hour: 3600000,
      day: 86400000,
    }[config.interval];
    
    const reset = new Date(Date.now() + intervalMs);
    
    return { allowed, remaining, reset };
  } catch (error) {
    // On error, allow the request but log it
    console.error('[RateLimit] Error checking rate limit:', error);
    return { allowed: true, remaining: 0, reset: new Date() };
  }
}

// Middleware helper for rate limiting
export async function rateLimitMiddleware(
  req: NextRequest,
  configKey: keyof typeof rateLimitConfig,
  userEmail?: string
): Promise<{ allowed: boolean; headers: Record<string, string> }> {
  const clientId = getClientId(req, userEmail);
  const config = rateLimitConfig[configKey];
  
  const { allowed, remaining, reset } = await checkRateLimit(clientId, config);
  
  const headers = {
    'X-RateLimit-Limit': String(config.tokensPerInterval),
    'X-RateLimit-Remaining': String(remaining),
    'X-RateLimit-Reset': reset.toISOString(),
  };
  
  return { allowed, headers };
}

// Clean up old limiters periodically (prevent memory leaks)
setInterval(() => {
  const now = Date.now();
  for (const [key, limiter] of limiters.entries()) {
    // Remove limiters that haven't been used in 10 minutes
    if (now - (limiter as any).lastUsed > 600000) {
      limiters.delete(key);
    }
  }
}, 300000); // Run every 5 minutes

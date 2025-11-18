import { prisma } from './prisma';
import { Prisma } from '@prisma/client';

// Transaction wrapper with retry logic for handling concurrent updates
export async function withRetry<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  delayMs: number = 100
): Promise<T> {
  let lastError: any;
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error: any) {
      lastError = error;
      
      // Retry on deadlock, serialization failure, or optimistic locking errors
      const shouldRetry = 
        error.code === 'P2034' || // Transaction conflict
        error.code === '40001' || // Serialization failure
        error.code === '40P01' || // Deadlock detected
        (error.message && error.message.includes('version'));
      
      if (!shouldRetry || attempt === maxRetries - 1) {
        throw error;
      }
      
      // Exponential backoff
      const delay = delayMs * Math.pow(2, attempt);
      await new Promise(resolve => setTimeout(resolve, delay));
      
      console.log(`[Transaction] Retry attempt ${attempt + 1} after ${delay}ms`);
    }
  }
  
  throw lastError;
}

// Transaction helper with automatic retry
export async function executeTransaction<T>(
  callback: (tx: Prisma.TransactionClient) => Promise<T>,
  maxRetries: number = 3
): Promise<T> {
  return withRetry(
    () => prisma.$transaction(callback, {
      maxWait: 5000, // 5 seconds
      timeout: 10000, // 10 seconds
      isolationLevel: Prisma.TransactionIsolationLevel.ReadCommitted,
    }),
    maxRetries
  );
}

// Batch operations for better performance
export async function batchCreate<T>(
  model: any,
  data: any[],
  batchSize: number = 100
): Promise<T[]> {
  const results: T[] = [];
  
  for (let i = 0; i < data.length; i += batchSize) {
    const batch = data.slice(i, i + batchSize);
    const created = await model.createMany({
      data: batch,
      skipDuplicates: true,
    });
    results.push(...created);
  }
  
  return results;
}

// Optimistic update helper
export async function optimisticUpdate(
  model: 'shipment' | 'inquiry',
  id: string,
  currentVersion: number,
  updateData: any
): Promise<any> {
  return withRetry(async () => {
    if (model === 'shipment') {
      // Verify version hasn't changed
      const current = await prisma.shipment.findUnique({
        where: { id },
        select: { version: true },
      });
      
      if (!current) {
        throw new Error('Shipment not found');
      }
      
      if (current.version !== currentVersion) {
        throw new Error('Conflict: Shipment was modified by another user');
      }
      
      // Update with version increment
      return await prisma.shipment.update({
        where: { id },
        data: {
          ...updateData,
          version: { increment: 1 },
        },
      });
    } else {
      // Verify version hasn't changed
      const current = await prisma.inquiry.findUnique({
        where: { id },
        select: { version: true },
      });
      
      if (!current) {
        throw new Error('Inquiry not found');
      }
      
      if (current.version !== currentVersion) {
        throw new Error('Conflict: Inquiry was modified by another user');
      }
      
      // Update with version increment
      return await prisma.inquiry.update({
        where: { id },
        data: {
          ...updateData,
          version: { increment: 1 },
        },
      });
    }
  });
}

export default {
  withRetry,
  executeTransaction,
  batchCreate,
  optimisticUpdate,
};

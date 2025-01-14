import { describe, it, expect } from 'vitest';
import { generateUUID, getStartOfMonth, getEndOfMonth } from '../helpers';

describe('Helper Functions', () => {
  it('should generate a valid UUID', () => {
    const uuid = generateUUID();
    expect(uuid).toBeDefined();
    expect(uuid).toMatch(/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/);
  });

  it('should get the start of the month correctly', () => {
    const date = new Date('2024-08-15');
    const startOfMonth = getStartOfMonth(date);
    expect(startOfMonth.toISOString().slice(0, 10)).toEqual('2024-08-01');
  });

  it('should get the end of the month correctly', () => {
    const date = new Date('2024-08-15');
    const endOfMonth = getEndOfMonth(date);
    expect(endOfMonth.toISOString().slice(0, 10)).toEqual('2024-09-01');
  });
});

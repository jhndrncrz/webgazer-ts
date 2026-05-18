import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock localforage before importing StorageManager
vi.mock('localforage', () => {
  const store: Record<string, unknown> = {};
  const mockInstance = {
    setItem: vi.fn(async (key: string, val: unknown) => { store[key] = val; }),
    getItem: vi.fn(async (key: string) => store[key] ?? null),
    removeItem: vi.fn(async (key: string) => { delete store[key]; }),
    clear: vi.fn(async () => { for (const k of Object.keys(store)) delete store[k]; }),
    keys: vi.fn(async () => Object.keys(store)),
    length: vi.fn(async () => Object.keys(store).length),
    iterate: vi.fn(async (fn: (v: unknown, k: string, n: number) => void) => {
      let i = 0;
      for (const [k, v] of Object.entries(store)) fn(v, k, i++);
    }),
    driver: vi.fn(() => 'asyncStorage'),
  };

  return {
    default: {
      createInstance: vi.fn(() => mockInstance),
    },
  };
});

import { StorageManager } from '../../../utils/data/StorageManager';

describe('StorageManager', () => {
  let manager: StorageManager;

  beforeEach(() => {
    vi.clearAllMocks();
    manager = new StorageManager('test-store');
  });

  it('saves and loads a value', async () => {
    await manager.save('foo', { bar: 42 });
    const loaded = await manager.load<{ bar: number }>('foo');
    expect(loaded).toEqual({ bar: 42 });
  });

  it('returns null for missing key', async () => {
    const loaded = await manager.load('nonexistent');
    expect(loaded).toBeNull();
  });

  it('exists() returns correct boolean', async () => {
    await manager.save('exists-key', 'value');
    expect(await manager.exists('exists-key')).toBe(true);
    expect(await manager.exists('missing-key')).toBe(false);
  });

  it('remove() deletes a key', async () => {
    await manager.save('remove-key', 'data');
    await manager.remove('remove-key');
    expect(await manager.load('remove-key')).toBeNull();
  });

  it('clear() removes all keys', async () => {
    await manager.save('k1', 1);
    await manager.save('k2', 2);
    await manager.clear();
    expect(await manager.load('k1')).toBeNull();
    expect(await manager.load('k2')).toBeNull();
  });

  it('keys() returns all stored keys', async () => {
    await manager.save('a', 1);
    await manager.save('b', 2);
    const keys = await manager.keys();
    expect(keys).toContain('a');
    expect(keys).toContain('b');
  });

  it('length() returns item count', async () => {
    // Clear first to isolate from prior tests
    await manager.clear();
    await manager.save('x', 1);
    await manager.save('y', 2);
    expect(await manager.length()).toBe(2);
  });
});

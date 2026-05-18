import { describe, it, expect } from 'vitest';
import { DataWindow } from '../../../utils/data/DataWindow';

describe('DataWindow', () => {
  it('throws if capacity is 0 or negative', () => {
    expect(() => new DataWindow(0)).toThrow();
    expect(() => new DataWindow(-1)).toThrow();
  });

  it('starts empty', () => {
    const w = new DataWindow<number>(5);
    expect(w.length).toBe(0);
    expect(w.isEmpty).toBe(true);
    expect(w.isFull).toBe(false);
  });

  it('pushes elements and tracks size', () => {
    const w = new DataWindow<number>(3);
    w.push(1);
    w.push(2);
    expect(w.length).toBe(2);
    expect(w.isFull).toBe(false);

    w.push(3);
    expect(w.length).toBe(3);
    expect(w.isFull).toBe(true);
  });

  it('overwrites oldest element when full (circular buffer)', () => {
    const w = new DataWindow<number>(3);
    w.push(1);
    w.push(2);
    w.push(3);
    w.push(4); // overwrites 1

    expect(w.length).toBe(3);
    expect(w.get(0)).toBe(2); // oldest is now 2
    expect(w.get(1)).toBe(3);
    expect(w.get(2)).toBe(4);
  });

  it('get() throws on out-of-bounds index', () => {
    const w = new DataWindow<number>(3);
    w.push(1);
    expect(() => w.get(-1)).toThrow();
    expect(() => w.get(1)).toThrow(); // only 1 element
  });

  it('toArray() returns elements in logical (oldest-to-newest) order', () => {
    const w = new DataWindow<number>(3);
    w.push(10);
    w.push(20);
    w.push(30);
    w.push(40); // overwrites 10

    expect(w.toArray()).toEqual([20, 30, 40]);
  });

  it('clear() resets the buffer', () => {
    const w = new DataWindow<number>(3);
    w.push(1);
    w.push(2);
    w.clear();
    expect(w.length).toBe(0);
    expect(w.isEmpty).toBe(true);
  });

  it('supports iteration via for...of', () => {
    const w = new DataWindow<number>(3);
    w.push(10);
    w.push(20);
    w.push(30);

    const arr: number[] = [];
    for (const v of w) arr.push(v);
    expect(arr).toEqual([10, 20, 30]);
  });

  it('map() transforms elements', () => {
    const w = new DataWindow<number>(3);
    w.push(1);
    w.push(2);
    w.push(3);

    expect(w.map(x => x * 2)).toEqual([2, 4, 6]);
  });

  it('filter() returns matching elements', () => {
    const w = new DataWindow<number>(4);
    w.push(1);
    w.push(2);
    w.push(3);
    w.push(4);

    expect(w.filter(x => x % 2 === 0)).toEqual([2, 4]);
  });

  it('find() returns first match or undefined', () => {
    const w = new DataWindow<number>(3);
    w.push(1);
    w.push(2);
    w.push(3);

    expect(w.find(x => x > 1)).toBe(2);
    expect(w.find(x => x > 10)).toBeUndefined();
  });

  it('some() returns true if any element matches', () => {
    const w = new DataWindow<number>(3);
    w.push(1);
    w.push(2);
    w.push(3);

    expect(w.some(x => x === 3)).toBe(true);
    expect(w.some(x => x === 99)).toBe(false);
  });

  it('every() returns true if all elements match', () => {
    const w = new DataWindow<number>(3);
    w.push(2);
    w.push(4);
    w.push(6);

    expect(w.every(x => x % 2 === 0)).toBe(true);
    w.push(7); // overwrites 2
    expect(w.every(x => x % 2 === 0)).toBe(false);
  });

  it('forEach() iterates all elements in order', () => {
    const w = new DataWindow<number>(3);
    w.push(5);
    w.push(10);
    w.push(15);

    const result: number[] = [];
    w.forEach(v => result.push(v));
    expect(result).toEqual([5, 10, 15]);
  });
});

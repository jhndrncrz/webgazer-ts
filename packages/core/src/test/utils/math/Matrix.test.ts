import { describe, it, expect } from 'vitest';
import Matrix, { MatrixData } from '../../../utils/math/Matrix';

describe('Matrix', () => {
  const m1: MatrixData = [
    [1, 2, 3],
    [4, 5, 6]
  ];

  const m2: MatrixData = [
    [7, 8],
    [9, 10],
    [11, 12]
  ];

  it('should transpose a matrix', () => {
    const t = Matrix.transpose(m1);
    expect(t).toEqual([
      [1, 4],
      [2, 5],
      [3, 6]
    ]);
  });

  it('should extract rows correctly', () => {
    const extracted = Matrix.getMatrixByRows(m1, [1], 0, 1);
    expect(extracted).toEqual([[4, 5]]);
  });

  it('should extract submatrix correctly', () => {
    const sub = Matrix.getSubMatrix(m2, 0, 1, 0, 1);
    expect(sub).toEqual([
      [7, 8],
      [9, 10]
    ]);
  });

  it('should multiply two matrices', () => {
    const product = Matrix.multiply(m1, m2);
    expect(product).toEqual([
      [58, 64],
      [139, 154]
    ]);
  });

  it('should multiply matrix by scalar', () => {
    const scaled = Matrix.multiplyScalar(m1, 2);
    expect(scaled).toEqual([
      [2, 4, 6],
      [8, 10, 12]
    ]);
  });

  it('should add two matrices', () => {
    const m3: MatrixData = [[1, 1, 1], [1, 1, 1]];
    expect(Matrix.add(m1, m3)).toEqual([
      [2, 3, 4],
      [5, 6, 7]
    ]);
  });

  it('should subtract two matrices', () => {
    const m3: MatrixData = [[1, 1, 1], [1, 1, 1]];
    expect(Matrix.subtract(m1, m3)).toEqual([
      [0, 1, 2],
      [3, 4, 5]
    ]);
  });

  it('should calculate identity matrix', () => {
    expect(Matrix.identity(3)).toEqual([
      [1, 0, 0],
      [0, 1, 0],
      [0, 0, 1]
    ]);
  });

  it('should solve linear system using LU decomposition for square matrices', () => {
    // 2x + y = 5
    // x + y = 3
    // Solution: x = 2, y = 1
    const A: MatrixData = [[2, 1], [1, 1]];
    const B: MatrixData = [[5], [3]];
    const x = Matrix.solve(A, B);
    
    // Allow small floating point differences
    expect(x[0][0]).toBeCloseTo(2);
    expect(x[1][0]).toBeCloseTo(1);
  });
  
  it('should inverse a matrix', () => {
    const A: MatrixData = [[4, 7], [2, 6]];
    const inv = Matrix.inverse(A);
    // inv = (1/10) * [6 -7; -2 4] = [0.6 -0.7; -0.2 0.4]
    expect(inv[0][0]).toBeCloseTo(0.6);
    expect(inv[0][1]).toBeCloseTo(-0.7);
    expect(inv[1][0]).toBeCloseTo(-0.2);
    expect(inv[1][1]).toBeCloseTo(0.4);
  });
});

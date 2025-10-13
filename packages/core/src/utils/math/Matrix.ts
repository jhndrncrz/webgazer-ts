/**
 * Matrix operations utility class
 * Provides comprehensive linear algebra operations for Webgazer
 */

export type MatrixData = number[][];

/**
 * Matrix class for linear algebra operations
 * Provides methods for matrix manipulation, arithmetic, and decomposition
 */
export class Matrix {
  /**
   * Transpose a matrix (swap rows and columns)
   * @param matrix - Input matrix
   * @returns Transposed matrix
   */
  static transpose(matrix: MatrixData): MatrixData {
    const rowCount = matrix.length;
    const columnCount = matrix[0].length;
    const transposed: MatrixData = new Array(columnCount);
    
    for (let column = 0; column < columnCount; column++) {
      transposed[column] = new Array(rowCount);
      for (let row = 0; row < rowCount; row++) {
        transposed[column][row] = matrix[row][column];
      }
    }
    
    return transposed;
  }

  /**
   * Extract rows from matrix by indices
   * @param matrix - Source matrix
   * @param rowIndices - Array of row indices to extract
   * @param columnStart - Starting column index
   * @param columnEnd - Ending column index (inclusive)
   * @returns New matrix with selected rows
   */
  static getMatrixByRows(
    matrix: MatrixData,
    rowIndices: number[],
    columnStart: number,
    columnEnd: number
  ): MatrixData {
    const result: MatrixData = new Array(rowIndices.length);
    const columnCount = columnEnd - columnStart + 1;
    
    for (let i = 0; i < rowIndices.length; i++) {
      result[i] = new Array(columnCount);
      for (let column = columnStart; column <= columnEnd; column++) {
        result[i][column - columnStart] = matrix[rowIndices[i]][column];
      }
    }
    
    return result;
  }

  /**
   * Extract submatrix by row and column ranges
   * @param matrix - Source matrix
   * @param rowStart - Starting row index
   * @param rowEnd - Ending row index (inclusive)
   * @param columnStart - Starting column index
   * @param columnEnd - Ending column index (inclusive)
   * @returns Extracted submatrix
   */
  static getSubMatrix(
    matrix: MatrixData,
    rowStart: number,
    rowEnd: number,
    columnStart: number,
    columnEnd: number
  ): MatrixData {
    const columnCount = columnEnd - columnStart + 1;
    const result: MatrixData = new Array(rowEnd - rowStart + 1);
    
    for (let row = rowStart; row <= rowEnd; row++) {
      const subRowIndex = row - rowStart;
      result[subRowIndex] = new Array(columnCount);
      for (let column = columnStart; column <= columnEnd; column++) {
        result[subRowIndex][column - columnStart] = matrix[row][column];
      }
    }
    
    return result;
  }

  /**
   * Multiply two matrices
   * @param matrixA - First matrix (m × n)
   * @param matrixB - Second matrix (n × p)
   * @returns Product matrix (m × p)
   * @throws Error if inner dimensions don't match
   */
  static multiply(matrixA: MatrixData, matrixB: MatrixData): MatrixData {
    if (matrixB.length !== matrixA[0].length) {
      throw new Error(
        `Matrix inner dimensions must agree. Got ${matrixA[0].length} and ${matrixB.length}`
      );
    }
    
    const resultRowCount = matrixA.length;
    const resultColumnCount = matrixB[0].length;
    const innerDimension = matrixA[0].length;
    
    const result: MatrixData = new Array(resultRowCount);
    const columnBuffer = new Array(innerDimension);
    
    for (let column = 0; column < resultColumnCount; column++) {
      // Extract column from matrixB for cache efficiency
      for (let k = 0; k < innerDimension; k++) {
        columnBuffer[k] = matrixB[k][column];
      }
      
      for (let row = 0; row < resultRowCount; row++) {
        if (column === 0) {
          result[row] = new Array(resultColumnCount);
        }
        
        const rowData = matrixA[row];
        let sum = 0;
        
        for (let k = 0; k < innerDimension; k++) {
          sum += rowData[k] * columnBuffer[k];
        }
        
        result[row][column] = sum;
      }
    }
    
    return result;
  }

  /**
   * Multiply matrix by scalar
   * @param matrix - Input matrix
   * @param scalar - Scalar value
   * @returns Scaled matrix
   */
  static multiplyScalar(matrix: MatrixData, scalar: number): MatrixData {
    const rowCount = matrix.length;
    const columnCount = matrix[0].length;
    const result: MatrixData = new Array(rowCount);
    
    for (let row = 0; row < rowCount; row++) {
      result[row] = new Array(columnCount);
      for (let column = 0; column < columnCount; column++) {
        result[row][column] = matrix[row][column] * scalar;
      }
    }
    
    return result;
  }

  /**
   * Add two matrices element-wise
   * @param matrixA - First matrix
   * @param matrixB - Second matrix
   * @returns Sum matrix
   * @throws Error if dimensions don't match
   */
  static add(matrixA: MatrixData, matrixB: MatrixData): MatrixData {
    return Matrix.applyElementWiseOperation(matrixA, matrixB, (a, b) => a + b);
  }

  /**
   * Subtract two matrices element-wise
   * @param matrixA - First matrix
   * @param matrixB - Second matrix (subtracted from first)
   * @returns Difference matrix
   * @throws Error if dimensions don't match
   */
  static subtract(matrixA: MatrixData, matrixB: MatrixData): MatrixData {
    return Matrix.applyElementWiseOperation(matrixA, matrixB, (a, b) => a - b);
  }

  /**
   * Compute matrix inverse using LU decomposition
   * @param matrix - Square matrix to invert
   * @returns Inverse matrix
   * @throws Error if matrix is singular or non-square
   */
  static inverse(matrix: MatrixData): MatrixData {
    return Matrix.solve(matrix, Matrix.identity(matrix.length, matrix[0].length));
  }

  /**
   * Create identity matrix
   * @param rowCount - Number of rows
   * @param columnCount - Number of columns (defaults to rowCount for square matrix)
   * @returns Identity matrix
   */
  static identity(rowCount: number, columnCount: number = rowCount): MatrixData {
    const result: MatrixData = new Array(rowCount);
    
    for (let row = 0; row < rowCount; row++) {
      result[row] = new Array(columnCount);
      for (let column = 0; column < columnCount; column++) {
        result[row][column] = row === column ? 1 : 0;
      }
    }
    
    return result;
  }

  /**
   * Solve linear system Ax = B
   * @param matrixA - Coefficient matrix
   * @param matrixB - Right-hand side matrix
   * @returns Solution matrix x
   */
  static solve(matrixA: MatrixData, matrixB: MatrixData): MatrixData {
    // Use LU decomposition for square matrices, QR for rectangular
    if (matrixA.length === matrixA[0].length) {
      return Matrix.solveLU(matrixA, matrixB);
    }
    return Matrix.solveQR(matrixA, matrixB);
  }

  /**
   * Solve linear system using LU decomposition with partial pivoting
   * @param matrixA - Square coefficient matrix
   * @param matrixB - Right-hand side matrix
   * @returns Solution matrix
   */
  static solveLU(matrixA: MatrixData, matrixB: MatrixData): MatrixData {
    const rowCount = matrixA.length;
    const columnCount = matrixA[0].length;
    
    // Create copy of A for LU decomposition
    const luMatrix: MatrixData = new Array(rowCount);
    for (let i = 0; i < rowCount; i++) {
      luMatrix[i] = new Array(columnCount);
      for (let j = 0; j < columnCount; j++) {
        luMatrix[i][j] = matrixA[i][j];
      }
    }
    
    // Initialize pivot array
    const pivotIndices = new Array(rowCount).fill(0).map((_, index) => index);
    const columnBuffer = new Array(rowCount);
    
    // Perform LU decomposition with partial pivoting
    for (let column = 0; column < columnCount; column++) {
      // Copy column for processing
      for (let i = 0; i < rowCount; i++) {
        columnBuffer[i] = luMatrix[i][column];
      }
      
      // Apply previous transformations
      for (let row = 0; row < rowCount; row++) {
        const rowData = luMatrix[row];
        const maxK = Math.min(row, column);
        let sum = 0;
        
        for (let k = 0; k < maxK; k++) {
          sum += rowData[k] * columnBuffer[k];
        }
        
        rowData[column] = columnBuffer[row] -= sum;
      }
      
      // Find pivot
      let pivotRow = column;
      for (let row = column + 1; row < rowCount; row++) {
        if (Math.abs(columnBuffer[row]) > Math.abs(columnBuffer[pivotRow])) {
          pivotRow = row;
        }
      }
      
      // Exchange rows if needed
      if (pivotRow !== column) {
        for (let k = 0; k < columnCount; k++) {
          const temp = luMatrix[pivotRow][k];
          luMatrix[pivotRow][k] = luMatrix[column][k];
          luMatrix[column][k] = temp;
        }
        
        const tempIndex = pivotIndices[pivotRow];
        pivotIndices[pivotRow] = pivotIndices[column];
        pivotIndices[column] = tempIndex;
      }
      
      // Compute multipliers
      if (column < rowCount && luMatrix[column][column] !== 0) {
        for (let row = column + 1; row < rowCount; row++) {
          luMatrix[row][column] /= luMatrix[column][column];
        }
      }
    }
    
    // Check dimensions
    if (matrixB.length !== rowCount) {
      throw new Error('Matrix row dimensions must agree');
    }
    
    // Check for singularity
    for (let column = 0; column < columnCount; column++) {
      if (luMatrix[column][column] === 0) {
        throw new Error('Matrix is singular');
      }
    }
    
    // Solve using forward and backward substitution
    const solutionColumnCount = matrixB[0].length;
    const solution = Matrix.getMatrixByRows(matrixB, pivotIndices, 0, solutionColumnCount - 1);
    
    // Forward substitution (Ly = Pb)
    for (let k = 0; k < columnCount; k++) {
      for (let row = k + 1; row < columnCount; row++) {
        for (let column = 0; column < solutionColumnCount; column++) {
          solution[row][column] -= solution[k][column] * luMatrix[row][k];
        }
      }
    }
    
    // Backward substitution (Ux = y)
    for (let k = columnCount - 1; k >= 0; k--) {
      for (let column = 0; column < solutionColumnCount; column++) {
        solution[k][column] /= luMatrix[k][k];
      }
      for (let row = 0; row < k; row++) {
        for (let column = 0; column < solutionColumnCount; column++) {
          solution[row][column] -= solution[k][column] * luMatrix[row][k];
        }
      }
    }
    
    return solution;
  }

  /**
   * Solve linear system using QR decomposition
   * @param matrixA - Coefficient matrix (can be rectangular)
   * @param matrixB - Right-hand side matrix
   * @returns Least-squares solution matrix
   */
  static solveQR(matrixA: MatrixData, matrixB: MatrixData): MatrixData {
    const rowCount = matrixA.length;
    const columnCount = matrixA[0].length;
    
    // Create copy of A for QR decomposition
    const qrMatrix: MatrixData = new Array(rowCount);
    for (let i = 0; i < rowCount; i++) {
      qrMatrix[i] = new Array(columnCount);
      for (let j = 0; j < columnCount; j++) {
        qrMatrix[i][j] = matrixA[i][j];
      }
    }
    
    const rDiagonal = new Array(columnCount);
    
    // Perform QR decomposition using Householder reflections
    for (let k = 0; k < columnCount; k++) {
      // Compute 2-norm of column k
      let norm = 0;
      for (let row = k; row < rowCount; row++) {
        norm = Math.hypot(norm, qrMatrix[row][k]);
      }
      
      if (norm !== 0) {
        // Form k-th Householder vector
        if (qrMatrix[k][k] < 0) {
          norm = -norm;
        }
        
        for (let row = k; row < rowCount; row++) {
          qrMatrix[row][k] /= norm;
        }
        
        qrMatrix[k][k] += 1;
        
        // Apply transformation to remaining columns
        for (let column = k + 1; column < columnCount; column++) {
          let sum = 0;
          for (let row = k; row < rowCount; row++) {
            sum += qrMatrix[row][k] * qrMatrix[row][column];
          }
          
          sum = -sum / qrMatrix[k][k];
          
          for (let row = k; row < rowCount; row++) {
            qrMatrix[row][column] += sum * qrMatrix[row][k];
          }
        }
      }
      
      rDiagonal[k] = -norm;
    }
    
    // Check dimensions
    if (matrixB.length !== rowCount) {
      throw new Error('Matrix row dimensions must agree');
    }
    
    // Check for rank deficiency
    for (let column = 0; column < columnCount; column++) {
      if (rDiagonal[column] === 0) {
        throw new Error('Matrix is rank deficient');
      }
    }
    
    // Create copy of B
    const solutionColumnCount = matrixB[0].length;
    const solution: MatrixData = new Array(matrixB.length);
    for (let row = 0; row < matrixB.length; row++) {
      solution[row] = new Array(matrixB[0].length);
      for (let column = 0; column < matrixB[0].length; column++) {
        solution[row][column] = matrixB[row][column];
      }
    }
    
    // Compute Q^T * B
    for (let k = 0; k < columnCount; k++) {
      for (let column = 0; column < solutionColumnCount; column++) {
        let sum = 0;
        for (let row = k; row < rowCount; row++) {
          sum += qrMatrix[row][k] * solution[row][column];
        }
        
        sum = -sum / qrMatrix[k][k];
        
        for (let row = k; row < rowCount; row++) {
          solution[row][column] += sum * qrMatrix[row][k];
        }
      }
    }
    
    // Solve R * X = Q^T * B
    for (let k = columnCount - 1; k >= 0; k--) {
      for (let column = 0; column < solutionColumnCount; column++) {
        solution[k][column] /= rDiagonal[k];
      }
      
      for (let row = 0; row < k; row++) {
        for (let column = 0; column < solutionColumnCount; column++) {
          solution[row][column] -= solution[k][column] * qrMatrix[row][k];
        }
      }
    }
    
    return Matrix.getSubMatrix(solution, 0, columnCount - 1, 0, solutionColumnCount - 1);
  }

  /**
   * Apply element-wise operation to two matrices
   * @param matrixA - First matrix
   * @param matrixB - Second matrix
   * @param operation - Binary operation to apply
   * @returns Result matrix
   * @throws Error if dimensions don't match
   */
  private static applyElementWiseOperation(
    matrixA: MatrixData,
    matrixB: MatrixData,
    operation: (a: number, b: number) => number
  ): MatrixData {
    if (matrixA.length !== matrixB.length || matrixA[0].length !== matrixB[0].length) {
      throw new Error('Matrix dimensions must agree');
    }
    
    const rowCount = matrixA.length;
    const columnCount = matrixA[0].length;
    const result: MatrixData = new Array(rowCount);
    
    for (let row = 0; row < rowCount; row++) {
      result[row] = new Array(columnCount);
      for (let column = 0; column < columnCount; column++) {
        result[row][column] = operation(matrixA[row][column], matrixB[row][column]);
      }
    }
    
    return result;
  }
}

export default Matrix;

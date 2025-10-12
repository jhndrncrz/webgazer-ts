export type Matrix = number[][];

function applyArithmeticOperation(A: Matrix, B: Matrix, op: (a: number, b: number) => number): Matrix {
  if (A.length !== B.length || A[0].length !== B[0].length) {
    throw new Error('Matrix dimensions must agree.');
  }
  const rows = A.length;
  const cols = A[0].length;
  const X: Matrix = new Array(rows);
  for (let i = 0; i < rows; i++) {
    X[i] = new Array(cols);
    for (let j = 0; j < cols; j++) {
      X[i][j] = op(A[i][j], B[i][j]);
    }
  }
  return X;
}

export const mat = {
  transpose(matrix: Matrix): Matrix {
    const rows = matrix.length;
    const cols = matrix[0].length;
    const transposedMatrix: Matrix = new Array(cols);
    for (let j = 0; j < cols; j++) {
      transposedMatrix[j] = new Array(rows);
      for (let i = 0; i < rows; i++) {
        transposedMatrix[j][i] = matrix[i][j];
      }
    }
    return transposedMatrix;
  },

  getMatrix(matrix: Matrix, r: number[], j0: number, j1: number): Matrix {
    const X: Matrix = new Array(r.length);
    const m = j1 - j0 + 1;
    for (let i = 0, len = r.length; i < len; i++) {
      X[i] = new Array(m);
      for (let j = j0; j <= j1; j++) {
        X[i][j - j0] = matrix[r[i]][j];
      }
    }
    return X;
  },

  getSubMatrix(matrix: Matrix, i0: number, i1: number, j0: number, j1: number): Matrix {
    const size = j1 - j0 + 1;
    const X: Matrix = new Array(i1 - i0 + 1);
    for (let i = i0; i <= i1; i++) {
      const subI = i - i0;
      X[subI] = new Array(size);
      for (let j = j0; j <= j1; j++) {
        X[subI][j - j0] = matrix[i][j];
      }
    }
    return X;
  },

  mult(A: Matrix, B: Matrix): Matrix {
    if (B.length !== A[0].length) {
      console.warn('Matrix inner dimensions must agree');
    }
    const X: Matrix = new Array(A.length);
    const Bcolj = new Array(A[0].length);
    for (let j = 0; j < B[0].length; j++) {
      for (let k = 0; k < A[0].length; k++) {
        Bcolj[k] = B[k][j];
      }
      for (let i = 0; i < A.length; i++) {
        if (j === 0) X[i] = new Array(B[0].length);
        const Arowi = A[i];
        let s = 0;
        for (let k = 0; k < A[0].length; k++) {
          s += Arowi[k] * Bcolj[k];
        }
        X[i][j] = s;
      }
    }
    return X;
  },

  multScalar(A: Matrix, s: number): Matrix {
    const rows = A.length;
    const cols = A[0].length;
    const X: Matrix = new Array(rows);
    for (let i = 0; i < rows; i++) {
      X[i] = new Array(cols);
      for (let j = 0; j < cols; j++) {
        X[i][j] = A[i][j] * s;
      }
    }
    return X;
  },

  add(A: Matrix, B: Matrix): Matrix {
    return applyArithmeticOperation(A, B, (a, b) => a + b);
  },

  sub(A: Matrix, B: Matrix): Matrix {
    return applyArithmeticOperation(A, B, (a, b) => a - b);
  },

  inv(A: Matrix): Matrix {
    return mat.solve(A, mat.identity(A.length, A[0].length));
  },

  identity(m: number, n: number = m): Matrix {
    const X: Matrix = new Array(m);
    for (let i = 0; i < m; i++) {
      X[i] = new Array(n);
      for (let j = 0; j < n; j++) {
        X[i][j] = i === j ? 1 : 0;
      }
    }
    return X;
  },

  solve(A: Matrix, B: Matrix): Matrix {
    if (A.length === A[0].length) return mat.LUDecomposition(A, B);
    return mat.QRDecomposition(A, B);
  },

  LUDecomposition(A: Matrix, B: Matrix): Matrix {
    const LU: Matrix = new Array(A.length);
    for (let i = 0; i < A.length; i++) {
      LU[i] = new Array(A[0].length);
      for (let j = 0; j < A[0].length; j++) LU[i][j] = A[i][j];
    }
    const m = A.length;
    const n = A[0].length;
    const piv = new Array(m).fill(0).map((_, i) => i);
    const LUcolj = new Array(m);
    for (let j = 0; j < n; j++) {
      for (let i = 0; i < m; i++) LUcolj[i] = LU[i][j];
      for (let i = 0; i < m; i++) {
        const LUrowi = LU[i];
        const kmax = Math.min(i, j);
        let s = 0;
        for (let k = 0; k < kmax; k++) s += LUrowi[k] * LUcolj[k];
        LUrowi[j] = LUcolj[i] -= s;
      }
      let p = j;
      for (let i = j + 1; i < m; i++) if (Math.abs(LUcolj[i]) > Math.abs(LUcolj[p])) p = i;
      if (p !== j) {
        for (let k = 0; k < n; k++) {
          const t = LU[p][k];
          LU[p][k] = LU[j][k];
          LU[j][k] = t;
        }
        const tmp = piv[p];
        piv[p] = piv[j];
        piv[j] = tmp;
      }
      if (j < m && LU[j][j] !== 0) for (let i = j + 1; i < m; i++) LU[i][j] /= LU[j][j];
    }
    if (B.length !== m) console.warn('Matrix row dimensions must agree.');
    for (let j = 0; j < n; j++) if (LU[j][j] === 0) console.warn('Matrix is singular');
    const nx = B[0].length;
    const X = mat.getMatrix(B, piv, 0, nx - 1);
    for (let k = 0; k < n; k++) {
      for (let i = k + 1; i < n; i++) {
        for (let j = 0; j < nx; j++) X[i][j] -= X[k][j] * LU[i][k];
      }
    }
    for (let k = n - 1; k >= 0; k--) {
      for (let j = 0; j < nx; j++) X[k][j] /= LU[k][k];
      for (let i = 0; i < k; i++) {
        for (let j = 0; j < nx; j++) X[i][j] -= X[k][j] * LU[i][k];
      }
    }
    return X;
  },

  QRDecomposition(A: Matrix, B: Matrix): Matrix {
    const QR: Matrix = new Array(A.length);
    for (let i = 0; i < A.length; i++) {
      QR[i] = new Array(A[0].length);
      for (let j = 0; j < A[0].length; j++) QR[i][j] = A[i][j];
    }
    const m = A.length;
    const n = A[0].length;
    const Rdiag = new Array(n);
    for (let k = 0; k < n; k++) {
      let nrm = 0;
      for (let i = k; i < m; i++) nrm = Math.hypot(nrm, QR[i][k]);
      if (nrm !== 0) {
        if (QR[k][k] < 0) nrm = -nrm;
        for (let i = k; i < m; i++) QR[i][k] /= nrm;
        QR[k][k] += 1;
        for (let j = k + 1; j < n; j++) {
          let s = 0;
          for (let i = k; i < m; i++) s += QR[i][k] * QR[i][j];
          s = -s / QR[k][k];
          for (let i = k; i < m; i++) QR[i][j] += s * QR[i][k];
        }
      }
      Rdiag[k] = -nrm;
    }
    if (B.length !== m) console.warn('Matrix row dimensions must agree.');
    for (let j = 0; j < n; j++) if (Rdiag[j] === 0) console.warn('Matrix is rank deficient');
    const nx = B[0].length;
    const X: Matrix = new Array(B.length);
    for (let i = 0; i < B.length; i++) {
      X[i] = new Array(B[0].length);
      for (let j = 0; j < B[0].length; j++) X[i][j] = B[i][j];
    }
    for (let k = 0; k < n; k++) {
      for (let j = 0; j < nx; j++) {
        let s = 0;
        for (let i = k; i < m; i++) s += QR[i][k] * X[i][j];
        s = -s / QR[k][k];
        for (let i = k; i < m; i++) X[i][j] += s * QR[i][k];
      }
    }
    for (let k = n - 1; k >= 0; k--) {
      for (let j = 0; j < nx; j++) X[k][j] /= Rdiag[k];
      for (let i = 0; i < k; i++) {
        for (let j = 0; j < nx; j++) X[i][j] -= X[k][j] * QR[i][k];
      }
    }
    return mat.getSubMatrix(X, 0, n - 1, 0, nx - 1);
  }
};

export default mat;

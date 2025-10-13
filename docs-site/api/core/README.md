**@webgazer-ts/core**

***

# @webgazer-ts/core

Webgazer - Eye Tracking Library
Main Entry Point

This is the public API entry point that:
1. Registers default tracker and regressor modules
2. Sets up default configuration
3. Exports the singleton Webgazer instance
4. Exports public types for TypeScript users

## Enumerations

### CalibrationState

Defined in: [calibration/types.ts:11](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/core/src/calibration/types.ts#L11)

Calibration state

#### Enumeration Members

##### NotStarted

> **NotStarted**: `"not_started"`

Defined in: [calibration/types.ts:12](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/core/src/calibration/types.ts#L12)

##### InProgress

> **InProgress**: `"in_progress"`

Defined in: [calibration/types.ts:13](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/core/src/calibration/types.ts#L13)

##### Completed

> **Completed**: `"completed"`

Defined in: [calibration/types.ts:14](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/core/src/calibration/types.ts#L14)

##### Failed

> **Failed**: `"failed"`

Defined in: [calibration/types.ts:15](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/core/src/calibration/types.ts#L15)

***

### CalibrationEventType

Defined in: [calibration/types.ts:99](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/core/src/calibration/types.ts#L99)

Calibration event types

#### Enumeration Members

##### Started

> **Started**: `"calibration_started"`

Defined in: [calibration/types.ts:100](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/core/src/calibration/types.ts#L100)

##### PointStarted

> **PointStarted**: `"calibration_point_started"`

Defined in: [calibration/types.ts:101](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/core/src/calibration/types.ts#L101)

##### PointCompleted

> **PointCompleted**: `"calibration_point_completed"`

Defined in: [calibration/types.ts:102](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/core/src/calibration/types.ts#L102)

##### Completed

> **Completed**: `"calibration_completed"`

Defined in: [calibration/types.ts:103](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/core/src/calibration/types.ts#L103)

##### Failed

> **Failed**: `"calibration_failed"`

Defined in: [calibration/types.ts:104](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/core/src/calibration/types.ts#L104)

##### Cancelled

> **Cancelled**: `"calibration_cancelled"`

Defined in: [calibration/types.ts:105](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/core/src/calibration/types.ts#L105)

***

### WebgazerState

Defined in: core/Webgazer.ts:38

Webgazer state enum

#### Enumeration Members

##### NotInitialized

> **NotInitialized**: `"not_initialized"`

Defined in: core/Webgazer.ts:39

##### Initializing

> **Initializing**: `"initializing"`

Defined in: core/Webgazer.ts:40

##### Ready

> **Ready**: `"ready"`

Defined in: core/Webgazer.ts:41

##### Running

> **Running**: `"running"`

Defined in: core/Webgazer.ts:42

##### Paused

> **Paused**: `"paused"`

Defined in: core/Webgazer.ts:43

##### Stopped

> **Stopped**: `"stopped"`

Defined in: core/Webgazer.ts:44

##### Error

> **Error**: `"error"`

Defined in: core/Webgazer.ts:45

***

### EventType

Defined in: [events/types.ts:11](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/core/src/events/types.ts#L11)

Event type enumeration

#### Enumeration Members

##### Click

> **Click**: `"click"`

Defined in: [events/types.ts:12](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/core/src/events/types.ts#L12)

##### Move

> **Move**: `"mousemove"`

Defined in: [events/types.ts:13](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/core/src/events/types.ts#L13)

##### GazePrediction

> **GazePrediction**: `"gaze_prediction"`

Defined in: [events/types.ts:14](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/core/src/events/types.ts#L14)

##### TrackerReady

> **TrackerReady**: `"tracker_ready"`

Defined in: [events/types.ts:15](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/core/src/events/types.ts#L15)

##### RegressorReady

> **RegressorReady**: `"regressor_ready"`

Defined in: [events/types.ts:16](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/core/src/events/types.ts#L16)

##### CalibrationStart

> **CalibrationStart**: `"calibration_start"`

Defined in: [events/types.ts:17](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/core/src/events/types.ts#L17)

##### CalibrationComplete

> **CalibrationComplete**: `"calibration_complete"`

Defined in: [events/types.ts:18](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/core/src/events/types.ts#L18)

##### Error

> **Error**: `"error"`

Defined in: [events/types.ts:19](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/core/src/events/types.ts#L19)

## Classes

### KalmanFilter

Defined in: [utils/filters/KalmanFilter.ts:29](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/core/src/utils/filters/KalmanFilter.ts#L29)

KalmanFilter - Implements 1D Kalman filter for each coordinate
Provides optimal estimation of gaze point by combining predictions and measurements

#### Implements

- `IKalmanFilter`

#### Constructors

##### Constructor

> **new KalmanFilter**(`config`): [`KalmanFilter`](#kalmanfilter)

Defined in: [utils/filters/KalmanFilter.ts:37](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/core/src/utils/filters/KalmanFilter.ts#L37)

Create a new Kalman Filter for 2D point tracking

###### Parameters

###### config

[`KalmanFilterConfig`](#kalmanfilterconfig) = `{}`

Configuration options

###### Returns

[`KalmanFilter`](#kalmanfilter)

#### Methods

##### update()

> **update**(`measurement`): \[`number`, `number`\]

Defined in: [utils/filters/KalmanFilter.ts:62](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/core/src/utils/filters/KalmanFilter.ts#L62)

Update filter with new measurement

###### Parameters

###### measurement

\[`number`, `number`\]

Measured 2D point [x, y]

###### Returns

\[`number`, `number`\]

Filtered estimate [x, y]

###### Implementation of

`IKalmanFilter.update`

##### reset()

> **reset**(`config?`): `void`

Defined in: [utils/filters/KalmanFilter.ts:73](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/core/src/utils/filters/KalmanFilter.ts#L73)

Reset filter state to initial conditions

###### Parameters

###### config?

[`KalmanFilterConfig`](#kalmanfilterconfig)

Optional new configuration

###### Returns

`void`

###### Implementation of

`IKalmanFilter.reset`

##### getState()

> **getState**(): `object`

Defined in: [utils/filters/KalmanFilter.ts:97](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/core/src/utils/filters/KalmanFilter.ts#L97)

Get current filter state

###### Returns

`object`

Current state of both x and y filters

###### x

> **x**: `object`

###### x.estimate

> **estimate**: `number`

###### x.errorCovariance

> **errorCovariance**: `number`

###### y

> **y**: `object`

###### y.estimate

> **estimate**: `number`

###### y.errorCovariance

> **errorCovariance**: `number`

##### isInitialized()

> **isInitialized**(): `boolean`

Defined in: [utils/filters/KalmanFilter.ts:116](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/core/src/utils/filters/KalmanFilter.ts#L116)

Check if filter is initialized

###### Returns

`boolean`

###### Implementation of

`IKalmanFilter.isInitialized`

***

### KalmanFilter4D

Defined in: [utils/filters/KalmanFilter4D.ts:65](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/core/src/utils/filters/KalmanFilter4D.ts#L65)

KalmanFilter4D - Full 4-dimensional Kalman filter

Tracks 2D position (x, y) and velocity (vx, vy) using a constant velocity model.
This provides superior smoothing compared to independent 1D filters.

State Model:
```
x(k) = F * x(k-1) + w(k)
z(k) = H * x(k) + v(k)

where:
- x(k) = [x, y, vx, vy]ᵀ  (state vector)
- z(k) = [x, y]ᵀ          (measurement vector)
- w(k) ~ N(0, Q)          (process noise)
- v(k) ~ N(0, R)          (measurement noise)
```

#### Example

```typescript
const filter = new KalmanFilter4D({
  processNoise: 1.0,
  measurementNoise: 25.0,
  deltaTime: 1.0
});

// Update with measurements
const smoothed = filter.update([100, 200]);
console.log(`Position: (${smoothed[0]}, ${smoothed[1]})`);

// Get velocity estimate
const state = filter.getState();
console.log(`Velocity: (${state.state[2]}, ${state.state[3]})`);
```

#### Implements

- `IKalmanFilter`

#### Constructors

##### Constructor

> **new KalmanFilter4D**(`config`): [`KalmanFilter4D`](#kalmanfilter4d)

Defined in: [utils/filters/KalmanFilter4D.ts:96](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/core/src/utils/filters/KalmanFilter4D.ts#L96)

Create a new 4D Kalman Filter

###### Parameters

###### config

[`KalmanFilter4DConfig`](#kalmanfilter4dconfig) = `{}`

Configuration options

###### Returns

[`KalmanFilter4D`](#kalmanfilter4d)

#### Methods

##### update()

> **update**(`measurement`): \[`number`, `number`\]

Defined in: [utils/filters/KalmanFilter4D.ts:181](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/core/src/utils/filters/KalmanFilter4D.ts#L181)

Update filter with new measurement

Implements the standard Kalman filter algorithm:
1. Prediction step (predict next state and error covariance)
2. Update step (correct prediction with measurement)

###### Parameters

###### measurement

\[`number`, `number`\]

Measured 2D point [x, y]

###### Returns

\[`number`, `number`\]

Filtered estimate [x, y]

###### Implementation of

`IKalmanFilter.update`

##### getState()

> **getState**(): [`KalmanFilter4DState`](#kalmanfilter4dstate)

Defined in: [utils/filters/KalmanFilter4D.ts:246](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/core/src/utils/filters/KalmanFilter4D.ts#L246)

Get current filter state

###### Returns

[`KalmanFilter4DState`](#kalmanfilter4dstate)

Current state including position and velocity

##### getPosition()

> **getPosition**(): \[`number`, `number`\]

Defined in: [utils/filters/KalmanFilter4D.ts:260](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/core/src/utils/filters/KalmanFilter4D.ts#L260)

Get current position estimate

###### Returns

\[`number`, `number`\]

Current position [x, y]

##### getVelocity()

> **getVelocity**(): \[`number`, `number`\]

Defined in: [utils/filters/KalmanFilter4D.ts:269](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/core/src/utils/filters/KalmanFilter4D.ts#L269)

Get current velocity estimate

###### Returns

\[`number`, `number`\]

Current velocity [vx, vy] in pixels per time unit

##### predict()

> **predict**(`steps`): \[`number`, `number`\]

Defined in: [utils/filters/KalmanFilter4D.ts:279](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/core/src/utils/filters/KalmanFilter4D.ts#L279)

Predict future position without updating filter state

###### Parameters

###### steps

`number` = `1`

Number of time steps into the future

###### Returns

\[`number`, `number`\]

Predicted position [x, y]

##### reset()

> **reset**(`config?`): `void`

Defined in: [utils/filters/KalmanFilter4D.ts:296](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/core/src/utils/filters/KalmanFilter4D.ts#L296)

Reset filter to initial state

###### Parameters

###### config?

[`KalmanFilter4DConfig`](#kalmanfilter4dconfig)

Optional new configuration

###### Returns

`void`

###### Implementation of

`IKalmanFilter.reset`

##### isInitialized()

> **isInitialized**(): `boolean`

Defined in: [utils/filters/KalmanFilter4D.ts:316](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/core/src/utils/filters/KalmanFilter4D.ts#L316)

Check if filter is initialized

###### Returns

`boolean`

###### Implementation of

`IKalmanFilter.isInitialized`

***

### Matrix

Defined in: [utils/math/Matrix.ts:12](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/core/src/utils/math/Matrix.ts#L12)

Matrix class for linear algebra operations
Provides methods for matrix manipulation, arithmetic, and decomposition

#### Constructors

##### Constructor

> **new Matrix**(): [`Matrix`](#matrix)

###### Returns

[`Matrix`](#matrix)

#### Methods

##### transpose()

> `static` **transpose**(`matrix`): `MatrixData`

Defined in: [utils/math/Matrix.ts:18](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/core/src/utils/math/Matrix.ts#L18)

Transpose a matrix (swap rows and columns)

###### Parameters

###### matrix

`MatrixData`

Input matrix

###### Returns

`MatrixData`

Transposed matrix

##### getMatrixByRows()

> `static` **getMatrixByRows**(`matrix`, `rowIndices`, `columnStart`, `columnEnd`): `MatrixData`

Defined in: [utils/math/Matrix.ts:41](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/core/src/utils/math/Matrix.ts#L41)

Extract rows from matrix by indices

###### Parameters

###### matrix

`MatrixData`

Source matrix

###### rowIndices

`number`[]

Array of row indices to extract

###### columnStart

`number`

Starting column index

###### columnEnd

`number`

Ending column index (inclusive)

###### Returns

`MatrixData`

New matrix with selected rows

##### getSubMatrix()

> `static` **getSubMatrix**(`matrix`, `rowStart`, `rowEnd`, `columnStart`, `columnEnd`): `MatrixData`

Defined in: [utils/math/Matrix.ts:69](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/core/src/utils/math/Matrix.ts#L69)

Extract submatrix by row and column ranges

###### Parameters

###### matrix

`MatrixData`

Source matrix

###### rowStart

`number`

Starting row index

###### rowEnd

`number`

Ending row index (inclusive)

###### columnStart

`number`

Starting column index

###### columnEnd

`number`

Ending column index (inclusive)

###### Returns

`MatrixData`

Extracted submatrix

##### multiply()

> `static` **multiply**(`matrixA`, `matrixB`): `MatrixData`

Defined in: [utils/math/Matrix.ts:97](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/core/src/utils/math/Matrix.ts#L97)

Multiply two matrices

###### Parameters

###### matrixA

`MatrixData`

First matrix (m × n)

###### matrixB

`MatrixData`

Second matrix (n × p)

###### Returns

`MatrixData`

Product matrix (m × p)

###### Throws

Error if inner dimensions don't match

##### multiplyScalar()

> `static` **multiplyScalar**(`matrix`, `scalar`): `MatrixData`

Defined in: [utils/math/Matrix.ts:142](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/core/src/utils/math/Matrix.ts#L142)

Multiply matrix by scalar

###### Parameters

###### matrix

`MatrixData`

Input matrix

###### scalar

`number`

Scalar value

###### Returns

`MatrixData`

Scaled matrix

##### add()

> `static` **add**(`matrixA`, `matrixB`): `MatrixData`

Defined in: [utils/math/Matrix.ts:164](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/core/src/utils/math/Matrix.ts#L164)

Add two matrices element-wise

###### Parameters

###### matrixA

`MatrixData`

First matrix

###### matrixB

`MatrixData`

Second matrix

###### Returns

`MatrixData`

Sum matrix

###### Throws

Error if dimensions don't match

##### subtract()

> `static` **subtract**(`matrixA`, `matrixB`): `MatrixData`

Defined in: [utils/math/Matrix.ts:175](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/core/src/utils/math/Matrix.ts#L175)

Subtract two matrices element-wise

###### Parameters

###### matrixA

`MatrixData`

First matrix

###### matrixB

`MatrixData`

Second matrix (subtracted from first)

###### Returns

`MatrixData`

Difference matrix

###### Throws

Error if dimensions don't match

##### inverse()

> `static` **inverse**(`matrix`): `MatrixData`

Defined in: [utils/math/Matrix.ts:185](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/core/src/utils/math/Matrix.ts#L185)

Compute matrix inverse using LU decomposition

###### Parameters

###### matrix

`MatrixData`

Square matrix to invert

###### Returns

`MatrixData`

Inverse matrix

###### Throws

Error if matrix is singular or non-square

##### identity()

> `static` **identity**(`rowCount`, `columnCount`): `MatrixData`

Defined in: [utils/math/Matrix.ts:195](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/core/src/utils/math/Matrix.ts#L195)

Create identity matrix

###### Parameters

###### rowCount

`number`

Number of rows

###### columnCount

`number` = `rowCount`

Number of columns (defaults to rowCount for square matrix)

###### Returns

`MatrixData`

Identity matrix

##### solve()

> `static` **solve**(`matrixA`, `matrixB`): `MatrixData`

Defined in: [utils/math/Matrix.ts:214](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/core/src/utils/math/Matrix.ts#L214)

Solve linear system Ax = B

###### Parameters

###### matrixA

`MatrixData`

Coefficient matrix

###### matrixB

`MatrixData`

Right-hand side matrix

###### Returns

`MatrixData`

Solution matrix x

##### solveLU()

> `static` **solveLU**(`matrixA`, `matrixB`): `MatrixData`

Defined in: [utils/math/Matrix.ts:228](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/core/src/utils/math/Matrix.ts#L228)

Solve linear system using LU decomposition with partial pivoting

###### Parameters

###### matrixA

`MatrixData`

Square coefficient matrix

###### matrixB

`MatrixData`

Right-hand side matrix

###### Returns

`MatrixData`

Solution matrix

##### solveQR()

> `static` **solveQR**(`matrixA`, `matrixB`): `MatrixData`

Defined in: [utils/math/Matrix.ts:340](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/core/src/utils/math/Matrix.ts#L340)

Solve linear system using QR decomposition

###### Parameters

###### matrixA

`MatrixData`

Coefficient matrix (can be rectangular)

###### matrixB

`MatrixData`

Right-hand side matrix

###### Returns

`MatrixData`

Least-squares solution matrix

## Interfaces

### CalibrationConfiguration

Defined in: [calibration/types.ts:31](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/core/src/calibration/types.ts#L31)

Calibration configuration

#### Properties

##### pointCount

> **pointCount**: `number`

Defined in: [calibration/types.ts:32](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/core/src/calibration/types.ts#L32)

##### pointDuration

> **pointDuration**: `number`

Defined in: [calibration/types.ts:33](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/core/src/calibration/types.ts#L33)

##### pointSize

> **pointSize**: `number`

Defined in: [calibration/types.ts:34](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/core/src/calibration/types.ts#L34)

##### pointColor

> **pointColor**: `string`

Defined in: [calibration/types.ts:35](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/core/src/calibration/types.ts#L35)

##### requireClick

> **requireClick**: `boolean`

Defined in: [calibration/types.ts:36](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/core/src/calibration/types.ts#L36)

##### showProgress

> **showProgress**: `boolean`

Defined in: [calibration/types.ts:37](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/core/src/calibration/types.ts#L37)

##### autoAdvance

> **autoAdvance**: `boolean`

Defined in: [calibration/types.ts:38](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/core/src/calibration/types.ts#L38)

***

### CalibrationPointData

Defined in: [calibration/types.ts:44](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/core/src/calibration/types.ts#L44)

Calibration point data

#### Properties

##### screenPosition

> **screenPosition**: [`Point2D`](#point2d)

Defined in: [calibration/types.ts:45](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/core/src/calibration/types.ts#L45)

##### eyeFeatures

> **eyeFeatures**: [`EyeFeatures`](#eyefeatures-2)

Defined in: [calibration/types.ts:46](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/core/src/calibration/types.ts#L46)

##### timestamp

> **timestamp**: `number`

Defined in: [calibration/types.ts:47](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/core/src/calibration/types.ts#L47)

***

### CalibrationResult

Defined in: [calibration/types.ts:53](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/core/src/calibration/types.ts#L53)

Calibration result

#### Properties

##### success

> **success**: `boolean`

Defined in: [calibration/types.ts:54](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/core/src/calibration/types.ts#L54)

##### pointsCollected

> **pointsCollected**: `number`

Defined in: [calibration/types.ts:55](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/core/src/calibration/types.ts#L55)

##### averageAccuracy?

> `optional` **averageAccuracy**: `number`

Defined in: [calibration/types.ts:56](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/core/src/calibration/types.ts#L56)

##### message

> **message**: `string`

Defined in: [calibration/types.ts:57](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/core/src/calibration/types.ts#L57)

***

### CalibrationProgress

Defined in: [calibration/types.ts:63](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/core/src/calibration/types.ts#L63)

Calibration progress

#### Properties

##### currentPoint

> **currentPoint**: `number`

Defined in: [calibration/types.ts:64](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/core/src/calibration/types.ts#L64)

##### totalPoints

> **totalPoints**: `number`

Defined in: [calibration/types.ts:65](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/core/src/calibration/types.ts#L65)

##### percentage

> **percentage**: `number`

Defined in: [calibration/types.ts:66](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/core/src/calibration/types.ts#L66)

##### state

> **state**: [`CalibrationState`](#calibrationstate)

Defined in: [calibration/types.ts:67](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/core/src/calibration/types.ts#L67)

***

### ValidationBoxConfiguration

Defined in: [calibration/types.ts:73](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/core/src/calibration/types.ts#L73)

Validation box configuration

#### Properties

##### containerId

> **containerId**: `string`

Defined in: [calibration/types.ts:74](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/core/src/calibration/types.ts#L74)

##### boxId

> **boxId**: `string`

Defined in: [calibration/types.ts:75](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/core/src/calibration/types.ts#L75)

##### ratio

> **ratio**: `number`

Defined in: [calibration/types.ts:76](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/core/src/calibration/types.ts#L76)

##### colors

> **colors**: `object`

Defined in: [calibration/types.ts:77](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/core/src/calibration/types.ts#L77)

###### valid

> **valid**: `string`

###### invalid

> **invalid**: `string`

###### warning

> **warning**: `string`

##### showInstructions

> **showInstructions**: `boolean`

Defined in: [calibration/types.ts:82](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/core/src/calibration/types.ts#L82)

##### instructionText

> **instructionText**: `string`

Defined in: [calibration/types.ts:83](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/core/src/calibration/types.ts#L83)

***

### FaceValidationStatus

Defined in: [calibration/types.ts:89](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/core/src/calibration/types.ts#L89)

Face validation status

#### Properties

##### isValid

> **isValid**: `boolean`

Defined in: [calibration/types.ts:90](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/core/src/calibration/types.ts#L90)

##### isCentered

> **isCentered**: `boolean`

Defined in: [calibration/types.ts:91](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/core/src/calibration/types.ts#L91)

##### isCorrectDistance

> **isCorrectDistance**: `boolean`

Defined in: [calibration/types.ts:92](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/core/src/calibration/types.ts#L92)

##### message

> **message**: `string`

Defined in: [calibration/types.ts:93](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/core/src/calibration/types.ts#L93)

***

### CalibrationEventData

Defined in: [calibration/types.ts:111](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/core/src/calibration/types.ts#L111)

Calibration event data

#### Properties

##### type

> **type**: [`CalibrationEventType`](#calibrationeventtype)

Defined in: [calibration/types.ts:112](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/core/src/calibration/types.ts#L112)

##### progress?

> `optional` **progress**: [`CalibrationProgress`](#calibrationprogress)

Defined in: [calibration/types.ts:113](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/core/src/calibration/types.ts#L113)

##### result?

> `optional` **result**: [`CalibrationResult`](#calibrationresult)

Defined in: [calibration/types.ts:114](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/core/src/calibration/types.ts#L114)

##### error?

> `optional` **error**: `string`

Defined in: [calibration/types.ts:115](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/core/src/calibration/types.ts#L115)

***

### Webgazer

Defined in: core/Webgazer.ts:66

Main Webgazer class - Singleton pattern

#### Accessors

##### params

###### Get Signature

> **get** **params**(): [`WebgazerConfig`](#webgazerconfig)

Defined in: core/Webgazer.ts:1224

Get configuration object (for backward compatibility)

###### Returns

[`WebgazerConfig`](#webgazerconfig)

#### Methods

##### begin()

> **begin**(`onFail?`): `Promise`\<[`Webgazer`](#webgazer)\>

Defined in: core/Webgazer.ts:161

Begin eye tracking

###### Parameters

###### onFail?

() => `void`

Optional callback if initialization fails

###### Returns

`Promise`\<[`Webgazer`](#webgazer)\>

Promise that resolves to Webgazer instance for chaining

##### pause()

> **pause**(): [`Webgazer`](#webgazer)

Defined in: core/Webgazer.ts:225

Pause eye tracking (keeps camera running)

###### Returns

[`Webgazer`](#webgazer)

##### resume()

> **resume**(): `Promise`\<[`Webgazer`](#webgazer)\>

Defined in: core/Webgazer.ts:238

Resume eye tracking

###### Returns

`Promise`\<[`Webgazer`](#webgazer)\>

##### end()

> **end**(): [`Webgazer`](#webgazer)

Defined in: core/Webgazer.ts:256

End eye tracking and clean up resources

###### Returns

[`Webgazer`](#webgazer)

##### isReady()

> **isReady**(): `boolean`

Defined in: core/Webgazer.ts:310

Check if Webgazer is ready

###### Returns

`boolean`

##### setTracker()

> **setTracker**(`name`): [`Webgazer`](#webgazer)

Defined in: core/Webgazer.ts:770

Set the tracker to use

###### Parameters

###### name

`string`

###### Returns

[`Webgazer`](#webgazer)

##### getTracker()

> **getTracker**(): [`ITracker`](#itracker) \| `null`

Defined in: core/Webgazer.ts:788

Get current tracker

###### Returns

[`ITracker`](#itracker) \| `null`

##### setRegression()

> **setRegression**(`name`): [`Webgazer`](#webgazer)

Defined in: core/Webgazer.ts:799

Set the regression algorithm (replaces all existing regressors)

###### Parameters

###### name

`string`

###### Returns

[`Webgazer`](#webgazer)

##### addRegression()

> **addRegression**(`name`): [`Webgazer`](#webgazer)

Defined in: core/Webgazer.ts:821

Add a regression algorithm (keeps existing regressors)

###### Parameters

###### name

`string`

###### Returns

[`Webgazer`](#webgazer)

##### getRegression()

> **getRegression**(): [`IRegressor`](#iregressor)[]

Defined in: core/Webgazer.ts:839

Get all regressors

###### Returns

[`IRegressor`](#iregressor)[]

##### getCurrentPrediction()

> **getCurrentPrediction**(`regressorIndex`): `Promise`\<[`GazePrediction`](#gazeprediction-1) \| `null`\>

Defined in: core/Webgazer.ts:850

Get current gaze prediction

###### Parameters

###### regressorIndex

`number` = `0`

###### Returns

`Promise`\<[`GazePrediction`](#gazeprediction-1) \| `null`\>

##### setGazeListener()

> **setGazeListener**(`callback`): [`Webgazer`](#webgazer)

Defined in: core/Webgazer.ts:873

Set gaze prediction callback

###### Parameters

###### callback

[`GazeCallback`](#gazecallback)

###### Returns

[`Webgazer`](#webgazer)

##### clearGazeListener()

> **clearGazeListener**(): [`Webgazer`](#webgazer)

Defined in: core/Webgazer.ts:881

Clear gaze prediction callback

###### Returns

[`Webgazer`](#webgazer)

##### recordScreenPosition()

> **recordScreenPosition**(`x`, `y`, `eventType`): [`Webgazer`](#webgazer)

Defined in: core/Webgazer.ts:893

Record screen position for training

###### Parameters

###### x

`number`

###### y

`number`

###### eventType

`"click"` | `"move"`

###### Returns

[`Webgazer`](#webgazer)

##### storePoints()

> **storePoints**(`x`, `y`, `eventType`): `void`

Defined in: core/Webgazer.ts:920

Store calibration point (for backward compatibility)

###### Parameters

###### x

`number`

###### y

`number`

###### eventType

`"click"` | `"move"`

###### Returns

`void`

##### addMouseEventListeners()

> **addMouseEventListeners**(): [`Webgazer`](#webgazer)

Defined in: core/Webgazer.ts:927

Add mouse event listeners for automatic data collection

###### Returns

[`Webgazer`](#webgazer)

##### removeMouseEventListeners()

> **removeMouseEventListeners**(): [`Webgazer`](#webgazer)

Defined in: core/Webgazer.ts:949

Remove mouse event listeners

###### Returns

[`Webgazer`](#webgazer)

##### showVideoPreview()

> **showVideoPreview**(`show`): [`Webgazer`](#webgazer)

Defined in: core/Webgazer.ts:963

Show/hide video preview (alias for showVideo)

###### Parameters

###### show

`boolean`

###### Returns

[`Webgazer`](#webgazer)

##### showVideo()

> **showVideo**(`show`): [`Webgazer`](#webgazer)

Defined in: core/Webgazer.ts:970

Show/hide video element

###### Parameters

###### show

`boolean`

###### Returns

[`Webgazer`](#webgazer)

##### showFaceOverlay()

> **showFaceOverlay**(`show`): [`Webgazer`](#webgazer)

Defined in: core/Webgazer.ts:983

Show/hide face overlay

###### Parameters

###### show

`boolean`

###### Returns

[`Webgazer`](#webgazer)

##### showFaceFeedbackBox()

> **showFaceFeedbackBox**(`show`): [`Webgazer`](#webgazer)

Defined in: core/Webgazer.ts:996

Show/hide face feedback box

###### Parameters

###### show

`boolean`

###### Returns

[`Webgazer`](#webgazer)

##### showPredictionPoints()

> **showPredictionPoints**(`show`): [`Webgazer`](#webgazer)

Defined in: core/Webgazer.ts:1009

Show/hide prediction points

###### Parameters

###### show

`boolean`

###### Returns

[`Webgazer`](#webgazer)

##### setVideoViewerSize()

> **setVideoViewerSize**(`width`, `height`): `void`

Defined in: core/Webgazer.ts:1022

Set video viewer size

###### Parameters

###### width

`number`

###### height

`number`

###### Returns

`void`

##### stopVideo()

> **stopVideo**(): [`Webgazer`](#webgazer)

Defined in: core/Webgazer.ts:1034

Stop video stream

###### Returns

[`Webgazer`](#webgazer)

##### setStaticVideo()

> **setStaticVideo**(`videoLocation`): [`Webgazer`](#webgazer)

Defined in: core/Webgazer.ts:1054

Set static video source

###### Parameters

###### videoLocation

`string`

###### Returns

[`Webgazer`](#webgazer)

##### setCameraConstraints()

> **setCameraConstraints**(`constraints`): `Promise`\<`void`\>

Defined in: core/Webgazer.ts:1064

Set camera constraints

###### Parameters

###### constraints

`MediaStreamConstraints`

###### Returns

`Promise`\<`void`\>

##### getVideoElementCanvas()

> **getVideoElementCanvas**(): `HTMLCanvasElement` \| `null`

Defined in: core/Webgazer.ts:1081

Get video element canvas

###### Returns

`HTMLCanvasElement` \| `null`

##### setVideoElementCanvas()

> **setVideoElementCanvas**(`canvas`): `HTMLCanvasElement`

Defined in: core/Webgazer.ts:1088

Set video element canvas

###### Parameters

###### canvas

`HTMLCanvasElement`

###### Returns

`HTMLCanvasElement`

##### getVideoPreviewToCameraResolutionRatio()

> **getVideoPreviewToCameraResolutionRatio**(): \[`number`, `number`\]

Defined in: core/Webgazer.ts:1096

Get video preview to camera resolution ratio

###### Returns

\[`number`, `number`\]

##### saveDataAcrossSessions()

> **saveDataAcrossSessions**(`save`): `Promise`\<[`Webgazer`](#webgazer)\>

Defined in: core/Webgazer.ts:1111

Enable/disable data persistence across sessions

###### Parameters

###### save

`boolean`

###### Returns

`Promise`\<[`Webgazer`](#webgazer)\>

##### clearData()

> **clearData**(): `Promise`\<`void`\>

Defined in: core/Webgazer.ts:1150

Clear all stored data

###### Returns

`Promise`\<`void`\>

##### getStoredPoints()

> **getStoredPoints**(): \[`number`[], `number`[]\]

Defined in: core/Webgazer.ts:1166

Get stored calibration points

###### Returns

\[`number`[], `number`[]\]

##### getCalibrationDataCount()

> **getCalibrationDataCount**(): `number`

Defined in: core/Webgazer.ts:1189

Get calibration data count

###### Returns

`number`

Number of calibration points recorded

##### applyKalmanFilter()

> **applyKalmanFilter**(`apply`): [`Webgazer`](#webgazer)

Defined in: core/Webgazer.ts:1205

Enable/disable Kalman filter

###### Parameters

###### apply

`boolean`

###### Returns

[`Webgazer`](#webgazer)

##### computeValidationBoxSize()

> **computeValidationBoxSize**(): \[`number`, `number`, `number`, `number`\]

Defined in: core/Webgazer.ts:1235

Compute validation box size

###### Returns

\[`number`, `number`, `number`, `number`\]

##### detectCompatibility()

> **detectCompatibility**(): `boolean`

Defined in: core/Webgazer.ts:1253

Detect browser compatibility

###### Returns

`boolean`

##### getCompatibilityWarnings()

> **getCompatibilityWarnings**(): `string`[]

Defined in: core/Webgazer.ts:1260

Get compatibility warnings

###### Returns

`string`[]

##### logCompatibilityInfo()

> **logCompatibilityInfo**(): `void`

Defined in: core/Webgazer.ts:1267

Log browser and feature information

###### Returns

`void`

##### getState()

> **getState**(): [`WebgazerState`](#webgazerstate)

Defined in: core/Webgazer.ts:1274

Get current state

###### Returns

[`WebgazerState`](#webgazerstate)

##### getEventManager()

> **getEventManager**(): `EventManager`

Defined in: core/Webgazer.ts:1281

Get event manager (for advanced usage)

###### Returns

`EventManager`

##### getCalibrationManager()

> **getCalibrationManager**(): `CalibrationManager` \| `null`

Defined in: core/Webgazer.ts:1288

Get calibration manager (for advanced usage)

###### Returns

`CalibrationManager` \| `null`

***

### WebgazerConfig

Defined in: core/WebgazerConfig.ts:91

Webgazer configuration management class
Handles all configuration parameters with validation and persistence

#### Implements

- `WebgazerConfigData`

#### Properties

##### moveTickSize

> **moveTickSize**: `number`

Defined in: core/WebgazerConfig.ts:93

###### Implementation of

`WebgazerConfigData.moveTickSize`

##### dataTimestep

> **dataTimestep**: `number`

Defined in: core/WebgazerConfig.ts:94

###### Implementation of

`WebgazerConfigData.dataTimestep`

##### videoContainerId

> **videoContainerId**: `string`

Defined in: core/WebgazerConfig.ts:97

###### Implementation of

`WebgazerConfigData.videoContainerId`

##### videoElementId

> **videoElementId**: `string`

Defined in: core/WebgazerConfig.ts:98

###### Implementation of

`WebgazerConfigData.videoElementId`

##### videoElementCanvasId

> **videoElementCanvasId**: `string`

Defined in: core/WebgazerConfig.ts:99

###### Implementation of

`WebgazerConfigData.videoElementCanvasId`

##### faceOverlayId

> **faceOverlayId**: `string`

Defined in: core/WebgazerConfig.ts:100

###### Implementation of

`WebgazerConfigData.faceOverlayId`

##### faceFeedbackBoxId

> **faceFeedbackBoxId**: `string`

Defined in: core/WebgazerConfig.ts:101

###### Implementation of

`WebgazerConfigData.faceFeedbackBoxId`

##### gazeDotId

> **gazeDotId**: `string`

Defined in: core/WebgazerConfig.ts:102

###### Implementation of

`WebgazerConfigData.gazeDotId`

##### videoViewerWidth

> **videoViewerWidth**: `number`

Defined in: core/WebgazerConfig.ts:105

###### Implementation of

`WebgazerConfigData.videoViewerWidth`

##### videoViewerHeight

> **videoViewerHeight**: `number`

Defined in: core/WebgazerConfig.ts:106

###### Implementation of

`WebgazerConfigData.videoViewerHeight`

##### faceFeedbackBoxRatio

> **faceFeedbackBoxRatio**: `number`

Defined in: core/WebgazerConfig.ts:109

###### Implementation of

`WebgazerConfigData.faceFeedbackBoxRatio`

##### showVideo

> **showVideo**: `boolean`

Defined in: core/WebgazerConfig.ts:112

###### Implementation of

`WebgazerConfigData.showVideo`

##### mirrorVideo

> **mirrorVideo**: `boolean`

Defined in: core/WebgazerConfig.ts:113

###### Implementation of

`WebgazerConfigData.mirrorVideo`

##### showFaceOverlay

> **showFaceOverlay**: `boolean`

Defined in: core/WebgazerConfig.ts:114

###### Implementation of

`WebgazerConfigData.showFaceOverlay`

##### showFaceFeedbackBox

> **showFaceFeedbackBox**: `boolean`

Defined in: core/WebgazerConfig.ts:115

###### Implementation of

`WebgazerConfigData.showFaceFeedbackBox`

##### showGazeDot

> **showGazeDot**: `boolean`

Defined in: core/WebgazerConfig.ts:116

###### Implementation of

`WebgazerConfigData.showGazeDot`

##### showVideoPreview

> **showVideoPreview**: `boolean`

Defined in: core/WebgazerConfig.ts:117

###### Implementation of

`WebgazerConfigData.showVideoPreview`

##### cameraConstraints

> **cameraConstraints**: `CameraConstraints`

Defined in: core/WebgazerConfig.ts:120

###### Implementation of

`WebgazerConfigData.cameraConstraints`

##### applyKalmanFilter

> **applyKalmanFilter**: `boolean`

Defined in: core/WebgazerConfig.ts:123

###### Implementation of

`WebgazerConfigData.applyKalmanFilter`

##### trackEye

> **trackEye**: `TrackEyeMode`

Defined in: core/WebgazerConfig.ts:124

###### Implementation of

`WebgazerConfigData.trackEye`

##### saveDataAcrossSessions

> **saveDataAcrossSessions**: `boolean`

Defined in: core/WebgazerConfig.ts:127

###### Implementation of

`WebgazerConfigData.saveDataAcrossSessions`

##### storingPoints

> **storingPoints**: `boolean`

Defined in: core/WebgazerConfig.ts:128

###### Implementation of

`WebgazerConfigData.storingPoints`

#### Methods

##### validate()

> **validate**(): `ValidationResult`

Defined in: core/WebgazerConfig.ts:209

Validate the current configuration

###### Returns

`ValidationResult`

Validation result with errors and warnings

##### reset()

> **reset**(): `void`

Defined in: core/WebgazerConfig.ts:288

Reset configuration to default values

###### Returns

`void`

##### toJSON()

> **toJSON**(): `WebgazerConfigData`

Defined in: core/WebgazerConfig.ts:319

Convert configuration to JSON-serializable object

###### Returns

`WebgazerConfigData`

Plain object representation of configuration

##### clone()

> **clone**(): [`WebgazerConfig`](#webgazerconfig)

Defined in: core/WebgazerConfig.ts:359

Create a deep copy of this configuration

###### Returns

[`WebgazerConfig`](#webgazerconfig)

New WebgazerConfig instance with same values

##### update()

> **update**(`updates`): `void`

Defined in: core/WebgazerConfig.ts:367

Update multiple configuration values at once

###### Parameters

###### updates

`Partial`\<`WebgazerConfigData`\>

Partial configuration to merge

###### Returns

`void`

##### getEventTypes()

> **getEventTypes**(): `string`[]

Defined in: core/WebgazerConfig.ts:384

Get event types for mouse tracking
Used for compatibility with original API

###### Returns

`string`[]

Array of event type strings

***

### ITracker

Defined in: [core/types.ts:11](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/core/src/core/types.ts#L11)

Abstract interface for eye/face tracking implementations

#### Properties

##### name

> `readonly` **name**: `string`

Defined in: [core/types.ts:56](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/core/src/core/types.ts#L56)

Tracker name identifier

#### Methods

##### initialize()

> **initialize**(): `Promise`\<`void`\>

Defined in: [core/types.ts:15](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/core/src/core/types.ts#L15)

Initialize the tracker with any necessary setup

###### Returns

`Promise`\<`void`\>

##### getEyePatches()

> **getEyePatches**(`video`, `canvas`, `width`, `height`): `Promise`\<[`EyeFeatures`](#eyefeatures-2) \| `null`\>

Defined in: [core/types.ts:25](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/core/src/core/types.ts#L25)

Extract eye patches from video frame

###### Parameters

###### video

`HTMLVideoElement`

Video element or canvas containing the frame

###### canvas

`HTMLCanvasElement`

Canvas for rendering/processing

###### width

`number`

Canvas width

###### height

`number`

Canvas height

###### Returns

`Promise`\<[`EyeFeatures`](#eyefeatures-2) \| `null`\>

Eye features or null if no face detected

##### drawOverlay()

> **drawOverlay**(`context`, `positions`): `void`

Defined in: [core/types.ts:37](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/core/src/core/types.ts#L37)

Draw face tracking overlay for debugging

###### Parameters

###### context

`CanvasRenderingContext2D`

Canvas 2D context

###### positions

`unknown`

Face landmark positions

###### Returns

`void`

##### getPositions()

> **getPositions**(): `number`[][] \| `null`

Defined in: [core/types.ts:46](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/core/src/core/types.ts#L46)

Get current face landmark positions

###### Returns

`number`[][] \| `null`

Current positions or null if no face detected

##### reset()

> **reset**(): `void`

Defined in: [core/types.ts:51](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/core/src/core/types.ts#L51)

Reset tracker state

###### Returns

`void`

***

### IRegressor

Defined in: [core/types.ts:62](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/core/src/core/types.ts#L62)

Abstract interface for gaze prediction regression implementations

#### Properties

##### name

> `readonly` **name**: `string`

Defined in: [core/types.ts:108](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/core/src/core/types.ts#L108)

Regressor name identifier

#### Methods

##### initialize()

> **initialize**(): `void`

Defined in: [core/types.ts:66](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/core/src/core/types.ts#L66)

Initialize the regressor

###### Returns

`void`

##### addData()

> **addData**(`eyeFeatures`, `screenPosition`, `eventType`): `void`

Defined in: [core/types.ts:74](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/core/src/core/types.ts#L74)

Add training data point

###### Parameters

###### eyeFeatures

[`EyeFeatures`](#eyefeatures-2)

Eye features from tracker

###### screenPosition

\[`number`, `number`\]

Screen coordinates where user looked

###### eventType

Type of event (click or move)

`"click"` | `"move"`

###### Returns

`void`

##### predict()

> **predict**(`eyeFeatures`): [`GazePrediction`](#gazeprediction-1) \| `null`

Defined in: [core/types.ts:85](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/core/src/core/types.ts#L85)

Predict gaze location from eye features

###### Parameters

###### eyeFeatures

[`EyeFeatures`](#eyefeatures-2)

Current eye features

###### Returns

[`GazePrediction`](#gazeprediction-1) \| `null`

Predicted gaze point or null if unable to predict

##### setData()

> **setData**(`data`): `void`

Defined in: [core/types.ts:91](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/core/src/core/types.ts#L91)

Set bulk training data

###### Parameters

###### data

`unknown`

Previously saved training data

###### Returns

`void`

##### getData()

> **getData**(): `unknown`

Defined in: [core/types.ts:97](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/core/src/core/types.ts#L97)

Get current training data

###### Returns

`unknown`

Training data for persistence

##### updateConfiguration()

> **updateConfiguration**(`config`): `void`

Defined in: [core/types.ts:103](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/core/src/core/types.ts#L103)

Update regressor configuration

###### Parameters

###### config

`Record`\<`string`, `unknown`\>

Partial configuration to update

###### Returns

`void`

***

### MouseEventData

Defined in: [events/types.ts:25](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/core/src/events/types.ts#L25)

Mouse event data

#### Properties

##### position

> **position**: [`Point2D`](#point2d)

Defined in: [events/types.ts:26](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/core/src/events/types.ts#L26)

##### timestamp

> **timestamp**: `number`

Defined in: [events/types.ts:27](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/core/src/events/types.ts#L27)

##### eventType

> **eventType**: `"click"` \| `"move"`

Defined in: [events/types.ts:28](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/core/src/events/types.ts#L28)

##### target

> **target**: `EventTarget` \| `null`

Defined in: [events/types.ts:29](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/core/src/events/types.ts#L29)

***

### GazePredictionEventData

Defined in: [events/types.ts:35](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/core/src/events/types.ts#L35)

Gaze prediction event data

#### Properties

##### prediction

> **prediction**: [`GazePrediction`](#gazeprediction-1)

Defined in: [events/types.ts:36](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/core/src/events/types.ts#L36)

##### timestamp

> **timestamp**: `number`

Defined in: [events/types.ts:37](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/core/src/events/types.ts#L37)

***

### ErrorEventData

Defined in: [events/types.ts:43](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/core/src/events/types.ts#L43)

Error event data

#### Properties

##### error

> **error**: `Error`

Defined in: [events/types.ts:44](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/core/src/events/types.ts#L44)

##### context

> **context**: `string`

Defined in: [events/types.ts:45](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/core/src/events/types.ts#L45)

##### timestamp

> **timestamp**: `number`

Defined in: [events/types.ts:46](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/core/src/events/types.ts#L46)

***

### MouseEventHandlerConfig

Defined in: [events/types.ts:66](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/core/src/events/types.ts#L66)

Mouse event handler configuration

#### Properties

##### captureClicks

> **captureClicks**: `boolean`

Defined in: [events/types.ts:67](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/core/src/events/types.ts#L67)

##### captureMoves

> **captureMoves**: `boolean`

Defined in: [events/types.ts:68](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/core/src/events/types.ts#L68)

##### moveThrottle

> **moveThrottle**: `number`

Defined in: [events/types.ts:69](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/core/src/events/types.ts#L69)

##### ignoredSelectors

> **ignoredSelectors**: `string`[]

Defined in: [events/types.ts:70](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/core/src/events/types.ts#L70)

***

### EventManagerConfig

Defined in: [events/types.ts:76](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/core/src/events/types.ts#L76)

Event manager configuration

#### Properties

##### enableEventCapture

> **enableEventCapture**: `boolean`

Defined in: [events/types.ts:77](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/core/src/events/types.ts#L77)

##### enableGazePrediction

> **enableGazePrediction**: `boolean`

Defined in: [events/types.ts:78](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/core/src/events/types.ts#L78)

***

### Point2D

Defined in: [types/geometry.ts:9](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/core/src/types/geometry.ts#L9)

Represents a 2D point in screen or image space

#### Properties

##### x

> **x**: `number`

Defined in: [types/geometry.ts:10](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/core/src/types/geometry.ts#L10)

##### y

> **y**: `number`

Defined in: [types/geometry.ts:11](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/core/src/types/geometry.ts#L11)

***

### Rectangle

Defined in: [types/geometry.ts:17](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/core/src/types/geometry.ts#L17)

Represents a rectangular region

#### Properties

##### x

> **x**: `number`

Defined in: [types/geometry.ts:18](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/core/src/types/geometry.ts#L18)

##### y

> **y**: `number`

Defined in: [types/geometry.ts:19](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/core/src/types/geometry.ts#L19)

##### width

> **width**: `number`

Defined in: [types/geometry.ts:20](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/core/src/types/geometry.ts#L20)

##### height

> **height**: `number`

Defined in: [types/geometry.ts:21](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/core/src/types/geometry.ts#L21)

***

### Size

Defined in: [types/geometry.ts:27](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/core/src/types/geometry.ts#L27)

Represents dimensions

#### Properties

##### width

> **width**: `number`

Defined in: [types/geometry.ts:28](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/core/src/types/geometry.ts#L28)

##### height

> **height**: `number`

Defined in: [types/geometry.ts:29](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/core/src/types/geometry.ts#L29)

***

### Bounds

Defined in: [types/geometry.ts:35](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/core/src/types/geometry.ts#L35)

Represents boundary limits

#### Properties

##### top

> **top**: `number`

Defined in: [types/geometry.ts:36](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/core/src/types/geometry.ts#L36)

##### left

> **left**: `number`

Defined in: [types/geometry.ts:37](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/core/src/types/geometry.ts#L37)

##### right

> **right**: `number`

Defined in: [types/geometry.ts:38](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/core/src/types/geometry.ts#L38)

##### bottom

> **bottom**: `number`

Defined in: [types/geometry.ts:39](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/core/src/types/geometry.ts#L39)

***

### BoundingBox

Defined in: [types/geometry.ts:45](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/core/src/types/geometry.ts#L45)

Represents a bounding box with min/max coordinates

#### Properties

##### xMin

> **xMin**: `number`

Defined in: [types/geometry.ts:46](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/core/src/types/geometry.ts#L46)

##### yMin

> **yMin**: `number`

Defined in: [types/geometry.ts:47](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/core/src/types/geometry.ts#L47)

##### xMax

> **xMax**: `number`

Defined in: [types/geometry.ts:48](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/core/src/types/geometry.ts#L48)

##### yMax

> **yMax**: `number`

Defined in: [types/geometry.ts:49](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/core/src/types/geometry.ts#L49)

***

### GazePrediction

Defined in: [types/prediction.ts:11](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/core/src/types/prediction.ts#L11)

Represents a gaze prediction result

#### Properties

##### x

> **x**: `number`

Defined in: [types/prediction.ts:13](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/core/src/types/prediction.ts#L13)

X coordinate of predicted gaze point

##### y

> **y**: `number`

Defined in: [types/prediction.ts:15](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/core/src/types/prediction.ts#L15)

Y coordinate of predicted gaze point

##### eyeFeatures?

> `optional` **eyeFeatures**: [`EyeFeatures`](#eyefeatures-2)

Defined in: [types/prediction.ts:17](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/core/src/types/prediction.ts#L17)

Eye features used for this prediction

##### all?

> `optional` **all**: [`GazePrediction`](#gazeprediction-1)[]

Defined in: [types/prediction.ts:19](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/core/src/types/prediction.ts#L19)

All predictions from multiple regressors (if applicable)

***

### EyeFeatures

Defined in: [types/prediction.ts:25](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/core/src/types/prediction.ts#L25)

Represents extracted eye features from both eyes

#### Properties

##### left

> **left**: [`EyePatch`](#eyepatch)

Defined in: [types/prediction.ts:26](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/core/src/types/prediction.ts#L26)

##### right

> **right**: [`EyePatch`](#eyepatch)

Defined in: [types/prediction.ts:27](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/core/src/types/prediction.ts#L27)

***

### EyePatch

Defined in: [types/prediction.ts:33](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/core/src/types/prediction.ts#L33)

Represents a single eye patch with image data and metadata

#### Properties

##### imageX

> **imageX**: `number`

Defined in: [types/prediction.ts:35](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/core/src/types/prediction.ts#L35)

X position in source image

##### imageY

> **imageY**: `number`

Defined in: [types/prediction.ts:37](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/core/src/types/prediction.ts#L37)

Y position in source image

##### width

> **width**: `number`

Defined in: [types/prediction.ts:39](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/core/src/types/prediction.ts#L39)

Width of eye patch

##### height

> **height**: `number`

Defined in: [types/prediction.ts:41](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/core/src/types/prediction.ts#L41)

Height of eye patch

##### patch

> **patch**: `ImageData`

Defined in: [types/prediction.ts:43](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/core/src/types/prediction.ts#L43)

Patch image data as ImageData

***

### TrackingData

Defined in: [types/prediction.ts:49](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/core/src/types/prediction.ts#L49)

Represents tracking data for a single frame

#### Properties

##### timestamp

> **timestamp**: `number`

Defined in: [types/prediction.ts:51](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/core/src/types/prediction.ts#L51)

Timestamp of the tracking data

##### eyeFeatures

> **eyeFeatures**: [`EyeFeatures`](#eyefeatures-2) \| `null`

Defined in: [types/prediction.ts:53](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/core/src/types/prediction.ts#L53)

Eye features extracted from the frame

##### confidence?

> `optional` **confidence**: `number`

Defined in: [types/prediction.ts:55](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/core/src/types/prediction.ts#L55)

Face detection confidence (0-1)

***

### EyeData

Defined in: [types/prediction.ts:61](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/core/src/types/prediction.ts#L61)

Represents processed eye data used for regression

#### Properties

##### features

> **features**: `number`[]

Defined in: [types/prediction.ts:63](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/core/src/types/prediction.ts#L63)

Flattened feature vector from eye patches

##### eyeFeatures

> **eyeFeatures**: [`EyeFeatures`](#eyefeatures-2)

Defined in: [types/prediction.ts:65](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/core/src/types/prediction.ts#L65)

Source eye features

***

### RegressionData

Defined in: [types/prediction.ts:85](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/core/src/types/prediction.ts#L85)

Represents stored regression data

#### Properties

##### screenXArray

> **screenXArray**: `number`[][]

Defined in: [types/prediction.ts:87](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/core/src/types/prediction.ts#L87)

Array of screen X positions

##### screenYArray

> **screenYArray**: `number`[][]

Defined in: [types/prediction.ts:89](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/core/src/types/prediction.ts#L89)

Array of screen Y positions

##### eyeFeatures

> **eyeFeatures**: `number`[][]

Defined in: [types/prediction.ts:91](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/core/src/types/prediction.ts#L91)

Array of eye feature vectors

##### calibrationPoints

> **calibrationPoints**: `CalibrationPoint`[]

Defined in: [types/prediction.ts:93](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/core/src/types/prediction.ts#L93)

Calibration points

***

### KalmanFilterConfig

Defined in: [utils/filters/types.ts:47](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/core/src/utils/filters/types.ts#L47)

Configuration for Kalman Filter (1D per coordinate)

#### Properties

##### processNoise?

> `optional` **processNoise**: `number`

Defined in: [utils/filters/types.ts:49](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/core/src/utils/filters/types.ts#L49)

Process noise covariance (how much we expect the true value to change)

##### measurementNoise?

> `optional` **measurementNoise**: `number`

Defined in: [utils/filters/types.ts:52](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/core/src/utils/filters/types.ts#L52)

Measurement noise covariance (how much we trust measurements)

##### errorCovariance?

> `optional` **errorCovariance**: `number`

Defined in: [utils/filters/types.ts:55](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/core/src/utils/filters/types.ts#L55)

Initial error covariance

***

### KalmanFilter4DConfig

Defined in: [utils/filters/types.ts:61](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/core/src/utils/filters/types.ts#L61)

Configuration for 4D Kalman Filter (position + velocity)

#### Properties

##### processNoise?

> `optional` **processNoise**: `number`

Defined in: [utils/filters/types.ts:63](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/core/src/utils/filters/types.ts#L63)

Process noise covariance

##### measurementNoise?

> `optional` **measurementNoise**: `number`

Defined in: [utils/filters/types.ts:66](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/core/src/utils/filters/types.ts#L66)

Measurement noise covariance in pixels

##### initialErrorCovariance?

> `optional` **initialErrorCovariance**: `number`

Defined in: [utils/filters/types.ts:69](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/core/src/utils/filters/types.ts#L69)

Initial error covariance

##### deltaTime?

> `optional` **deltaTime**: `number`

Defined in: [utils/filters/types.ts:72](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/core/src/utils/filters/types.ts#L72)

Time delta between updates in seconds

***

### KalmanFilter4DState

Defined in: [utils/filters/types.ts:78](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/core/src/utils/filters/types.ts#L78)

State of 4D Kalman filter

#### Properties

##### state

> **state**: `number`[]

Defined in: [utils/filters/types.ts:80](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/core/src/utils/filters/types.ts#L80)

State vector [x, y, vx, vy]

##### errorCovariance

> **errorCovariance**: `number`[][]

Defined in: [utils/filters/types.ts:83](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/core/src/utils/filters/types.ts#L83)

Error covariance matrix (4×4)

##### initialized

> **initialized**: `boolean`

Defined in: [utils/filters/types.ts:86](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/core/src/utils/filters/types.ts#L86)

Whether the filter has been initialized

##### lastUpdate

> **lastUpdate**: `number`

Defined in: [utils/filters/types.ts:89](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/core/src/utils/filters/types.ts#L89)

Last update timestamp

## Type Aliases

### CalibrationCallback()

> **CalibrationCallback** = (`data`) => `void`

Defined in: [calibration/types.ts:121](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/core/src/calibration/types.ts#L121)

Calibration callback type

#### Parameters

##### data

[`CalibrationEventData`](#calibrationeventdata)

#### Returns

`void`

***

### GazeCallback()

> **GazeCallback** = (`prediction`, `timestamp`) => `void`

Defined in: core/Webgazer.ts:51

Type for gaze prediction callback

#### Parameters

##### prediction

[`GazePrediction`](#gazeprediction-1) | `null`

##### timestamp

`number`

#### Returns

`void`

***

### WebgazerEventData

> **WebgazerEventData** = [`MouseEventData`](#mouseeventdata) \| [`GazePredictionEventData`](#gazepredictioneventdata) \| [`ErrorEventData`](#erroreventdata) \| `Record`\<`string`, `unknown`\>

Defined in: [events/types.ts:52](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/core/src/events/types.ts#L52)

Generic event data

***

### EventListener()

> **EventListener**\<`T`\> = (`data`) => `void`

Defined in: [events/types.ts:61](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/core/src/events/types.ts#L61)

Event listener callback

#### Type Parameters

##### T

`T` = [`WebgazerEventData`](#webgazereventdata)

#### Parameters

##### data

`T`

#### Returns

`void`

## Variables

### webgazer

> `const` **webgazer**: [`Webgazer`](#webgazer)

Defined in: [index.ts:59](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/core/src/index.ts#L59)

Get the singleton Webgazer instance.
All interactions with Webgazer should go through this instance.

## References

### default

Renames and re-exports [webgazer](#webgazer-1)

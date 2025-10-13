**@webgazer-ts/react**

***

# @webgazer-ts/react

## Interfaces

### GazePrediction

Defined in: core/dist/types/prediction.d.ts:9

Represents a gaze prediction result

#### Properties

##### x

> **x**: `number`

Defined in: core/dist/types/prediction.d.ts:11

X coordinate of predicted gaze point

##### y

> **y**: `number`

Defined in: core/dist/types/prediction.d.ts:13

Y coordinate of predicted gaze point

##### eyeFeatures?

> `optional` **eyeFeatures**: `EyeFeatures`

Defined in: core/dist/types/prediction.d.ts:15

Eye features used for this prediction

##### all?

> `optional` **all**: [`GazePrediction`](#gazeprediction)[]

Defined in: core/dist/types/prediction.d.ts:17

All predictions from multiple regressors (if applicable)

***

### CalibrationScreenProps

Defined in: [react/src/components/CalibrationScreen.tsx:10](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/react/src/components/CalibrationScreen.tsx#L10)

#### Properties

##### pointCount?

> `optional` **pointCount**: `number`

Defined in: [react/src/components/CalibrationScreen.tsx:11](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/react/src/components/CalibrationScreen.tsx#L11)

##### pointDuration?

> `optional` **pointDuration**: `number`

Defined in: [react/src/components/CalibrationScreen.tsx:12](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/react/src/components/CalibrationScreen.tsx#L12)

##### autoAdvance?

> `optional` **autoAdvance**: `boolean`

Defined in: [react/src/components/CalibrationScreen.tsx:13](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/react/src/components/CalibrationScreen.tsx#L13)

##### onComplete()?

> `optional` **onComplete**: (`result`) => `void`

Defined in: [react/src/components/CalibrationScreen.tsx:14](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/react/src/components/CalibrationScreen.tsx#L14)

###### Parameters

###### result

[`CalibrationResult`](#calibrationresult)

###### Returns

`void`

##### onCancel()?

> `optional` **onCancel**: () => `void`

Defined in: [react/src/components/CalibrationScreen.tsx:15](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/react/src/components/CalibrationScreen.tsx#L15)

###### Returns

`void`

##### theme?

> `optional` **theme**: `object`

Defined in: [react/src/components/CalibrationScreen.tsx:16](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/react/src/components/CalibrationScreen.tsx#L16)

###### backgroundColor?

> `optional` **backgroundColor**: `string`

###### pointColor?

> `optional` **pointColor**: `string`

###### progressColor?

> `optional` **progressColor**: `string`

###### textColor?

> `optional` **textColor**: `string`

***

### GazeElementProps

Defined in: [react/src/components/GazeElement.tsx:10](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/react/src/components/GazeElement.tsx#L10)

#### Extends

- [`UseGazeElementOptions`](#usegazeelementoptions)

#### Properties

##### children

> **children**: `ReactNode`

Defined in: [react/src/components/GazeElement.tsx:11](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/react/src/components/GazeElement.tsx#L11)

##### className?

> `optional` **className**: `string`

Defined in: [react/src/components/GazeElement.tsx:12](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/react/src/components/GazeElement.tsx#L12)

##### style?

> `optional` **style**: `CSSProperties`

Defined in: [react/src/components/GazeElement.tsx:13](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/react/src/components/GazeElement.tsx#L13)

##### lookingStyle?

> `optional` **lookingStyle**: `CSSProperties`

Defined in: [react/src/components/GazeElement.tsx:14](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/react/src/components/GazeElement.tsx#L14)

##### onDwellStyle?

> `optional` **onDwellStyle**: `CSSProperties`

Defined in: [react/src/components/GazeElement.tsx:15](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/react/src/components/GazeElement.tsx#L15)

##### threshold?

> `optional` **threshold**: `number`

Defined in: [react/src/types/index.ts:112](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/react/src/types/index.ts#L112)

###### Inherited from

[`UseGazeElementOptions`](#usegazeelementoptions).[`threshold`](#threshold-1)

##### minDwellTime?

> `optional` **minDwellTime**: `number`

Defined in: [react/src/types/index.ts:113](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/react/src/types/index.ts#L113)

###### Inherited from

[`UseGazeElementOptions`](#usegazeelementoptions).[`minDwellTime`](#mindwelltime-1)

##### onEnter()?

> `optional` **onEnter**: () => `void`

Defined in: [react/src/types/index.ts:114](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/react/src/types/index.ts#L114)

###### Returns

`void`

###### Inherited from

[`UseGazeElementOptions`](#usegazeelementoptions).[`onEnter`](#onenter-1)

##### onLeave()?

> `optional` **onLeave**: () => `void`

Defined in: [react/src/types/index.ts:115](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/react/src/types/index.ts#L115)

###### Returns

`void`

###### Inherited from

[`UseGazeElementOptions`](#usegazeelementoptions).[`onLeave`](#onleave-1)

##### onDwell()?

> `optional` **onDwell**: () => `void`

Defined in: [react/src/types/index.ts:116](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/react/src/types/index.ts#L116)

###### Returns

`void`

###### Inherited from

[`UseGazeElementOptions`](#usegazeelementoptions).[`onDwell`](#ondwell-1)

***

### HeatmapOverlayProps

Defined in: [react/src/components/HeatmapOverlay.tsx:10](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/react/src/components/HeatmapOverlay.tsx#L10)

#### Extends

- [`UseGazeHeatmapOptions`](#usegazeheatmapoptions)

#### Properties

##### style?

> `optional` **style**: `CSSProperties`

Defined in: [react/src/components/HeatmapOverlay.tsx:11](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/react/src/components/HeatmapOverlay.tsx#L11)

##### showControls?

> `optional` **showControls**: `boolean`

Defined in: [react/src/components/HeatmapOverlay.tsx:12](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/react/src/components/HeatmapOverlay.tsx#L12)

##### onClear()?

> `optional` **onClear**: () => `void`

Defined in: [react/src/components/HeatmapOverlay.tsx:13](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/react/src/components/HeatmapOverlay.tsx#L13)

###### Returns

`void`

##### width?

> `optional` **width**: `number`

Defined in: [react/src/hooks/useGazeHeatmap.ts:16](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/react/src/hooks/useGazeHeatmap.ts#L16)

###### Inherited from

[`UseGazeHeatmapOptions`](#usegazeheatmapoptions).[`width`](#width-1)

##### height?

> `optional` **height**: `number`

Defined in: [react/src/hooks/useGazeHeatmap.ts:17](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/react/src/hooks/useGazeHeatmap.ts#L17)

###### Inherited from

[`UseGazeHeatmapOptions`](#usegazeheatmapoptions).[`height`](#height-1)

##### radius?

> `optional` **radius**: `number`

Defined in: [react/src/hooks/useGazeHeatmap.ts:18](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/react/src/hooks/useGazeHeatmap.ts#L18)

###### Inherited from

[`UseGazeHeatmapOptions`](#usegazeheatmapoptions).[`radius`](#radius-1)

##### maxOpacity?

> `optional` **maxOpacity**: `number`

Defined in: [react/src/hooks/useGazeHeatmap.ts:19](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/react/src/hooks/useGazeHeatmap.ts#L19)

###### Inherited from

[`UseGazeHeatmapOptions`](#usegazeheatmapoptions).[`maxOpacity`](#maxopacity-1)

##### blur?

> `optional` **blur**: `number`

Defined in: [react/src/hooks/useGazeHeatmap.ts:20](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/react/src/hooks/useGazeHeatmap.ts#L20)

###### Inherited from

[`UseGazeHeatmapOptions`](#usegazeheatmapoptions).[`blur`](#blur-1)

##### gradient?

> `optional` **gradient**: `Record`\<`number`, `string`\>

Defined in: [react/src/hooks/useGazeHeatmap.ts:21](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/react/src/hooks/useGazeHeatmap.ts#L21)

###### Inherited from

[`UseGazeHeatmapOptions`](#usegazeheatmapoptions).[`gradient`](#gradient-1)

***

### WebgazerProviderProps

Defined in: [react/src/components/WebgazerProvider.tsx:11](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/react/src/components/WebgazerProvider.tsx#L11)

#### Extends

- [`UseWebgazerOptions`](#usewebgazeroptions)

#### Properties

##### children

> **children**: `ReactNode`

Defined in: [react/src/components/WebgazerProvider.tsx:12](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/react/src/components/WebgazerProvider.tsx#L12)

##### tracker?

> `optional` **tracker**: `"TFFacemesh"`

Defined in: [react/src/types/index.ts:25](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/react/src/types/index.ts#L25)

###### Inherited from

[`UseWebgazerOptions`](#usewebgazeroptions).[`tracker`](#tracker-2)

##### regression?

> `optional` **regression**: `"ridge"` \| `"ridgeThreaded"` \| `"ridgeWeighted"`

Defined in: [react/src/types/index.ts:26](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/react/src/types/index.ts#L26)

###### Inherited from

[`UseWebgazerOptions`](#usewebgazeroptions).[`regression`](#regression-2)

##### saveDataAcrossSessions?

> `optional` **saveDataAcrossSessions**: `boolean`

Defined in: [react/src/types/index.ts:27](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/react/src/types/index.ts#L27)

###### Inherited from

[`UseWebgazerOptions`](#usewebgazeroptions).[`saveDataAcrossSessions`](#savedataacrosssessions-2)

##### videoViewerWidth?

> `optional` **videoViewerWidth**: `number`

Defined in: [react/src/types/index.ts:28](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/react/src/types/index.ts#L28)

###### Inherited from

[`UseWebgazerOptions`](#usewebgazeroptions).[`videoViewerWidth`](#videoviewerwidth-2)

##### videoViewerHeight?

> `optional` **videoViewerHeight**: `number`

Defined in: [react/src/types/index.ts:29](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/react/src/types/index.ts#L29)

###### Inherited from

[`UseWebgazerOptions`](#usewebgazeroptions).[`videoViewerHeight`](#videoviewerheight-2)

##### showVideoPreview?

> `optional` **showVideoPreview**: `boolean`

Defined in: [react/src/types/index.ts:30](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/react/src/types/index.ts#L30)

###### Inherited from

[`UseWebgazerOptions`](#usewebgazeroptions).[`showVideoPreview`](#showvideopreview-2)

##### showFaceOverlay?

> `optional` **showFaceOverlay**: `boolean`

Defined in: [react/src/types/index.ts:31](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/react/src/types/index.ts#L31)

###### Inherited from

[`UseWebgazerOptions`](#usewebgazeroptions).[`showFaceOverlay`](#showfaceoverlay-2)

##### showFaceFeedbackBox?

> `optional` **showFaceFeedbackBox**: `boolean`

Defined in: [react/src/types/index.ts:32](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/react/src/types/index.ts#L32)

###### Inherited from

[`UseWebgazerOptions`](#usewebgazeroptions).[`showFaceFeedbackBox`](#showfacefeedbackbox-2)

##### showGazeDot?

> `optional` **showGazeDot**: `boolean`

Defined in: [react/src/types/index.ts:33](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/react/src/types/index.ts#L33)

###### Inherited from

[`UseWebgazerOptions`](#usewebgazeroptions).[`showGazeDot`](#showgazedot-2)

##### applyKalmanFilter?

> `optional` **applyKalmanFilter**: `boolean`

Defined in: [react/src/types/index.ts:34](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/react/src/types/index.ts#L34)

###### Inherited from

[`UseWebgazerOptions`](#usewebgazeroptions).[`applyKalmanFilter`](#applykalmanfilter-2)

##### autoStart?

> `optional` **autoStart**: `boolean`

Defined in: [react/src/types/index.ts:38](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/react/src/types/index.ts#L38)

###### Inherited from

[`UseWebgazerOptions`](#usewebgazeroptions).[`autoStart`](#autostart-1)

##### onGaze()?

> `optional` **onGaze**: (`data`, `timestamp`) => `void`

Defined in: [react/src/types/index.ts:39](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/react/src/types/index.ts#L39)

###### Parameters

###### data

[`GazePrediction`](#gazeprediction) | `null`

###### timestamp

`number`

###### Returns

`void`

###### Inherited from

[`UseWebgazerOptions`](#usewebgazeroptions).[`onGaze`](#ongaze-1)

***

### HeatmapPoint

Defined in: [react/src/hooks/useGazeHeatmap.ts:9](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/react/src/hooks/useGazeHeatmap.ts#L9)

#### Properties

##### x

> **x**: `number`

Defined in: [react/src/hooks/useGazeHeatmap.ts:10](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/react/src/hooks/useGazeHeatmap.ts#L10)

##### y

> **y**: `number`

Defined in: [react/src/hooks/useGazeHeatmap.ts:11](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/react/src/hooks/useGazeHeatmap.ts#L11)

##### timestamp

> **timestamp**: `number`

Defined in: [react/src/hooks/useGazeHeatmap.ts:12](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/react/src/hooks/useGazeHeatmap.ts#L12)

***

### UseGazeHeatmapOptions

Defined in: [react/src/hooks/useGazeHeatmap.ts:15](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/react/src/hooks/useGazeHeatmap.ts#L15)

#### Extended by

- [`HeatmapOverlayProps`](#heatmapoverlayprops)

#### Properties

##### width?

> `optional` **width**: `number`

Defined in: [react/src/hooks/useGazeHeatmap.ts:16](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/react/src/hooks/useGazeHeatmap.ts#L16)

##### height?

> `optional` **height**: `number`

Defined in: [react/src/hooks/useGazeHeatmap.ts:17](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/react/src/hooks/useGazeHeatmap.ts#L17)

##### radius?

> `optional` **radius**: `number`

Defined in: [react/src/hooks/useGazeHeatmap.ts:18](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/react/src/hooks/useGazeHeatmap.ts#L18)

##### maxOpacity?

> `optional` **maxOpacity**: `number`

Defined in: [react/src/hooks/useGazeHeatmap.ts:19](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/react/src/hooks/useGazeHeatmap.ts#L19)

##### blur?

> `optional` **blur**: `number`

Defined in: [react/src/hooks/useGazeHeatmap.ts:20](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/react/src/hooks/useGazeHeatmap.ts#L20)

##### gradient?

> `optional` **gradient**: `Record`\<`number`, `string`\>

Defined in: [react/src/hooks/useGazeHeatmap.ts:21](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/react/src/hooks/useGazeHeatmap.ts#L21)

***

### UseGazeHeatmapReturn

Defined in: [react/src/hooks/useGazeHeatmap.ts:24](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/react/src/hooks/useGazeHeatmap.ts#L24)

#### Properties

##### canvasRef

> **canvasRef**: `RefObject`\<`HTMLCanvasElement`\>

Defined in: [react/src/hooks/useGazeHeatmap.ts:25](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/react/src/hooks/useGazeHeatmap.ts#L25)

##### points

> **points**: [`HeatmapPoint`](#heatmappoint)[]

Defined in: [react/src/hooks/useGazeHeatmap.ts:26](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/react/src/hooks/useGazeHeatmap.ts#L26)

##### clear()

> **clear**: () => `void`

Defined in: [react/src/hooks/useGazeHeatmap.ts:27](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/react/src/hooks/useGazeHeatmap.ts#L27)

###### Returns

`void`

##### exportData()

> **exportData**: () => `string`

Defined in: [react/src/hooks/useGazeHeatmap.ts:28](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/react/src/hooks/useGazeHeatmap.ts#L28)

###### Returns

`string`

##### exportImage()

> **exportImage**: () => `string` \| `null`

Defined in: [react/src/hooks/useGazeHeatmap.ts:29](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/react/src/hooks/useGazeHeatmap.ts#L29)

###### Returns

`string` \| `null`

***

### GazeRecordingEntry

Defined in: [react/src/hooks/useGazeRecording.ts:9](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/react/src/hooks/useGazeRecording.ts#L9)

#### Properties

##### x

> **x**: `number`

Defined in: [react/src/hooks/useGazeRecording.ts:10](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/react/src/hooks/useGazeRecording.ts#L10)

##### y

> **y**: `number`

Defined in: [react/src/hooks/useGazeRecording.ts:11](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/react/src/hooks/useGazeRecording.ts#L11)

##### timestamp

> **timestamp**: `number`

Defined in: [react/src/hooks/useGazeRecording.ts:12](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/react/src/hooks/useGazeRecording.ts#L12)

##### relativeTime

> **relativeTime**: `number`

Defined in: [react/src/hooks/useGazeRecording.ts:13](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/react/src/hooks/useGazeRecording.ts#L13)

***

### UseGazeRecordingReturn

Defined in: [react/src/hooks/useGazeRecording.ts:16](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/react/src/hooks/useGazeRecording.ts#L16)

#### Properties

##### isRecording

> **isRecording**: `boolean`

Defined in: [react/src/hooks/useGazeRecording.ts:17](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/react/src/hooks/useGazeRecording.ts#L17)

##### data

> **data**: [`GazeRecordingEntry`](#gazerecordingentry)[]

Defined in: [react/src/hooks/useGazeRecording.ts:18](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/react/src/hooks/useGazeRecording.ts#L18)

##### startRecording()

> **startRecording**: () => `void`

Defined in: [react/src/hooks/useGazeRecording.ts:19](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/react/src/hooks/useGazeRecording.ts#L19)

###### Returns

`void`

##### stopRecording()

> **stopRecording**: () => `void`

Defined in: [react/src/hooks/useGazeRecording.ts:20](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/react/src/hooks/useGazeRecording.ts#L20)

###### Returns

`void`

##### clearData()

> **clearData**: () => `void`

Defined in: [react/src/hooks/useGazeRecording.ts:21](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/react/src/hooks/useGazeRecording.ts#L21)

###### Returns

`void`

##### exportCSV()

> **exportCSV**: () => `void`

Defined in: [react/src/hooks/useGazeRecording.ts:22](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/react/src/hooks/useGazeRecording.ts#L22)

###### Returns

`void`

##### exportJSON()

> **exportJSON**: () => `void`

Defined in: [react/src/hooks/useGazeRecording.ts:23](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/react/src/hooks/useGazeRecording.ts#L23)

###### Returns

`void`

***

### WebgazerConfig

Defined in: [react/src/types/index.ts:24](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/react/src/types/index.ts#L24)

#### Extended by

- [`UseWebgazerOptions`](#usewebgazeroptions)

#### Properties

##### tracker?

> `optional` **tracker**: `"TFFacemesh"`

Defined in: [react/src/types/index.ts:25](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/react/src/types/index.ts#L25)

##### regression?

> `optional` **regression**: `"ridge"` \| `"ridgeThreaded"` \| `"ridgeWeighted"`

Defined in: [react/src/types/index.ts:26](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/react/src/types/index.ts#L26)

##### saveDataAcrossSessions?

> `optional` **saveDataAcrossSessions**: `boolean`

Defined in: [react/src/types/index.ts:27](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/react/src/types/index.ts#L27)

##### videoViewerWidth?

> `optional` **videoViewerWidth**: `number`

Defined in: [react/src/types/index.ts:28](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/react/src/types/index.ts#L28)

##### videoViewerHeight?

> `optional` **videoViewerHeight**: `number`

Defined in: [react/src/types/index.ts:29](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/react/src/types/index.ts#L29)

##### showVideoPreview?

> `optional` **showVideoPreview**: `boolean`

Defined in: [react/src/types/index.ts:30](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/react/src/types/index.ts#L30)

##### showFaceOverlay?

> `optional` **showFaceOverlay**: `boolean`

Defined in: [react/src/types/index.ts:31](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/react/src/types/index.ts#L31)

##### showFaceFeedbackBox?

> `optional` **showFaceFeedbackBox**: `boolean`

Defined in: [react/src/types/index.ts:32](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/react/src/types/index.ts#L32)

##### showGazeDot?

> `optional` **showGazeDot**: `boolean`

Defined in: [react/src/types/index.ts:33](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/react/src/types/index.ts#L33)

##### applyKalmanFilter?

> `optional` **applyKalmanFilter**: `boolean`

Defined in: [react/src/types/index.ts:34](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/react/src/types/index.ts#L34)

***

### UseWebgazerOptions

Defined in: [react/src/types/index.ts:37](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/react/src/types/index.ts#L37)

#### Extends

- [`WebgazerConfig`](#webgazerconfig)

#### Extended by

- [`WebgazerProviderProps`](#webgazerproviderprops)

#### Properties

##### tracker?

> `optional` **tracker**: `"TFFacemesh"`

Defined in: [react/src/types/index.ts:25](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/react/src/types/index.ts#L25)

###### Inherited from

[`WebgazerConfig`](#webgazerconfig).[`tracker`](#tracker-1)

##### regression?

> `optional` **regression**: `"ridge"` \| `"ridgeThreaded"` \| `"ridgeWeighted"`

Defined in: [react/src/types/index.ts:26](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/react/src/types/index.ts#L26)

###### Inherited from

[`WebgazerConfig`](#webgazerconfig).[`regression`](#regression-1)

##### saveDataAcrossSessions?

> `optional` **saveDataAcrossSessions**: `boolean`

Defined in: [react/src/types/index.ts:27](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/react/src/types/index.ts#L27)

###### Inherited from

[`WebgazerConfig`](#webgazerconfig).[`saveDataAcrossSessions`](#savedataacrosssessions-1)

##### videoViewerWidth?

> `optional` **videoViewerWidth**: `number`

Defined in: [react/src/types/index.ts:28](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/react/src/types/index.ts#L28)

###### Inherited from

[`WebgazerConfig`](#webgazerconfig).[`videoViewerWidth`](#videoviewerwidth-1)

##### videoViewerHeight?

> `optional` **videoViewerHeight**: `number`

Defined in: [react/src/types/index.ts:29](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/react/src/types/index.ts#L29)

###### Inherited from

[`WebgazerConfig`](#webgazerconfig).[`videoViewerHeight`](#videoviewerheight-1)

##### showVideoPreview?

> `optional` **showVideoPreview**: `boolean`

Defined in: [react/src/types/index.ts:30](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/react/src/types/index.ts#L30)

###### Inherited from

[`WebgazerConfig`](#webgazerconfig).[`showVideoPreview`](#showvideopreview-1)

##### showFaceOverlay?

> `optional` **showFaceOverlay**: `boolean`

Defined in: [react/src/types/index.ts:31](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/react/src/types/index.ts#L31)

###### Inherited from

[`WebgazerConfig`](#webgazerconfig).[`showFaceOverlay`](#showfaceoverlay-1)

##### showFaceFeedbackBox?

> `optional` **showFaceFeedbackBox**: `boolean`

Defined in: [react/src/types/index.ts:32](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/react/src/types/index.ts#L32)

###### Inherited from

[`WebgazerConfig`](#webgazerconfig).[`showFaceFeedbackBox`](#showfacefeedbackbox-1)

##### showGazeDot?

> `optional` **showGazeDot**: `boolean`

Defined in: [react/src/types/index.ts:33](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/react/src/types/index.ts#L33)

###### Inherited from

[`WebgazerConfig`](#webgazerconfig).[`showGazeDot`](#showgazedot-1)

##### applyKalmanFilter?

> `optional` **applyKalmanFilter**: `boolean`

Defined in: [react/src/types/index.ts:34](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/react/src/types/index.ts#L34)

###### Inherited from

[`WebgazerConfig`](#webgazerconfig).[`applyKalmanFilter`](#applykalmanfilter-1)

##### autoStart?

> `optional` **autoStart**: `boolean`

Defined in: [react/src/types/index.ts:38](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/react/src/types/index.ts#L38)

##### onGaze()?

> `optional` **onGaze**: (`data`, `timestamp`) => `void`

Defined in: [react/src/types/index.ts:39](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/react/src/types/index.ts#L39)

###### Parameters

###### data

[`GazePrediction`](#gazeprediction) | `null`

###### timestamp

`number`

###### Returns

`void`

***

### UseWebgazerReturn

Defined in: [react/src/types/index.ts:42](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/react/src/types/index.ts#L42)

#### Properties

##### gazeData

> **gazeData**: [`GazePrediction`](#gazeprediction) \| `null`

Defined in: [react/src/types/index.ts:44](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/react/src/types/index.ts#L44)

##### isRunning

> **isRunning**: `boolean`

Defined in: [react/src/types/index.ts:45](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/react/src/types/index.ts#L45)

##### calibrationCount

> **calibrationCount**: `number`

Defined in: [react/src/types/index.ts:46](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/react/src/types/index.ts#L46)

##### start()

> **start**: () => `Promise`\<`void`\>

Defined in: [react/src/types/index.ts:49](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/react/src/types/index.ts#L49)

###### Returns

`Promise`\<`void`\>

##### stop()

> **stop**: () => `Promise`\<`void`\>

Defined in: [react/src/types/index.ts:50](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/react/src/types/index.ts#L50)

###### Returns

`Promise`\<`void`\>

##### pause()

> **pause**: () => `Promise`\<`void`\>

Defined in: [react/src/types/index.ts:51](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/react/src/types/index.ts#L51)

###### Returns

`Promise`\<`void`\>

##### resume()

> **resume**: () => `Promise`\<`void`\>

Defined in: [react/src/types/index.ts:52](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/react/src/types/index.ts#L52)

###### Returns

`Promise`\<`void`\>

##### clearData()

> **clearData**: () => `void`

Defined in: [react/src/types/index.ts:53](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/react/src/types/index.ts#L53)

###### Returns

`void`

##### showVideo()

> **showVideo**: () => `void`

Defined in: [react/src/types/index.ts:56](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/react/src/types/index.ts#L56)

###### Returns

`void`

##### hideVideo()

> **hideVideo**: () => `void`

Defined in: [react/src/types/index.ts:57](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/react/src/types/index.ts#L57)

###### Returns

`void`

##### setTracker()

> **setTracker**: (`trackerName`) => `void`

Defined in: [react/src/types/index.ts:60](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/react/src/types/index.ts#L60)

###### Parameters

###### trackerName

`string`

###### Returns

`void`

##### setRegression()

> **setRegression**: (`regressionName`) => `void`

Defined in: [react/src/types/index.ts:61](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/react/src/types/index.ts#L61)

###### Parameters

###### regressionName

`string`

###### Returns

`void`

##### showFaceOverlay()

> **showFaceOverlay**: (`show`) => `void`

Defined in: [react/src/types/index.ts:62](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/react/src/types/index.ts#L62)

###### Parameters

###### show

`boolean`

###### Returns

`void`

##### showFaceFeedbackBox()

> **showFaceFeedbackBox**: (`show`) => `void`

Defined in: [react/src/types/index.ts:63](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/react/src/types/index.ts#L63)

###### Parameters

###### show

`boolean`

###### Returns

`void`

##### showPredictionPoints()

> **showPredictionPoints**: (`show`) => `void`

Defined in: [react/src/types/index.ts:64](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/react/src/types/index.ts#L64)

###### Parameters

###### show

`boolean`

###### Returns

`void`

##### setVideoViewerSize()

> **setVideoViewerSize**: (`width`, `height`) => `void`

Defined in: [react/src/types/index.ts:65](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/react/src/types/index.ts#L65)

###### Parameters

###### width

`number`

###### height

`number`

###### Returns

`void`

##### applyKalmanFilter()

> **applyKalmanFilter**: (`apply`) => `void`

Defined in: [react/src/types/index.ts:66](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/react/src/types/index.ts#L66)

###### Parameters

###### apply

`boolean`

###### Returns

`void`

##### recordScreenPosition()

> **recordScreenPosition**: (`x`, `y`, `eventType?`) => `void`

Defined in: [react/src/types/index.ts:69](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/react/src/types/index.ts#L69)

###### Parameters

###### x

`number`

###### y

`number`

###### eventType?

`"click"` | `"move"`

###### Returns

`void`

##### addMouseEventListeners()

> **addMouseEventListeners**: () => `void`

Defined in: [react/src/types/index.ts:70](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/react/src/types/index.ts#L70)

###### Returns

`void`

##### removeMouseEventListeners()

> **removeMouseEventListeners**: () => `void`

Defined in: [react/src/types/index.ts:71](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/react/src/types/index.ts#L71)

###### Returns

`void`

##### webgazer

> **webgazer**: `Webgazer` \| `null`

Defined in: [react/src/types/index.ts:74](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/react/src/types/index.ts#L74)

***

### UseCalibrationOptions

Defined in: [react/src/types/index.ts:77](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/react/src/types/index.ts#L77)

#### Properties

##### pointCount?

> `optional` **pointCount**: `number`

Defined in: [react/src/types/index.ts:78](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/react/src/types/index.ts#L78)

##### pointDuration?

> `optional` **pointDuration**: `number`

Defined in: [react/src/types/index.ts:79](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/react/src/types/index.ts#L79)

##### autoAdvance?

> `optional` **autoAdvance**: `boolean`

Defined in: [react/src/types/index.ts:80](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/react/src/types/index.ts#L80)

##### onComplete()?

> `optional` **onComplete**: (`result`) => `void`

Defined in: [react/src/types/index.ts:81](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/react/src/types/index.ts#L81)

###### Parameters

###### result

[`CalibrationResult`](#calibrationresult)

###### Returns

`void`

##### onPointComplete()?

> `optional` **onPointComplete**: (`index`) => `void`

Defined in: [react/src/types/index.ts:82](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/react/src/types/index.ts#L82)

###### Parameters

###### index

`number`

###### Returns

`void`

***

### CalibrationResult

Defined in: [react/src/types/index.ts:85](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/react/src/types/index.ts#L85)

#### Properties

##### success

> **success**: `boolean`

Defined in: [react/src/types/index.ts:86](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/react/src/types/index.ts#L86)

##### pointsCalibrated

> **pointsCalibrated**: `number`

Defined in: [react/src/types/index.ts:87](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/react/src/types/index.ts#L87)

##### accuracy?

> `optional` **accuracy**: `number`

Defined in: [react/src/types/index.ts:88](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/react/src/types/index.ts#L88)

***

### CalibrationPoint

Defined in: [react/src/types/index.ts:91](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/react/src/types/index.ts#L91)

#### Properties

##### x

> **x**: `number`

Defined in: [react/src/types/index.ts:92](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/react/src/types/index.ts#L92)

##### y

> **y**: `number`

Defined in: [react/src/types/index.ts:93](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/react/src/types/index.ts#L93)

##### index

> **index**: `number`

Defined in: [react/src/types/index.ts:94](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/react/src/types/index.ts#L94)

***

### UseCalibrationReturn

Defined in: [react/src/types/index.ts:97](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/react/src/types/index.ts#L97)

#### Properties

##### isCalibrating

> **isCalibrating**: `boolean`

Defined in: [react/src/types/index.ts:98](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/react/src/types/index.ts#L98)

##### progress

> **progress**: `number`

Defined in: [react/src/types/index.ts:99](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/react/src/types/index.ts#L99)

##### currentPoint

> **currentPoint**: [`CalibrationPoint`](#calibrationpoint) \| `null`

Defined in: [react/src/types/index.ts:100](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/react/src/types/index.ts#L100)

##### startCalibration()

> **startCalibration**: () => `void`

Defined in: [react/src/types/index.ts:101](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/react/src/types/index.ts#L101)

###### Returns

`void`

##### stopCalibration()

> **stopCalibration**: () => `void`

Defined in: [react/src/types/index.ts:102](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/react/src/types/index.ts#L102)

###### Returns

`void`

##### nextPoint()

> **nextPoint**: () => `void`

Defined in: [react/src/types/index.ts:103](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/react/src/types/index.ts#L103)

###### Returns

`void`

***

### UseGazeTrackingOptions

Defined in: [react/src/types/index.ts:106](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/react/src/types/index.ts#L106)

#### Properties

##### throttle?

> `optional` **throttle**: `number`

Defined in: [react/src/types/index.ts:107](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/react/src/types/index.ts#L107)

##### filter?

> `optional` **filter**: `boolean`

Defined in: [react/src/types/index.ts:108](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/react/src/types/index.ts#L108)

***

### UseGazeElementOptions

Defined in: [react/src/types/index.ts:111](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/react/src/types/index.ts#L111)

#### Extended by

- [`GazeElementProps`](#gazeelementprops)

#### Properties

##### threshold?

> `optional` **threshold**: `number`

Defined in: [react/src/types/index.ts:112](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/react/src/types/index.ts#L112)

##### minDwellTime?

> `optional` **minDwellTime**: `number`

Defined in: [react/src/types/index.ts:113](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/react/src/types/index.ts#L113)

##### onEnter()?

> `optional` **onEnter**: () => `void`

Defined in: [react/src/types/index.ts:114](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/react/src/types/index.ts#L114)

###### Returns

`void`

##### onLeave()?

> `optional` **onLeave**: () => `void`

Defined in: [react/src/types/index.ts:115](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/react/src/types/index.ts#L115)

###### Returns

`void`

##### onDwell()?

> `optional` **onDwell**: () => `void`

Defined in: [react/src/types/index.ts:116](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/react/src/types/index.ts#L116)

###### Returns

`void`

***

### UseGazeElementReturn

Defined in: [react/src/types/index.ts:119](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/react/src/types/index.ts#L119)

#### Type Parameters

##### T

`T` *extends* `HTMLElement` = `HTMLElement`

#### Properties

##### ref

> **ref**: `RefObject`\<`T`\>

Defined in: [react/src/types/index.ts:120](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/react/src/types/index.ts#L120)

##### isLooking

> **isLooking**: `boolean`

Defined in: [react/src/types/index.ts:121](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/react/src/types/index.ts#L121)

##### dwellTime

> **dwellTime**: `number`

Defined in: [react/src/types/index.ts:122](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/react/src/types/index.ts#L122)

## Functions

### CalibrationScreen()

> **CalibrationScreen**(`__namedParameters`): `Element`

Defined in: [react/src/components/CalibrationScreen.tsx:24](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/react/src/components/CalibrationScreen.tsx#L24)

#### Parameters

##### \_\_namedParameters

[`CalibrationScreenProps`](#calibrationscreenprops)

#### Returns

`Element`

***

### GazeElement()

> **GazeElement**(`__namedParameters`): `Element`

Defined in: [react/src/components/GazeElement.tsx:18](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/react/src/components/GazeElement.tsx#L18)

#### Parameters

##### \_\_namedParameters

[`GazeElementProps`](#gazeelementprops)

#### Returns

`Element`

***

### HeatmapOverlay()

> **HeatmapOverlay**(`__namedParameters`): `Element`

Defined in: [react/src/components/HeatmapOverlay.tsx:16](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/react/src/components/HeatmapOverlay.tsx#L16)

#### Parameters

##### \_\_namedParameters

[`HeatmapOverlayProps`](#heatmapoverlayprops)

#### Returns

`Element`

***

### WebgazerProvider()

> **WebgazerProvider**(`__namedParameters`): `Element`

Defined in: [react/src/components/WebgazerProvider.tsx:15](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/react/src/components/WebgazerProvider.tsx#L15)

#### Parameters

##### \_\_namedParameters

[`WebgazerProviderProps`](#webgazerproviderprops)

#### Returns

`Element`

***

### useWebgazerContext()

> **useWebgazerContext**(): `WebgazerContextValue`

Defined in: [react/src/context/WebgazerContext.ts:18](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/react/src/context/WebgazerContext.ts#L18)

#### Returns

`WebgazerContextValue`

***

### useCalibration()

> **useCalibration**(`options`): [`UseCalibrationReturn`](#usecalibrationreturn)

Defined in: [react/src/hooks/useCalibration.ts:14](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/react/src/hooks/useCalibration.ts#L14)

@webgazer-ts/react
React hooks and components for Webgazer.ts eye tracking

#### Parameters

##### options

[`UseCalibrationOptions`](#usecalibrationoptions) = `{}`

#### Returns

[`UseCalibrationReturn`](#usecalibrationreturn)

***

### useGazeElement()

> **useGazeElement**\<`T`\>(`options`): [`UseGazeElementReturn`](#usegazeelementreturn)\<`T`\>

Defined in: [react/src/hooks/useGazeElement.ts:10](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/react/src/hooks/useGazeElement.ts#L10)

@webgazer-ts/react
React hooks and components for Webgazer.ts eye tracking

#### Type Parameters

##### T

`T` *extends* `HTMLElement` = `HTMLElement`

#### Parameters

##### options

[`UseGazeElementOptions`](#usegazeelementoptions) = `{}`

#### Returns

[`UseGazeElementReturn`](#usegazeelementreturn)\<`T`\>

***

### useGazeHeatmap()

> **useGazeHeatmap**(`options`): [`UseGazeHeatmapReturn`](#usegazeheatmapreturn)

Defined in: [react/src/hooks/useGazeHeatmap.ts:32](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/react/src/hooks/useGazeHeatmap.ts#L32)

@webgazer-ts/react
React hooks and components for Webgazer.ts eye tracking

#### Parameters

##### options

[`UseGazeHeatmapOptions`](#usegazeheatmapoptions) = `{}`

#### Returns

[`UseGazeHeatmapReturn`](#usegazeheatmapreturn)

***

### useGazeRecording()

> **useGazeRecording**(): [`UseGazeRecordingReturn`](#usegazerecordingreturn)

Defined in: [react/src/hooks/useGazeRecording.ts:26](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/react/src/hooks/useGazeRecording.ts#L26)

@webgazer-ts/react
React hooks and components for Webgazer.ts eye tracking

#### Returns

[`UseGazeRecordingReturn`](#usegazerecordingreturn)

***

### useGazeTracking()

> **useGazeTracking**(): [`GazePrediction`](#gazeprediction) \| `null`

Defined in: [react/src/hooks/useGazeTracking.ts:10](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/react/src/hooks/useGazeTracking.ts#L10)

@webgazer-ts/react
React hooks and components for Webgazer.ts eye tracking

#### Returns

[`GazePrediction`](#gazeprediction) \| `null`

***

### useWebgazer()

> **useWebgazer**(`options`): [`UseWebgazerReturn`](#usewebgazerreturn)

Defined in: [react/src/hooks/useWebgazer.ts:16](https://github.com/jhndrncrz/webgazer-ts/blob/main/packages/react/src/hooks/useWebgazer.ts#L16)

@webgazer-ts/react
React hooks and components for Webgazer.ts eye tracking

#### Parameters

##### options

[`UseWebgazerOptions`](#usewebgazeroptions) = `{}`

#### Returns

[`UseWebgazerReturn`](#usewebgazerreturn)

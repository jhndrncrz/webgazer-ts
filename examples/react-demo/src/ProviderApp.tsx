import { WebgazerProvider, useWebgazerContext } from '@webgazer-ts/react';

const styles = {
  container: { padding: '40px', color: 'white', background: '#333', minHeight: '100vh', fontFamily: 'sans-serif' },
  box: { padding: '20px', border: '1px solid rgba(255,255,255,0.3)', borderRadius: '8px', marginTop: '20px', background: 'rgba(255,255,255,0.05)' },
  button: { padding: '10px 20px', fontSize: '16px', cursor: 'pointer', borderRadius: '4px', border: 'none', background: '#4ade80', color: '#1a1a1a', fontWeight: 'bold' as const },
  buttonStop: { background: '#f87171' }
};

function GazeDisplay() {
  const { gazeData, isRunning } = useWebgazerContext();
  
  return (
    <div style={styles.box}>
      <h3>Child Component (using context)</h3>
      <p>Status: <strong>{isRunning ? 'Running' : 'Stopped'}</strong></p>
      {gazeData ? (
        <p>Gaze Position: <code style={{background: '#000', padding: '2px 6px'}}>{Math.round(gazeData.x)}, {Math.round(gazeData.y)}</code></p>
      ) : (
        <p>Waiting for gaze data...</p>
      )}
    </div>
  );
}

function Controls() {
  const { isRunning, start, stop } = useWebgazerContext();
  
  return (
    <div style={{ marginTop: '20px' }}>
      <button 
        onClick={isRunning ? stop : start}
        style={{
          ...styles.button,
          ...(isRunning ? styles.buttonStop : {})
        }}
      >
        {isRunning ? '⏹️ Stop Tracking' : '▶️ Start Tracking'}
      </button>
    </div>
  );
}

export default function ProviderApp() {
  return (
    <div style={styles.container}>
      <h1>Webgazer Provider Demo</h1>
      <p>This demo uses <code>&lt;WebgazerProvider&gt;</code> to share eye tracking state across the component tree without prop drilling.</p>
      
      <WebgazerProvider 
        autoStart={false}
        showVideoPreview={true}
        showFaceOverlay={true}
      >
        <Controls />
        <GazeDisplay />
        
        <div style={{marginTop: '30px', opacity: 0.8, fontSize: '0.9rem'}}>
          <p>The provider handles the Webgazer singleton lifecycle and exposes its state via <code>useWebgazerContext()</code>.</p>
        </div>
      </WebgazerProvider>
    </div>
  );
}

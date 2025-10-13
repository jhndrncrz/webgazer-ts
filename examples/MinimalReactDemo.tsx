import React, { useState, useEffect } from 'react';
import { useWebgazer } from '@webgazer-ts/react';

/**
 * Minimal Webgazer React Demo
 * 
 * This demonstrates the simplest possible usage of Webgazer with React.
 * No calibration screen required - just continuous learning from user clicks!
 */

export default function MinimalWebgazerDemo() {
  const [calibrating, setCalibrating] = useState(false);
  
  // Use the Webgazer hook - that's it!
  const { gazeData, isRunning, calibrationCount, start, stop } = useWebgazer({
    autoStart: false, // We'll start manually
  });

  // Enable calibration after starting
  useEffect(() => {
    if (isRunning && !calibrating) {
      // This is THE KEY: addMouseEventListeners enables continuous calibration
      import('@webgazer-ts/core').then((webgazer) => {
        webgazer.default.addMouseEventListeners();
      });
      setCalibrating(true);
    }
  }, [isRunning, calibrating]);

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>👁️ Webgazer React Demo</h1>
        <p style={styles.subtitle}>Minimal Setup - Continuous Calibration</p>
      </header>

      {/* Status Display */}
      <div style={styles.statusBar}>
        <div style={styles.statusItem}>
          <div style={styles.statusLabel}>Tracking</div>
          <div style={{
            ...styles.statusValue,
            color: isRunning ? '#4ade80' : '#f87171'
          }}>
            {isRunning ? '✅ Active' : '❌ Stopped'}
          </div>
        </div>
        <div style={styles.statusItem}>
          <div style={styles.statusLabel}>Calibration Points</div>
          <div style={styles.statusValue}>{calibrationCount}</div>
        </div>
        <div style={styles.statusItem}>
          <div style={styles.statusLabel}>Gaze Position</div>
          <div style={styles.statusValue}>
            {gazeData 
              ? `(${Math.round(gazeData.x)}, ${Math.round(gazeData.y)})`
              : '-'
            }
          </div>
        </div>
      </div>

      {/* Controls */}
      <div style={styles.controls}>
        <button
          onClick={start}
          disabled={isRunning}
          style={{
            ...styles.button,
            ...(isRunning ? styles.buttonDisabled : styles.buttonPrimary),
          }}
        >
          ▶️ Start Tracking
        </button>
        <button
          onClick={stop}
          disabled={!isRunning}
          style={{
            ...styles.button,
            ...(!isRunning && styles.buttonDisabled),
          }}
        >
          ⏹️ Stop Tracking
        </button>
      </div>

      {/* Instructions */}
      <div style={styles.infoBox}>
        <h3>ℹ️ How It Works</h3>
        <p>
          Webgazer learns continuously from your clicks. There's no "calibration period" -
          every click throughout your session improves the model's accuracy!
        </p>
        <ol style={styles.instructions}>
          <li>Click "Start Tracking" to begin</li>
          <li>Click around naturally - each click trains the model</li>
          <li>Watch the "Calibration Points" counter increase</li>
          <li>Gaze predictions improve with more clicks</li>
        </ol>
      </div>

      {/* Click Targets for Practice */}
      {isRunning && (
        <>
          <div style={styles.calibrationPrompt}>
            <h3>🎯 Calibration Active!</h3>
            <p>Click the boxes below to improve accuracy. Points recorded: {calibrationCount}</p>
          </div>

          <div style={styles.targetGrid}>
            {[
              'Top Left', 'Top Center', 'Top Right',
              'Middle Left', 'Center', 'Middle Right',
              'Bottom Left', 'Bottom Center', 'Bottom Right'
            ].map((label, index) => (
              <button
                key={index}
                style={styles.target}
                onClick={() => console.log(`Clicked ${label}`)}
              >
                <h4 style={styles.targetLabel}>{label}</h4>
                <p style={styles.targetHint}>Click me!</p>
              </button>
            ))}
          </div>
        </>
      )}

      <footer style={styles.footer}>
        <p>🔄 Continuous Learning: Every click = Better accuracy</p>
        <p>No "calibration complete" - the model improves forever!</p>
      </footer>
    </div>
  );
}

// Styles
const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    padding: '20px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  header: {
    textAlign: 'center',
    marginBottom: '40px',
  },
  title: {
    fontSize: '2.5rem',
    marginBottom: '10px',
  },
  subtitle: {
    fontSize: '1.2rem',
    opacity: 0.9,
  },
  statusBar: {
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
    borderRadius: '12px',
    padding: '20px',
    marginBottom: '30px',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '20px',
    maxWidth: '1200px',
    margin: '0 auto 30px',
  },
  statusItem: {
    textAlign: 'center',
  },
  statusLabel: {
    fontSize: '0.9rem',
    opacity: 0.8,
    marginBottom: '5px',
  },
  statusValue: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
  },
  controls: {
    display: 'flex',
    gap: '15px',
    justifyContent: 'center',
    marginBottom: '30px',
    flexWrap: 'wrap',
  },
  button: {
    background: 'rgba(255, 255, 255, 0.2)',
    border: '2px solid rgba(255, 255, 255, 0.3)',
    color: 'white',
    padding: '12px 24px',
    borderRadius: '8px',
    fontSize: '1rem',
    cursor: 'pointer',
    transition: 'all 0.3s',
    backdropFilter: 'blur(10px)',
  },
  buttonPrimary: {
    background: '#4ade80',
    borderColor: '#4ade80',
    color: '#1a1a1a',
  },
  buttonDisabled: {
    opacity: 0.5,
    cursor: 'not-allowed',
  },
  infoBox: {
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
    borderRadius: '12px',
    padding: '20px',
    marginBottom: '30px',
    maxWidth: '800px',
    margin: '0 auto 30px',
    lineHeight: '1.6',
  },
  instructions: {
    marginLeft: '20px',
    marginTop: '15px',
  },
  calibrationPrompt: {
    background: 'rgba(74, 222, 128, 0.2)',
    border: '2px solid rgba(74, 222, 128, 0.5)',
    borderRadius: '12px',
    padding: '20px',
    marginBottom: '30px',
    textAlign: 'center',
    maxWidth: '800px',
    margin: '0 auto 30px',
  },
  targetGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '20px',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  target: {
    background: 'rgba(255, 255, 255, 0.1)',
    border: '2px solid rgba(255, 255, 255, 0.3)',
    borderRadius: '12px',
    padding: '40px 20px',
    cursor: 'pointer',
    transition: 'all 0.3s',
    backdropFilter: 'blur(10px)',
    color: 'white',
  },
  targetLabel: {
    margin: '0 0 10px 0',
  },
  targetHint: {
    margin: 0,
    opacity: 0.8,
  },
  footer: {
    textAlign: 'center',
    marginTop: '40px',
    opacity: 0.7,
    fontSize: '0.9rem',
  },
};

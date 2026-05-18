import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { WebgazerProvider } from '../../components/WebgazerProvider';
import { useWebgazerContext } from '../../context/WebgazerContext';

// Mock useWebgazer hook
vi.mock('../../hooks/useWebgazer', () => ({
  useWebgazer: vi.fn(() => ({
    gazeData: { x: 50, y: 50 },
    isRunning: true,
    calibrationCount: 0,
    start: vi.fn(),
    stop: vi.fn(),
    pause: vi.fn(),
    resume: vi.fn(),
  }))
}));

const TestComponent = () => {
  const context = useWebgazerContext();
  return (
    <div>
      <span data-testid="is-running">{context.isRunning ? 'Yes' : 'No'}</span>
      <span data-testid="gaze-x">{context.gazeData?.x}</span>
      <span data-testid="is-initialized">{context.isInitialized ? 'Yes' : 'No'}</span>
    </div>
  );
};

const ThrowingComponent = () => {
  useWebgazerContext();
  return <div>Should not render</div>;
};

describe('WebgazerProvider & Context', () => {
  it('provides context to children', () => {
    render(
      <WebgazerProvider>
        <TestComponent />
      </WebgazerProvider>
    );

    expect(screen.getByTestId('is-running').textContent).toBe('Yes');
    expect(screen.getByTestId('gaze-x').textContent).toBe('50');
    expect(screen.getByTestId('is-initialized').textContent).toBe('Yes');
  });

  it('throws error if context is used outside provider', () => {
    // Suppress React error boundary logs for this test
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    expect(() => render(<ThrowingComponent />)).toThrow(
      'useWebgazerContext must be used within WebgazerProvider'
    );
    
    consoleSpy.mockRestore();
  });
});

import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import LogViewer from '../components/LogViewer';
import { mockAnalysis } from './fixtures';

describe('LogViewer', () => {
  it('defaults to developer view', () => {
    render(<LogViewer analysis={mockAnalysis} />);
    expect(screen.getByText('Technical Analysis')).toBeInTheDocument();
  });

  it('toggles to CEO view on click', () => {
    render(<LogViewer analysis={mockAnalysis} />);
    fireEvent.click(screen.getByRole('button', { name: /ceo view/i }));
    expect(screen.getByText('Business Impact')).toBeInTheDocument();
  });

  it('toggles back to developer view', () => {
    render(<LogViewer analysis={mockAnalysis} />);
    fireEvent.click(screen.getByRole('button', { name: /ceo view/i }));
    fireEvent.click(screen.getByRole('button', { name: /developer view/i }));
    expect(screen.getByText('Technical Analysis')).toBeInTheDocument();
  });

  it('has transition duration class on toggle buttons', () => {
    render(<LogViewer analysis={mockAnalysis} />);
    const devButton = screen.getByRole('button', { name: /developer view/i });
    expect(devButton.className).toContain('duration-300');
  });

  it('displays response time when provided', () => {
    render(<LogViewer analysis={mockAnalysis} responseTimeMs={3200} />);
    expect(screen.getByText('3.2s')).toBeInTheDocument();
  });

  it('displays cost estimation', () => {
    render(<LogViewer analysis={mockAnalysis} />);
    expect(screen.getByText(/Cost:/)).toBeInTheDocument();
  });
});

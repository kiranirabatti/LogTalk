import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import LogInput from '../components/LogInput';

describe('LogInput', () => {
  it('renders textarea and analyze button', () => {
    render(<LogInput onAnalyze={vi.fn()} isLoading={false} />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /analyze logs/i })).toBeInTheDocument();
  });

  it('disables button when loading', () => {
    render(<LogInput onAnalyze={vi.fn()} isLoading={true} />);
    const button = screen.getByRole('button', { name: /analyzing/i });
    expect(button).toBeDisabled();
  });

  it('disables button when textarea is empty', () => {
    render(<LogInput onAnalyze={vi.fn()} isLoading={false} />);
    const button = screen.getByRole('button', { name: /analyze logs/i });
    expect(button).toBeDisabled();
  });

  it('calls onAnalyze with trimmed text on click', () => {
    const onAnalyze = vi.fn();
    render(<LogInput onAnalyze={onAnalyze} isLoading={false} />);
    const textarea = screen.getByRole('textbox');
    fireEvent.change(textarea, { target: { value: '  ERROR: something broke  ' } });
    fireEvent.click(screen.getByRole('button', { name: /analyze logs/i }));
    expect(onAnalyze).toHaveBeenCalledWith('ERROR: something broke');
  });
});

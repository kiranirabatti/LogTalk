import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import LogInput from '../components/LogInput';

const defaultProps = {
  onAnalyze: vi.fn(),
  onUpload: vi.fn(),
  onTriggerLive: vi.fn(),
  isLoading: false,
};

describe('LogInput', () => {
  it('renders tab bar with Paste, Upload, Live', () => {
    render(<LogInput {...defaultProps} />);
    expect(screen.getByRole('button', { name: 'Paste' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Upload' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Live' })).toBeInTheDocument();
  });

  it('defaults to paste tab with textarea', () => {
    render(<LogInput {...defaultProps} />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('disables analyze button when textarea is empty', () => {
    render(<LogInput {...defaultProps} />);
    const button = screen.getByRole('button', { name: /analyze logs/i });
    expect(button).toBeDisabled();
  });

  it('calls onAnalyze with trimmed text on click', () => {
    const onAnalyze = vi.fn();
    render(<LogInput {...defaultProps} onAnalyze={onAnalyze} />);
    fireEvent.change(screen.getByRole('textbox'), { target: { value: '  ERROR: test  ' } });
    fireEvent.click(screen.getByRole('button', { name: /analyze logs/i }));
    expect(onAnalyze).toHaveBeenCalledWith('ERROR: test');
  });

  it('shows upload zone when upload tab clicked', () => {
    render(<LogInput {...defaultProps} />);
    fireEvent.click(screen.getByRole('button', { name: 'Upload' }));
    expect(screen.getByText(/click to upload/i)).toBeInTheDocument();
  });

  it('shows live trigger when live tab clicked', () => {
    render(<LogInput {...defaultProps} />);
    fireEvent.click(screen.getByRole('button', { name: 'Live' }));
    expect(screen.getByRole('button', { name: /trigger live error/i })).toBeInTheDocument();
  });

  it('shows demo sample buttons', () => {
    render(<LogInput {...defaultProps} />);
    expect(screen.getByRole('button', { name: 'Payment Gateway Failure' })).toBeInTheDocument();
  });

  it('loads demo sample into textarea on click', () => {
    render(<LogInput {...defaultProps} />);
    fireEvent.click(screen.getByRole('button', { name: 'Payment Gateway Failure' }));
    const textarea = screen.getByRole('textbox') as HTMLTextAreaElement;
    expect(textarea.value).toContain('PaymentService');
  });

  it('disables analyze button when loading', () => {
    render(<LogInput {...defaultProps} isLoading={true} />);
    const button = screen.getByRole('button', { name: /analyzing/i });
    expect(button).toBeDisabled();
  });
});

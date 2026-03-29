import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from '../App';

describe('App', () => {
  it('renders the LogTalk header', () => {
    render(<App />);
    expect(screen.getByText('Talk')).toBeInTheDocument();
  });

  it('renders the tab bar', () => {
    render(<App />);
    expect(screen.getByText('Paste')).toBeInTheDocument();
    expect(screen.getByText('Upload')).toBeInTheDocument();
    expect(screen.getByText('Live')).toBeInTheDocument();
  });

  it('renders the log input textarea', () => {
    render(<App />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('shows hero text when no results', () => {
    render(<App />);
    expect(screen.getByText(/translate logs into business impact/i)).toBeInTheDocument();
  });

  it('renders dark mode toggle', () => {
    render(<App />);
    expect(screen.getByTitle(/switch to dark mode/i)).toBeInTheDocument();
  });
});

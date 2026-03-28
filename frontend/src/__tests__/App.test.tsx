import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from '../App';

describe('App', () => {
  it('renders the LogTalk header', () => {
    render(<App />);
    expect(screen.getByText('Talk')).toBeInTheDocument();
  });

  it('renders the log input area', () => {
    render(<App />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /analyze logs/i })).toBeInTheDocument();
  });
});

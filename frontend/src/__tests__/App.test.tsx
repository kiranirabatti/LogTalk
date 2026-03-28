import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from '../App';

describe('App', () => {
  it('renders the LogTalk header', () => {
    render(<App />);
    expect(screen.getByText('Talk')).toBeInTheDocument();
  });

  it('shows placeholder message', () => {
    render(<App />);
    expect(screen.getByText(/paste your logs/i)).toBeInTheDocument();
  });
});

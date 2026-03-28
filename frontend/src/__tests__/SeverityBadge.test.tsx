import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import SeverityBadge from '../components/SeverityBadge';

describe('SeverityBadge', () => {
  it('renders the severity text', () => {
    render(<SeverityBadge severity="critical" />);
    expect(screen.getByText('critical')).toBeInTheDocument();
  });

  it('applies red styling for critical severity', () => {
    render(<SeverityBadge severity="critical" />);
    const badge = screen.getByText('critical');
    expect(badge.className).toContain('text-red-600');
  });

  it('applies orange styling for high severity', () => {
    render(<SeverityBadge severity="high" />);
    const badge = screen.getByText('high');
    expect(badge.className).toContain('text-orange-500');
  });

  it('applies green styling for low severity', () => {
    render(<SeverityBadge severity="low" />);
    const badge = screen.getByText('low');
    expect(badge.className).toContain('text-green-500');
  });
});

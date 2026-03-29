import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import ImpactCard from '../components/ImpactCard';

describe('ImpactCard', () => {
  it('renders value and label', () => {
    render(<ImpactCard icon="👥" value={47} label="Users Affected" />);
    expect(screen.getByText('47')).toBeInTheDocument();
    expect(screen.getByText('Users Affected')).toBeInTheDocument();
  });

  it('renders string values', () => {
    render(<ImpactCard icon="💰" value="₹82K" label="Revenue Impact" />);
    expect(screen.getByText('₹82K')).toBeInTheDocument();
  });

  it('renders the icon', () => {
    render(<ImpactCard icon="👥" value={10} label="Test" />);
    expect(screen.getByText('👥')).toBeInTheDocument();
  });

  it('renders sublabel when provided', () => {
    render(<ImpactCard icon="👥" value={10} label="Test" sublabel="during outage" />);
    expect(screen.getByText('during outage')).toBeInTheDocument();
  });
});

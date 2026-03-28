import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import CeoView from '../components/CeoView';
import { mockAnalysis } from './fixtures';

describe('CeoView', () => {
  it('renders business summary', () => {
    render(<CeoView analysis={mockAnalysis} />);
    expect(screen.getByText(mockAnalysis.business_summary)).toBeInTheDocument();
  });

  it('renders affected users impact card', () => {
    render(<CeoView analysis={mockAnalysis} />);
    expect(screen.getByText('47')).toBeInTheDocument();
    expect(screen.getByText('Users Affected')).toBeInTheDocument();
  });

  it('renders revenue impact card with formatted INR', () => {
    render(<CeoView analysis={mockAnalysis} />);
    expect(screen.getByText('₹82.0K')).toBeInTheDocument();
    expect(screen.getByText('Est. Revenue Impact')).toBeInTheDocument();
  });

  it('renders revenue reasoning', () => {
    render(<CeoView analysis={mockAnalysis} />);
    expect(screen.getByText(mockAnalysis.revenue_reasoning)).toBeInTheDocument();
  });

  it('renders recommended action', () => {
    render(<CeoView analysis={mockAnalysis} />);
    expect(screen.getByText(mockAnalysis.recommended_action)).toBeInTheDocument();
  });
});

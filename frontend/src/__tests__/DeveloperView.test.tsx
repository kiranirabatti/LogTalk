import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import DeveloperView from '../components/DeveloperView';
import { mockAnalysis } from './fixtures';

describe('DeveloperView', () => {
  it('renders all 5 technical fields', () => {
    render(<DeveloperView analysis={mockAnalysis} />);
    expect(screen.getByText(mockAnalysis.technical_summary)).toBeInTheDocument();
    expect(screen.getByText(mockAnalysis.root_cause)).toBeInTheDocument();
    expect(screen.getByText(mockAnalysis.recommended_action)).toBeInTheDocument();
    expect(screen.getByText(mockAnalysis.started_at)).toBeInTheDocument();
    expect(screen.getByText(mockAnalysis.deployment_correlation)).toBeInTheDocument();
  });

  it('displays severity badge', () => {
    render(<DeveloperView analysis={mockAnalysis} />);
    expect(screen.getByText('critical')).toBeInTheDocument();
  });

  it('shows log line count', () => {
    render(<DeveloperView analysis={mockAnalysis} />);
    expect(screen.getByText(/142 lines processed/)).toBeInTheDocument();
  });
});

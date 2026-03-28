/**
 * LogTalk API client — all backend calls live here.
 */

import type { LogAnalysis } from '../types';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const analyzePaste = async (logs: string): Promise<LogAnalysis> => {
  const response = await fetch(`${API_BASE}/api/analyze/paste`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ logs }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(error.detail || error.error || `HTTP ${response.status}`);
  }

  return response.json();
};

export const analyzeUpload = async (file: File): Promise<LogAnalysis> => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_BASE}/api/analyze/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(error.detail || error.error || `HTTP ${response.status}`);
  }

  return response.json();
};

export const triggerDemo = async (): Promise<LogAnalysis> => {
  const response = await fetch(`${API_BASE}/api/demo/trigger`);

  if (!response.ok) {
    throw new Error('Failed to trigger demo');
  }

  const data = await response.json();
  if (data.analysis) {
    return data.analysis;
  }
  throw new Error(data.message || 'Sandbox unavailable');
};

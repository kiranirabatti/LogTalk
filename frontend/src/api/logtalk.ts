/**
 * LogTalk API client — all backend calls live here.
 */

import type { LogAnalysis } from '../types';
import { fallbackAnalysis } from '../data/fallback-response';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';
const DEMO_TIMEOUT_MS = 15_000; // 15s — if API takes longer, use fallback

const fetchWithTimeout = async (
  url: string,
  options: RequestInit,
  timeoutMs: number,
): Promise<Response> => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
};

export const analyzePaste = async (logs: string): Promise<LogAnalysis> => {
  try {
    const response = await fetchWithTimeout(
      `${API_BASE}/api/analyze/paste`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ logs }),
      },
      DEMO_TIMEOUT_MS,
    );

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(error.detail || error.error || `HTTP ${response.status}`);
    }

    return response.json();
  } catch (err) {
    // During demo: if API is down or too slow, return cached fallback
    if (err instanceof DOMException && err.name === 'AbortError') {
      console.warn('API timeout — using cached fallback response');
      return { ...fallbackAnalysis, analyzed_at: new Date().toISOString() };
    }
    throw err;
  }
};

export const analyzeUpload = async (file: File): Promise<LogAnalysis> => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetchWithTimeout(
    `${API_BASE}/api/analyze/upload`,
    { method: 'POST', body: formData },
    DEMO_TIMEOUT_MS,
  );

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(error.detail || error.error || `HTTP ${response.status}`);
  }

  return response.json();
};

export const triggerDemo = async (): Promise<LogAnalysis> => {
  try {
    const response = await fetchWithTimeout(
      `${API_BASE}/api/demo/trigger`,
      {},
      DEMO_TIMEOUT_MS,
    );

    if (!response.ok) {
      throw new Error('Failed to trigger demo');
    }

    const data = await response.json();
    if (data.analysis) {
      return data.analysis;
    }
    throw new Error(data.message || 'Sandbox unavailable');
  } catch (err) {
    if (err instanceof DOMException && err.name === 'AbortError') {
      console.warn('Demo trigger timeout — using cached fallback response');
      return { ...fallbackAnalysis, analyzed_at: new Date().toISOString() };
    }
    throw err;
  }
};

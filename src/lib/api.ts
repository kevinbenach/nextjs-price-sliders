/**
 * API client for Range component data
 * 
 * Centralizes all API calls for easier testing and maintenance.
 * In a real application, you might add error handling, retries, etc.
 */

export interface NormalRangeData {
  min: number;
  max: number;
}

export interface FixedRangeData {
  rangeValues: number[];
}

const API_BASE = '/api';

/**
 * Fetches min/max values for the normal range mode
 */
export async function fetchNormalRangeData(): Promise<NormalRangeData> {
  const response = await fetch(`${API_BASE}/range`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch range data: ${response.statusText}`);
  }
  
  return response.json();
}

/**
 * Fetches fixed values for the fixed range mode
 */
export async function fetchFixedRangeData(): Promise<FixedRangeData> {
  const response = await fetch(`${API_BASE}/fixed-range`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch fixed range data: ${response.statusText}`);
  }
  
  return response.json();
}

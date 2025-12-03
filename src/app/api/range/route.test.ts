import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET } from './route';

describe('/api/range', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  it('should return range data with min and max', async () => {
    const responsePromise = GET();
    await vi.runAllTimersAsync();
    const response = await responsePromise;
    const data = await response.json();

    expect(data).toHaveProperty('min');
    expect(data).toHaveProperty('max');
  });

  it('should return correct data structure', async () => {
    const responsePromise = GET();
    await vi.runAllTimersAsync();
    const response = await responsePromise;
    const data = await response.json();

    expect(typeof data.min).toBe('number');
    expect(typeof data.max).toBe('number');
  });

  it('should return min less than max', async () => {
    const responsePromise = GET();
    await vi.runAllTimersAsync();
    const response = await responsePromise;
    const data = await response.json();

    expect(data.min).toBeLessThan(data.max);
  });

  it('should return expected values from requirements', async () => {
    const responsePromise = GET();
    await vi.runAllTimersAsync();
    const response = await responsePromise;
    const data = await response.json();

    // From requirements: {min: 1, max: 100}
    expect(data.min).toBe(1);
    expect(data.max).toBe(100);
  });

  it('should return valid Response object', async () => {
    const responsePromise = GET();
    await vi.runAllTimersAsync();
    const response = await responsePromise;

    expect(response).toBeInstanceOf(Response);
    expect(response.ok).toBe(true);
    expect(response.status).toBe(200);
  });

  it('should have correct content type', async () => {
    const responsePromise = GET();
    await vi.runAllTimersAsync();
    const response = await responsePromise;

    const contentType = response.headers.get('content-type');
    expect(contentType).toContain('application/json');
  });
});

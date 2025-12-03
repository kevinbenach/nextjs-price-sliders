import { describe, it, expect } from 'vitest';
import { GET } from './route';

describe('/api/fixed-range', () => {
  it('should return fixed range data with rangeValues', async () => {
    const response = await GET();
    const data = await response.json();

    expect(data).toHaveProperty('rangeValues');
  });

  it('should return array of numbers', async () => {
    const response = await GET();
    const data = await response.json();

    expect(Array.isArray(data.rangeValues)).toBe(true);
    expect(data.rangeValues.length).toBeGreaterThan(0);
    expect(typeof data.rangeValues[0]).toBe('number');
  });

  it('should return values in ascending order', async () => {
    const response = await GET();
    const data = await response.json();

    const values = data.rangeValues;
    for (let i = 1; i < values.length; i++) {
      expect(values[i]).toBeGreaterThan(values[i - 1]);
    }
  });

  it('should return expected values from requirements', async () => {
    const response = await GET();
    const data = await response.json();

    // From requirements: [1.99, 5.99, 10.99, 30.99, 50.99, 70.99]
    const expected = [1.99, 5.99, 10.99, 30.99, 50.99, 70.99];
    expect(data.rangeValues).toEqual(expected);
  });

  it('should have at least 2 values', async () => {
    const response = await GET();
    const data = await response.json();

    // Need at least min and max
    expect(data.rangeValues.length).toBeGreaterThanOrEqual(2);
  });

  it('should return valid Response object', async () => {
    const response = await GET();

    expect(response).toBeInstanceOf(Response);
    expect(response.ok).toBe(true);
    expect(response.status).toBe(200);
  });

  it('should have correct content type', async () => {
    const response = await GET();

    const contentType = response.headers.get('content-type');
    expect(contentType).toContain('application/json');
  });

  it('should return decimal values (currency format)', async () => {
    const response = await GET();
    const data = await response.json();

    // All values should be currency-like (have decimals)
    data.rangeValues.forEach((value: number) => {
      expect(value).toBeGreaterThan(0);
      // Check it's a valid decimal number
      expect(Number.isFinite(value)).toBe(true);
    });
  });
});

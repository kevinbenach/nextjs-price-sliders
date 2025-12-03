import { NextResponse } from 'next/server';

// Simulated response data - exact values from requirements
const fixedRangeData = {
  rangeValues: [1.99, 5.99, 10.99, 30.99, 50.99, 70.99],
};

export async function GET() {
  // Simulate network latency (300ms)
  await new Promise((resolve) => setTimeout(resolve, 300));
  
  return NextResponse.json(fixedRangeData);
}

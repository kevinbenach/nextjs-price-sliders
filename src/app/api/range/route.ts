import { NextResponse } from 'next/server';

// Simulated response data
const rangeData = {
  min: 1,
  max: 100,
};

export async function GET() {
  // Simulate network latency (300ms)
  await new Promise((resolve) => setTimeout(resolve, 300));
  
  return NextResponse.json(rangeData);
}

import { NextResponse } from 'next/server';

const rangeData = {
  min: 1,
  max: 100,
};

export async function GET() {
  await new Promise((resolve) => setTimeout(resolve, 300));
  
  return NextResponse.json(rangeData);
}

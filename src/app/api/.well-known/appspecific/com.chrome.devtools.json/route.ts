import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    version: "1.0",
    name: "TrackingDude",
    description: "Sistema de gestión de dominios y hosting"
  }, { status: 200 });
} 
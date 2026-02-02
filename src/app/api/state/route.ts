import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const STATE_FILE = path.join(process.cwd(), 'agent-state.json');

export async function GET() {
  try {
    const data = await fs.readFile(STATE_FILE, 'utf-8');
    return NextResponse.json(JSON.parse(data));
  } catch (error) {
    return NextResponse.json({ elements: [], logs: [], links: [] });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    await fs.writeFile(STATE_FILE, JSON.stringify(body, null, 2));
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}

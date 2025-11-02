import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';
import { jsonError } from '@/lib/responses';

export function verifyToken(req) {
  const authHeader = req.headers.get('authorization');
  if (!authHeader) throw new Error('Missing Authorization header');
  const token = authHeader.split(' ')[1];
  return jwt.verify(token, process.env.JWT_SECRET);
}

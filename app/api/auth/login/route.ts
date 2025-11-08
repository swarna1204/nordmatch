import { NextRequest, NextResponse } from 'next/server';
import { verifyPassword, generateToken } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    console.log('Login request received');
    
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      console.log('Missing email or password');
      return NextResponse.json(
        { error: 'Email and password required' },
        { status: 400 }
      );
    }

    console.log('Finding user:', email);
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      console.log('User not found');
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    console.log('Verifying password');
    const isPasswordValid = await verifyPassword(password, user.password);

    if (!isPasswordValid) {
      console.log('Password invalid');
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    console.log('Generating token');
    const token = generateToken(user.id);

    const response = NextResponse.json(
      {
        success: true,
        message: 'Logged in successfully',
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
        },
      },
      { status: 200 }
    );

    response.cookies.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
    });

    console.log('Login successful');
    return response;
  } catch (error) {
    console.error('Login error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: `Internal server error: ${errorMessage}` },
      { status: 500 }
    );
  }
}
// app/api/candidates/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

// GET all candidates
export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('auth_token')?.value;
    if (!token || !verifyToken(token)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { userId } = verifyToken(token)!;

    // Get user's company
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { ownedCompany: true },
    });

    if (!user?.ownedCompany) {
      return NextResponse.json({ error: 'No company found' }, { status: 404 });
    }

    // Get all candidates for this company
    const candidates = await prisma.candidate.findMany({
      where: { companyId: user.ownedCompany.id },
      include: {
        job: true,
        _count: {
          select: {
            applications: true,
            interviews: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ candidates });
  } catch (error) {
    console.error('Error fetching candidates:', error);
    return NextResponse.json(
      { error: 'Failed to fetch candidates' },
      { status: 500 }
    );
  }
}

// POST create new candidate
export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get('auth_token')?.value;
    if (!token || !verifyToken(token)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { userId } = verifyToken(token)!;
    const body = await req.json();

    const {
      firstName,
      lastName,
      email,
      phone,
      location,
      jobId,
      skills,
      experience,
      education,
      linkedinUrl,
      portfolioUrl,
      resumeUrl,
      summary,
      stage = 'new',
      rating,
      notes,
    } = body;

    // Validation
    if (!firstName || !lastName || !email) {
      return NextResponse.json(
        { error: 'First name, last name, and email are required' },
        { status: 400 }
      );
    }

    // Get user's company
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { ownedCompany: true },
    });

    if (!user?.ownedCompany) {
      return NextResponse.json({ error: 'No company found' }, { status: 404 });
    }

    // Check if email already exists
    const existingCandidate = await prisma.candidate.findUnique({
      where: { email },
    });

    if (existingCandidate) {
      return NextResponse.json(
        { error: 'Candidate with this email already exists' },
        { status: 409 }
      );
    }

    // Create candidate
    const candidate = await prisma.candidate.create({
      data: {
        firstName,
        lastName,
        email,
        phone: phone || null,
        location: location || null,
        companyId: user.ownedCompany.id,
        jobId: jobId || null,
        skills: skills || [],
        skillTags: skills || [],
        experience: experience ? parseInt(experience) : null,
        education: education || null,
        linkedinUrl: linkedinUrl || null,
        portfolioUrl: portfolioUrl || null,
        resumeUrl: resumeUrl || null,
        summary: summary || null,
        stage,
        rating: rating ? parseInt(rating) : null,
        notes: notes || null,
      },
      include: {
        job: true,
      },
    });

    return NextResponse.json({ candidate }, { status: 201 });
  } catch (error) {
    console.error('Error creating candidate:', error);
    return NextResponse.json(
      { error: 'Failed to create candidate' },
      { status: 500 }
    );
  }
}
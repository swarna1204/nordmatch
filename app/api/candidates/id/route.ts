// app/api/candidates/id/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

// GET single candidate
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = req.cookies.get('auth_token')?.value;
    if (!token || !verifyToken(token)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const candidate = await prisma.candidate.findUnique({
      where: { id: params.id },
      include: {
        company: true,
        job: true,
        applications: true,
        interviews: {
          orderBy: { scheduledAt: 'desc' },
        },
        feedback: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!candidate) {
      return NextResponse.json(
        { error: 'Candidate not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ candidate });
  } catch (error) {
    console.error('Error fetching candidate:', error);
    return NextResponse.json(
      { error: 'Failed to fetch candidate' },
      { status: 500 }
    );
  }
}

// PUT update candidate
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = req.cookies.get('auth_token')?.value;
    if (!token || !verifyToken(token)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

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
      stage,
      rating,
      notes,
    } = body;

    // Check if candidate exists
    const existingCandidate = await prisma.candidate.findUnique({
      where: { id: params.id },
    });

    if (!existingCandidate) {
      return NextResponse.json(
        { error: 'Candidate not found' },
        { status: 404 }
      );
    }

    // Update candidate
    const candidate = await prisma.candidate.update({
      where: { id: params.id },
      data: {
        firstName,
        lastName,
        email,
        phone: phone || null,
        location: location || null,
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

    return NextResponse.json({ candidate });
  } catch (error) {
    console.error('Error updating candidate:', error);
    return NextResponse.json(
      { error: 'Failed to update candidate' },
      { status: 500 }
    );
  }
}

// DELETE candidate
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = req.cookies.get('auth_token')?.value;
    if (!token || !verifyToken(token)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if candidate exists
    const candidate = await prisma.candidate.findUnique({
      where: { id: params.id },
    });

    if (!candidate) {
      return NextResponse.json(
        { error: 'Candidate not found' },
        { status: 404 }
      );
    }

    // Delete candidate (cascade will delete related data)
    await prisma.candidate.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: 'Candidate deleted successfully' });
  } catch (error) {
    console.error('Error deleting candidate:', error);
    return NextResponse.json(
      { error: 'Failed to delete candidate' },
      { status: 500 }
    );
  }
}
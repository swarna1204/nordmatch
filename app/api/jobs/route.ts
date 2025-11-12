// app/api/jobs/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

// GET all jobs
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

    // Get all jobs for this company
    const jobs = await prisma.job.findMany({
      where: { companyId: user.ownedCompany.id },
      include: {
        postedBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        _count: {
          select: {
            applications: true,
            candidates: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ jobs });
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch jobs' },
      { status: 500 }
    );
  }
}

// POST create new job
export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get('auth_token')?.value;
    if (!token || !verifyToken(token)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { userId } = verifyToken(token)!;
    const body = await req.json();

    const {
      title,
      department,
      location,
      description,
      requirements,
      employmentType,
      salaryMin,
      salaryMax,
      status = 'ACTIVE',
    } = body;

    // Validation
    if (!title || !department || !location || !description || !requirements) {
      return NextResponse.json(
        { error: 'Missing required fields' },
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

    // Determine jobType based on employmentType
    let jobType: 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'REMOTE' = 'FULL_TIME';
    if (employmentType === 'Part-time') jobType = 'PART_TIME';
    else if (employmentType === 'Contract') jobType = 'CONTRACT';
    else if (location.toLowerCase().includes('remote')) jobType = 'REMOTE';

    // Create job
    const job = await prisma.job.create({
      data: {
        title,
        department,
        location,
        description,
        requirements,
        employmentType: employmentType || 'Full-time',
        jobType,
        salaryMin: salaryMin ? parseInt(salaryMin) : null,
        salaryMax: salaryMax ? parseInt(salaryMax) : null,
        status: status as 'ACTIVE' | 'CLOSED' | 'DRAFT',
        companyId: user.ownedCompany.id,
        postedById: userId,
      },
      include: {
        postedBy: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json({ job }, { status: 201 });
  } catch (error) {
    console.error('Error creating job:', error);
    return NextResponse.json(
      { error: 'Failed to create job' },
      { status: 500 }
    );
  }
}
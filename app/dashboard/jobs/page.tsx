// app/dashboard/jobs/page.tsx
'use client';

import { useState, useEffect } from 'react';
import {
  Plus,
  Search,
  Filter,
  Briefcase,
  MapPin,
  Calendar,
  Users,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
} from 'lucide-react';
import CreateJobModal from '@/components/modals/CreateJobModal';

interface Job {
  id: string;
  title: string;
  department: string;
  location: string;
  employmentType: string;
  status: string;
  description: string;
  requirements: string;
  salaryMin: number | null;
  salaryMax: number | null;
  postedAt: string;
  _count: {
    candidates: number;
    applications: number;
  };
  postedBy: {
    firstName: string;
    lastName: string;
  };
}

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  // Fetch jobs
  const fetchJobs = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/jobs');
      const data = await res.json();
      if (res.ok) {
        setJobs(data.jobs || []);
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  // Create job
  const handleCreateJob = async (jobData: any) => {
    try {
      const res = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(jobData),
      });

      if (res.ok) {
        await fetchJobs();
        setShowCreateModal(false);
      }
    } catch (error) {
      console.error('Error creating job:', error);
    }
  };

  // Update job
  const handleUpdateJob = async (jobData: any) => {
    if (!selectedJob) return;

    try {
      const res = await fetch(`/api/jobs/${selectedJob.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(jobData),
      });

      if (res.ok) {
        await fetchJobs();
        setShowEditModal(false);
        setSelectedJob(null);
      }
    } catch (error) {
      console.error('Error updating job:', error);
    }
  };

  // Delete job
  const handleDeleteJob = async (jobId: string) => {
    try {
      const res = await fetch(`/api/jobs/${jobId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        await fetchJobs();
        setShowDeleteConfirm(null);
      }
    } catch (error) {
      console.error('Error deleting job:', error);
    }
  };

  // Filter jobs
  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.location.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === 'all' || job.status.toLowerCase() === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Jobs</h1>
          <p className="text-gray-600 mt-1">Manage your open positions</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-6 py-3 bg-primary-500 text-white rounded-xl hover:bg-primary-600 font-medium transition-all flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Create New Job
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="text-sm text-gray-600 mb-1">Total Jobs</div>
          <div className="text-3xl font-bold text-gray-900">{jobs.length}</div>
        </div>
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="text-sm text-gray-600 mb-1">Active</div>
          <div className="text-3xl font-bold text-green-600">
            {jobs.filter((j) => j.status === 'ACTIVE').length}
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="text-sm text-gray-600 mb-1">Draft</div>
          <div className="text-3xl font-bold text-orange-600">
            {jobs.filter((j) => j.status === 'DRAFT').length}
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="text-sm text-gray-600 mb-1">Closed</div>
          <div className="text-3xl font-bold text-gray-600">
            {jobs.filter((j) => j.status === 'CLOSED').length}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 border border-gray-200 mb-6">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search jobs by title, department, or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="draft">Draft</option>
            <option value="closed">Closed</option>
          </select>
        </div>
      </div>

      {/* Jobs List */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading jobs...</p>
        </div>
      ) : filteredJobs.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
          <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No jobs found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredJobs.map((job) => (
            <div
              key={job.id}
              className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold text-gray-900">
                      {job.title}
                    </h3>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        job.status === 'ACTIVE'
                          ? 'bg-green-100 text-green-700'
                          : job.status === 'DRAFT'
                          ? 'bg-orange-100 text-orange-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {job.status}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                    <div className="flex items-center gap-1">
                      <Briefcase className="w-4 h-4" />
                      {job.department}
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {job.location}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(job.postedAt).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {job._count.candidates} candidates
                    </div>
                  </div>

                  <p className="text-gray-700 line-clamp-2 mb-4">
                    {job.description}
                  </p>

                  {job.salaryMin && job.salaryMax && (
                    <div className="text-sm text-gray-600">
                      <strong>Salary:</strong> ${job.salaryMin.toLocaleString()} -{' '}
                      ${job.salaryMax.toLocaleString()}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="relative ml-4">
                  <button
                    onClick={() =>
                      setShowDeleteConfirm(
                        showDeleteConfirm === job.id ? null : job.id
                      )
                    }
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <MoreVertical className="w-5 h-5 text-gray-600" />
                  </button>

                  {showDeleteConfirm === job.id && (
                    <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-10">
                      <button
                        onClick={() => {
                          setSelectedJob(job);
                          setShowEditModal(true);
                          setShowDeleteConfirm(null);
                        }}
                        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                      >
                        <Edit className="w-4 h-4" />
                        Edit Job
                      </button>
                      <button
                        onClick={() => handleDeleteJob(job.id)}
                        className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete Job
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Modal */}
      <CreateJobModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateJob}
      />

      {/* Edit Modal */}
      {selectedJob && (
        <CreateJobModal
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false);
            setSelectedJob(null);
          }}
          onSubmit={handleUpdateJob}
          initialData={selectedJob}
        />
      )}
    </div>
  );
}
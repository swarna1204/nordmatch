'use client';

import { useState } from 'react';
import {
  Clock,
  Users,
  FileText,
  Calendar,
  ArrowUpRight,
  Plus,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import CreateJobModal from '@/components/modals/CreateJobModal';

export default function DashboardPage() {
  const [showCreateJob, setShowCreateJob] = useState(false);
  const [dashboardData] = useState({
    timeToFill: 35,
    candidatesInPipeline: 450,
    openRequisitions: 18,
    funnel: {
      new: 124,
      inReview: 87,
      interviewed: 45,
      hired: 12,
    },
    upcomingInterviews: [
      {
        id: 1,
        time: '09:00 - 09:30',
        candidate: 'Ruben Philips',
        role: 'Technical Screen',
        duration: '30 min call with Technical Screen',
        date: 'December 30, 2025',
        avatars: ['👨🏽', '👩🏻'],
      },
      {
        id: 2,
        time: '14:00 - 14:45',
        candidate: 'Emma Larsson',
        role: 'Portfolio Review',
        duration: '45 min call with Portfolio Review',
        date: 'December 30, 2025',
        avatars: ['👨🏽', '👩🏼'],
      },
    ],
    tomorrowInterviews: [
      {
        id: 3,
        time: '10:00 - 11:00',
        candidate: 'Henrik Olsen',
        role: 'Final Interview',
        duration: '60 min meeting Final Interview',
        date: 'December 29, 2025',
        avatars: ['👨🏼', '👩🏽'],
      },
    ],
    averageTimeInStage: [
      { name: 'Screening', days: 5 },
      { name: 'Interview', days: 12 },
      { name: 'Hiring Manager Review', days: 8 },
    ],
    sourceOfHire: [
      { name: 'LinkedIn', value: 35, color: '#2D5F8D' },
      { name: 'Employee Referral', value: 28, color: '#5B8FBF' },
      { name: 'Career Site', value: 20, color: '#F59E0B' },
      { name: 'Agency', value: 12, color: '#10B981' },
      { name: 'Others', value: 5, color: '#E5E7EB' },
    ],
  });

  const StatCard = ({ icon: Icon, title, value, subtitle, trend }: any) => (
    <div className="bg-white rounded-xl p-6 border border-gray-200">
      <div className="flex items-start justify-between mb-3">
        <div className="w-12 h-12 bg-primary-50 rounded-lg flex items-center justify-center">
          <Icon className="w-6 h-6 text-primary-500" />
        </div>
        {trend && (
          <div className="flex items-center gap-1 text-green-600 text-sm">
            <ArrowUpRight className="w-4 h-4" />
            <span>{trend}</span>
          </div>
        )}
      </div>
      <div className="text-3xl font-bold text-gray-900 mb-1">{value}</div>
      <div className="text-sm text-gray-600">{title}</div>
      {subtitle && <div className="text-xs text-gray-500 mt-1">{subtitle}</div>}
    </div>
  );

  const FunnelBar = ({ label, count, total, color }: any) => {
    const percentage = (count / total) * 100;
    return (
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">{label}</span>
          <span className="text-sm font-bold text-gray-900">{count}</span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-2">
          <div
            className="h-2 rounded-full transition-all duration-500"
            style={{
              width: `${percentage}%`,
              backgroundColor: color,
            }}
          />
        </div>
      </div>
    );
  };

  return (
    <div>
      {/* Welcome Header with Create Button */}
      <div className="flex items-center gap-4 mb-6">
        <div className="bg-primary-500 rounded-2xl p-8 flex-1">
          <h1 className="text-3xl font-bold text-white mb-2">
            Welcome back, Sarah 👋
          </h1>
          <p className="text-primary-100">
            Here's what's happening with your recruitment pipeline today!
          </p>
        </div>
        <button
          onClick={() => setShowCreateJob(true)}
          className="px-6 py-3 bg-white text-primary-500 rounded-xl hover:shadow-lg font-medium transition-all flex items-center gap-2 border border-gray-200"
        >
          <Plus className="w-5 h-5" />
          Create New Job
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <StatCard
          icon={Clock}
          title="Time to Fill"
          value={`${dashboardData.timeToFill} days`}
          subtitle="Average hiring time"
        />
        <StatCard
          icon={Users}
          title="Candidates in Pipeline"
          value={dashboardData.candidatesInPipeline}
          subtitle="Active candidates"
          trend="+12%"
        />
        <StatCard
          icon={FileText}
          title="Open Requisitions"
          value={`${dashboardData.openRequisitions} Reqs`}
          subtitle="Active job postings"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recruitment Funnel */}
        <div className="lg:col-span-2 bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                Recruitment Funnel
              </h2>
              <p className="text-sm text-gray-600">
                Candidate flow through hiring stages - weekly overview
              </p>
            </div>
          </div>

          <FunnelBar
            label="New"
            count={dashboardData.funnel.new}
            total={dashboardData.funnel.new}
            color="#2D5F8D"
          />
          <FunnelBar
            label="In Review"
            count={dashboardData.funnel.inReview}
            total={dashboardData.funnel.new}
            color="#2D5F8D"
          />
          <FunnelBar
            label="Interviewed"
            count={dashboardData.funnel.interviewed}
            total={dashboardData.funnel.new}
            color="#F59E0B"
          />
          <FunnelBar
            label="Hired"
            count={dashboardData.funnel.hired}
            total={dashboardData.funnel.new}
            color="#10B981"
          />

          <div className="grid grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-200">
            <div className="text-center">
              <div className="text-xs text-gray-500 mb-1">Total in Pipeline</div>
              <div className="text-xl font-bold text-gray-900">
                {Object.values(dashboardData.funnel).reduce((a, b) => a + b, 0)}
              </div>
            </div>
            <div className="text-center">
              <div className="text-xs text-gray-500 mb-1">New This Week</div>
              <div className="text-xl font-bold text-primary-500">32</div>
            </div>
            <div className="text-center">
              <div className="text-xs text-gray-500 mb-1">In Interview</div>
              <div className="text-xl font-bold text-orange-500">45</div>
            </div>
            <div className="text-center">
              <div className="text-xs text-gray-500 mb-1">Hired</div>
              <div className="text-xl font-bold text-green-500">12</div>
            </div>
          </div>
        </div>

        {/* Schedule */}
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-900">Schedule</h2>
            <Calendar className="w-5 h-5 text-gray-400" />
          </div>

          <div className="flex gap-2 mb-6">
            <button className="flex-1 px-3 py-2 text-sm font-medium text-primary-500 bg-primary-50 rounded-lg">
              Today
            </button>
            <button className="flex-1 px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg">
              This Week
            </button>
            <button className="flex-1 px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg">
              Next Week
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-3">Upcoming</h3>
              {dashboardData.upcomingInterviews.map((interview) => (
                <div
                  key={interview.id}
                  className="p-4 bg-gray-50 rounded-lg mb-3"
                >
                  <div className="flex items-start gap-2 mb-2">
                    <Clock className="w-4 h-4 text-gray-400 mt-0.5" />
                    <span className="text-sm font-medium text-gray-900">
                      {interview.time}
                    </span>
                  </div>
                  <div className="ml-6">
                    <div className="font-medium text-gray-900 mb-1">
                      Interview with {interview.candidate}
                    </div>
                    <div className="text-sm text-gray-600 mb-2">
                      {interview.duration}
                    </div>
                    <div className="text-xs text-gray-500 mb-2">
                      {interview.date}
                    </div>
                    <div className="flex gap-1">
                      {interview.avatars.map((avatar, idx) => (
                        <div
                          key={idx}
                          className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs"
                        >
                          {avatar}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-3">Tomorrow</h3>
              {dashboardData.tomorrowInterviews.map((interview) => (
                <div
                  key={interview.id}
                  className="p-4 bg-gray-50 rounded-lg mb-3"
                >
                  <div className="flex items-start gap-2 mb-2">
                    <Clock className="w-4 h-4 text-gray-400 mt-0.5" />
                    <span className="text-sm font-medium text-gray-900">
                      {interview.time}
                    </span>
                  </div>
                  <div className="ml-6">
                    <div className="font-medium text-gray-900 mb-1">
                      Interview with {interview.candidate}
                    </div>
                    <div className="text-sm text-gray-600 mb-2">
                      {interview.duration}
                    </div>
                    <div className="text-xs text-gray-500 mb-2">
                      {interview.date}
                    </div>
                    <div className="flex gap-1">
                      {interview.avatars.map((avatar, idx) => (
                        <div
                          key={idx}
                          className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs"
                        >
                          {avatar}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* Average Time in Stage */}
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h2 className="text-lg font-bold text-gray-900 mb-2">
            Average Time in Stage
          </h2>
          <p className="text-sm text-gray-600 mb-6">
            Days candidates spend at each stage
          </p>

          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={dashboardData.averageTimeInStage}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis
                dataKey="name"
                tick={{ fill: '#6B7280', fontSize: 12 }}
                axisLine={{ stroke: '#E5E7EB' }}
              />
              <YAxis
                label={{
                  value: 'Days',
                  angle: -90,
                  position: 'insideLeft',
                  style: { fill: '#6B7280', fontSize: 12 },
                }}
                tick={{ fill: '#6B7280', fontSize: 12 }}
                axisLine={{ stroke: '#E5E7EB' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px',
                }}
              />
              <Bar dataKey="days" fill="#2D5F8D" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Source of Hire */}
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h2 className="text-lg font-bold text-gray-900 mb-2">
            Source of Hire
          </h2>
          <p className="text-sm text-gray-600 mb-6">Top hiring sources</p>

          <div className="flex items-center gap-8">
            <div className="shrink-0">
              <ResponsiveContainer width={180} height={180}>
                <PieChart>
                  <Pie
                    data={dashboardData.sourceOfHire}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {dashboardData.sourceOfHire.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="flex-1 space-y-3">
              {dashboardData.sourceOfHire.map((source, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: source.color }}
                    />
                    <span className="text-sm text-gray-700">{source.name}</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    {source.value}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Create Job Modal */}
      <CreateJobModal
        isOpen={showCreateJob}
        onClose={() => setShowCreateJob(false)}
        onSubmit={(data) => {
          console.log('Job created:', data);
          // TODO: Add API call to create job
        }}
      />
    </div>
  );
}
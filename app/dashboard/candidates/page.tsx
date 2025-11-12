'use client';

import { useState, useEffect } from 'react';
import { Plus, Search, Mail, Phone, MapPin, Briefcase, Star, MoreVertical, Edit, Trash2, Linkedin, ExternalLink } from 'lucide-react';
import CreateCandidateModal from '@/components/modals/CreateCandidateModal';

interface Candidate {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  location: string | null;
  skills: string[];
  experience: number | null;
  education: string | null;
  stage: string;
  rating: number | null;
  linkedinUrl: string | null;
  portfolioUrl: string | null;
  resumeUrl: string | null;
  summary: string | null;
  job?: { id: string; title: string; department: string; } | null;
  _count?: { applications: number; interviews: number; };
}

export default function CandidatesPage() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [stageFilter, setStageFilter] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  const fetchCandidates = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/candidates');
      const data = await res.json();
      if (res.ok) setCandidates(data.candidates || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCandidates(); }, []);

  const handleCreateCandidate = async (candidateData: any) => {
    try {
      const res = await fetch('/api/candidates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(candidateData),
      });
      if (res.ok) {
        await fetchCandidates();
        setShowCreateModal(false);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleUpdateCandidate = async (candidateData: any) => {
    if (!selectedCandidate) return;
    try {
      const res = await fetch(`/api/candidates/${selectedCandidate.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(candidateData),
      });
      if (res.ok) {
        await fetchCandidates();
        setShowEditModal(false);
        setSelectedCandidate(null);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleDeleteCandidate = async (candidateId: string) => {
    try {
      const res = await fetch(`/api/candidates/${candidateId}`, { method: 'DELETE' });
      if (res.ok) {
        await fetchCandidates();
        setShowDeleteConfirm(null);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const filteredCandidates = candidates.filter((c) => {
    const matchesSearch = c.firstName.toLowerCase().includes(searchQuery.toLowerCase()) || c.lastName.toLowerCase().includes(searchQuery.toLowerCase()) || c.email.toLowerCase().includes(searchQuery.toLowerCase()) || (c.skills && c.skills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase())));
    const matchesStage = stageFilter === 'all' || c.stage.toLowerCase() === stageFilter;
    return matchesSearch && matchesStage;
  });

  const getStageBadge = (stage: string) => {
    const colors: Record<string, string> = { new: 'bg-blue-100 text-blue-700', screening: 'bg-yellow-100 text-yellow-700', interview: 'bg-purple-100 text-purple-700', offer: 'bg-orange-100 text-orange-700', hired: 'bg-green-100 text-green-700', rejected: 'bg-red-100 text-red-700' };
    return colors[stage.toLowerCase()] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Candidates</h1>
          <p className="text-gray-600 mt-1">Manage your candidate pipeline</p>
        </div>
        <button onClick={() => setShowCreateModal(true)} className="px-6 py-3 bg-primary-500 text-white rounded-xl hover:bg-primary-600 font-medium transition-all flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Add Candidate
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-6">
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="text-sm text-gray-600 mb-1">Total</div>
          <div className="text-3xl font-bold text-gray-900">{candidates.length}</div>
        </div>
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="text-sm text-gray-600 mb-1">New</div>
          <div className="text-3xl font-bold text-blue-600">{candidates.filter((c) => c.stage === 'new').length}</div>
        </div>
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="text-sm text-gray-600 mb-1">Screening</div>
          <div className="text-3xl font-bold text-yellow-600">{candidates.filter((c) => c.stage === 'screening').length}</div>
        </div>
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="text-sm text-gray-600 mb-1">Interview</div>
          <div className="text-3xl font-bold text-purple-600">{candidates.filter((c) => c.stage === 'interview').length}</div>
        </div>
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="text-sm text-gray-600 mb-1">Hired</div>
          <div className="text-3xl font-bold text-green-600">{candidates.filter((c) => c.stage === 'hired').length}</div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-4 border border-gray-200 mb-6">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input type="text" placeholder="Search by name, email, or skills..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" />
          </div>
          <select value={stageFilter} onChange={(e) => setStageFilter(e.target.value)} className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500">
            <option value="all">All Stages</option>
            <option value="new">New</option>
            <option value="screening">Screening</option>
            <option value="interview">Interview</option>
            <option value="offer">Offer</option>
            <option value="hired">Hired</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading candidates...</p>
        </div>
      ) : filteredCandidates.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
          <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No candidates found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCandidates.map((candidate) => (
            <div key={candidate.id} className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow relative">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {candidate.firstName[0]}{candidate.lastName[0]}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">{candidate.firstName} {candidate.lastName}</h3>
                    {candidate.rating && (
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`w-3 h-3 ${i < candidate.rating! ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div className="relative">
                  <button onClick={() => setShowDeleteConfirm(showDeleteConfirm === candidate.id ? null : candidate.id)} className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
                    <MoreVertical className="w-4 h-4 text-gray-600" />
                  </button>
                  {showDeleteConfirm === candidate.id && (
                    <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-10">
                      <button onClick={() => { setSelectedCandidate(candidate); setShowEditModal(true); setShowDeleteConfirm(null); }} className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2">
                        <Edit className="w-4 h-4" />
                        Edit
                      </button>
                      <button onClick={() => handleDeleteCandidate(candidate.id)} className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2">
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <div className="mb-4">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStageBadge(candidate.stage)}`}>{candidate.stage}</span>
              </div>
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Mail className="w-4 h-4" />
                  <span className="truncate">{candidate.email}</span>
                </div>
                {candidate.phone && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Phone className="w-4 h-4" />
                    {candidate.phone}
                  </div>
                )}
                {candidate.location && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4" />
                    {candidate.location}
                  </div>
                )}
              </div>
              {candidate.job && (
                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 text-sm">
                    <Briefcase className="w-4 h-4 text-gray-400" />
                    <div>
                      <div className="font-medium text-gray-900">{candidate.job.title}</div>
                      <div className="text-xs text-gray-600">{candidate.job.department}</div>
                    </div>
                  </div>
                </div>
              )}
              {candidate.skills && candidate.skills.length > 0 && (
                <div className="mb-4">
                  <div className="flex flex-wrap gap-2">
                    {candidate.skills.slice(0, 3).map((skill, idx) => (
                      <span key={idx} className="px-2 py-1 bg-primary-50 text-primary-700 text-xs rounded-full">{skill}</span>
                    ))}
                    {candidate.skills.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">+{candidate.skills.length - 3} more</span>
                    )}
                  </div>
                </div>
              )}
              <div className="text-sm text-gray-600 mb-4">
                {candidate.experience && <div>{candidate.experience} years experience</div>}
                {candidate.education && <div className="truncate">{candidate.education}</div>}
              </div>
              <div className="flex gap-2">
                {candidate.linkedinUrl && (
                  <a href={candidate.linkedinUrl} target="_blank" rel="noopener noreferrer" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <Linkedin className="w-4 h-4 text-gray-600" />
                  </a>
                )}
                {candidate.portfolioUrl && (
                  <a href={candidate.portfolioUrl} target="_blank" rel="noopener noreferrer" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <ExternalLink className="w-4 h-4 text-gray-600" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <CreateCandidateModal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} onSubmit={handleCreateCandidate} />

      {selectedCandidate && (
        <CreateCandidateModal isOpen={showEditModal} onClose={() => { setShowEditModal(false); setSelectedCandidate(null); }} onSubmit={handleUpdateCandidate} initialData={selectedCandidate} />
      )}
    </div>
  );
}
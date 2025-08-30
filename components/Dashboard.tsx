'use client';

import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  MoreHorizontal, 
  FileText, 
  Video, 
  CheckCircle2,
  Circle,
  User
} from 'lucide-react';

// Types
interface Document {
  id: string;
  name: string;
  size: string;
  type: 'Legal' | 'Vendors & Assets' | 'Technology' | 'Financial';
  aiAppInclusion: boolean;
  dashboardInclusion: boolean;
  stageAccess: 'Full' | 'Onboarding' | 'Franchisee' | 'Prospect';
}

interface Franchisee {
  id: string;
  name: string;
  avatar: string;
  stage: string;
}

// Mock data
const documents: Document[] = [
  {
    id: '1',
    name: 'Tech requirements.pdf',
    size: '200 KB',
    type: 'Legal',
    aiAppInclusion: true,
    dashboardInclusion: true,
    stageAccess: 'Full'
  },
  {
    id: '2',
    name: 'Dashboard screenshot.jpg',
    size: '720 KB',
    type: 'Vendors & Assets',
    aiAppInclusion: true,
    dashboardInclusion: true,
    stageAccess: 'Onboarding'
  },
  {
    id: '3',
    name: 'Dashboard prototype recording.mp4',
    size: '15 MB',
    type: 'Technology',
    aiAppInclusion: false,
    dashboardInclusion: true,
    stageAccess: 'Franchisee'
  },
  {
    id: '4',
    name: 'Financial Overview',
    size: '4.2 MB',
    type: 'Financial',
    aiAppInclusion: true,
    dashboardInclusion: true,
    stageAccess: 'Prospect'
  },
  {
    id: '5',
    name: 'UX Design Guidelines.docx',
    size: '400 KB',
    type: 'Legal',
    aiAppInclusion: true,
    dashboardInclusion: false,
    stageAccess: 'Onboarding'
  },
  {
    id: '6',
    name: 'Dashboard interaction.aep',
    size: '12 MB',
    type: 'Legal',
    aiAppInclusion: true,
    dashboardInclusion: true,
    stageAccess: 'Onboarding'
  },
  {
    id: '7',
    name: 'Briefing call recording.mp3',
    size: '15.8 MB',
    type: 'Financial',
    aiAppInclusion: false,
    dashboardInclusion: false,
    stageAccess: 'Prospect'
  }
];

const franchisees: Franchisee[] = [
  { id: '1', name: 'Wade Warren', avatar: '👨‍💼', stage: 'Initial Inquiry' },
  { id: '2', name: 'Ava Wright', avatar: '👩‍💼', stage: 'Initial Inquiry' },
  { id: '3', name: 'Cody Fisher', avatar: '👨‍💼', stage: 'Initial Inquiry' }
];

// Optimized Progress Circle Component
const ProgressCircle: React.FC<{ 
  percentage: number; 
  size?: number; 
  strokeWidth?: number;
  className?: string;
}> = ({ percentage, size = 120, strokeWidth = 8, className = '' }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = `${(percentage / 100) * circumference} ${circumference}`;

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgb(226, 232, 240)"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(14, 165, 233, 1)"
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={strokeDasharray}
          strokeLinecap="round"
          style={{ transition: 'stroke-dasharray 0.5s ease-in-out' }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-2xl font-bold text-gray-800">{percentage}%</span>
      </div>
    </div>
  );
};

// Toggle Switch Component
const Toggle: React.FC<{ 
  enabled: boolean; 
  onChange: (enabled: boolean) => void;
  disabled?: boolean;
}> = ({ enabled, onChange, disabled = false }) => (
  <button
    onClick={() => !disabled && onChange(!enabled)}
    className={`
      relative inline-flex h-6 w-11 items-center rounded-full transition-colors
      ${enabled ? 'bg-blue-500' : 'bg-gray-300'}
      ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
    `}
    disabled={disabled}
    aria-label="Toggle switch"
  >
    <span
      className={`
        inline-block h-4 w-4 transform rounded-full bg-white transition-transform
        ${enabled ? 'translate-x-6' : 'translate-x-1'}
      `}
    />
  </button>
);

// File Icon Component
const FileIcon: React.FC<{ fileName: string; className?: string }> = ({ fileName, className = '' }) => {
  const extension = fileName.split('.').pop()?.toLowerCase();
  
  if (extension === 'pdf') {
    return (
      <div className={`bg-red-500 text-white p-1 rounded text-xs font-bold ${className}`}>
        PDF
      </div>
    );
  }
  if (extension === 'jpg' || extension === 'jpeg' || extension === 'png') {
    return (
      <div className={`bg-blue-500 text-white p-1 rounded text-xs font-bold ${className}`}>
        IMG
      </div>
    );
  }
  if (extension === 'mp4' || extension === 'mov' || extension === 'aep') {
    return (
      <div className={`bg-blue-500 text-white p-1 rounded text-xs font-bold ${className}`}>
        {extension === 'mp4' ? 'VID' : 'DOC'}
      </div>
    );
  }
  if (extension === 'docx') {
    return (
      <div className={`bg-blue-500 text-white p-1 rounded text-xs font-bold ${className}`}>
        DOC
      </div>
    );
  }
  if (extension === 'mp3') {
    return (
      <div className={`bg-red-500 text-white p-1 rounded text-xs font-bold ${className}`}>
        MP3
      </div>
    );
  }
  return (
    <div className={`bg-blue-500 text-white p-1 rounded text-xs font-bold ${className}`}>
      DOC
    </div>
  );
};

// Main Dashboard Component
const Dashboard: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [documentStates, setDocumentStates] = useState<{
    [key: string]: { aiApp: boolean; dashboard: boolean; access: string }
  }>(() => {
    const initialState: {[key: string]: { aiApp: boolean; dashboard: boolean; access: string }} = {};
    documents.forEach(doc => {
      initialState[doc.id] = {
        aiApp: doc.aiAppInclusion,
        dashboard: doc.dashboardInclusion,
        access: doc.stageAccess
      };
    });
    return initialState;
  });

  const filteredDocuments = useMemo(() => {
    return documents.filter(doc =>
      doc.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const updateDocumentState = (
    docId: string, 
    field: 'aiApp' | 'dashboard' | 'access', 
    value: boolean | string
  ) => {
    setDocumentStates(prev => ({
      ...prev,
      [docId]: {
        ...prev[docId],
        [field]: value
      }
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-sky-900 text-white flex-shrink-0">
        <div className="p-4">
          <div className=" p-2 rounded text-center mb-8">
            <span className="font-bold text-xl"><i>weframetech</i></span>
          </div>
          
          <nav className="space-y-2">
            <a href="#" className="flex items-center px-3 py-2 rounded bg-gray-200/20 backdrop-blur-md ">
              <span>Home</span>
            </a>
            <a href="#" className="flex items-center px-3 py-2 rounded hover:bg-slate-700">
              <span>Stages & Checklist</span>
            </a>
            <a href="#" className="flex items-center px-3 py-2 rounded hover:bg-slate-700">
              <span>Upload Docs</span>
            </a>
            <a href="#" className="flex items-center px-3 py-2 rounded hover:bg-slate-700">
              <span>Preferred Vendors</span>
            </a>
            <a href="#" className="flex items-center px-3 py-2 rounded hover:bg-slate-700">
              <span>Tech Stack</span>
            </a>
            <a href="#" className="flex items-center px-3 py-2 rounded hover:bg-slate-700">
              <span>Targets</span>
            </a>
            <a href="#" className="flex items-center px-3 py-2 rounded hover:bg-slate-700">
              <span>Zee Sales Targets</span>
            </a>
            <a href="#" className="flex items-center px-3 py-2 rounded hover:bg-slate-700">
              <span>MAI Settings</span>
            </a>
            <a href="#" className="flex items-center px-3 py-2 rounded hover:bg-slate-700 relative">
              <span>Pending Questions</span>
              <span className="absolute right-2 bg-gray-100 text-xs text-black px-2 py-1 rounded-full">3</span>
            </a>
          </nav>
        </div>
        
        <div className="absolute bottom-4 left-4">
          <button className="text-slate-300 hover:text-white">Logout</button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">            </div>
            <div className="flex items-center space-x-4">
              <span className="bg-gray-600 text-white px-3 py-1 rounded-full text-sm">
               Aansh Malhotra
              </span>
              <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center">
                <User size={18} />
              </div>
            </div>
          </div>
        </header>

        <div className="p-6 space-y-6 overflow-y-auto h-full">
          {/* Top Row - Stats */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Account Progress */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="font-semibold text-gray-800 mb-4">Account Progress</h3>
              <div className="flex items-center justify-center mb-4">
                <ProgressCircle percentage={85} />
              </div>
              
              <div className="space-y-3">
                <h4 className="font-medium text-sm text-gray-600">Steps Completed</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Profile Setup</span>
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Initial Training</span>
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Legal Documents</span>
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                  </div>
                </div>

                <h4 className="font-medium text-sm text-gray-600 pt-2">Steps Remaining</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Financial Integration</span>
                    <Circle className="w-4 h-4 text-gray-300" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Final Review</span>
                    <Circle className="w-4 h-4 text-gray-300" />
                  </div>
                </div>
              </div>
            </div>

            {/* Total Franchisees */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="font-semibold text-gray-800 mb-4">Total Franchisees Onboard</h3>
              <div className="flex items-center mb-4">
                <span className="text-3xl font-bold text-gray-800">14</span>
                <span className="text-green-500 text-sm ml-2 bg-green-100 px-2 py-1 rounded">
                  ↗ 7.4%
                </span>
              </div>
              <div className="flex items-center space-x-1 mb-4">
                {[...Array(7)].map((_, i) => (
                  <div key={i} className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center text-xs">
                    👤
                  </div>
                ))}
                <span className="text-sm text-gray-500">+7</span>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                    Stage 1 (Initial Inquiry)
                  </span>
                  <span className="font-semibold">02</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center">
                    <div className="w-2 h-2 bg-sky-400 rounded-full mr-2"></div>
                    Stage 2 (Document Submission)
                  </span>
                  <span className="font-semibold">07</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center">
                    <div className="w-2 h-2 bg-sky-200 rounded-full mr-2"></div>
                    Stage 3 (Training)
                  </span>
                  <span className="font-semibold">05</span>
                </div>
              </div>
            </div>

            {/* Key Insights */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="font-semibold text-gray-800 mb-4">Key Insights & Feedback</h3>
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl font-bold text-gray-800">10%</span>
                  <div className="bg-gray-100 p-2 rounded-full">
                    <span className="text-xs text-gray-600">Top Performer</span>
                  </div>
                </div>
                <span className="text-sm text-gray-600">Sales Growth</span>
              </div>
              
              <div className="bg-gray-200/30 backdrop-blur-md rounded-lg p-4">
  <h4 className="font-medium text-sm  mb-2">Feedback</h4>
  <ul className="text-sm text-gray-500">
    <li>Franchisees are requesting more detailed training materials.</li>
  </ul>
</div>

            </div>
          </div>

          {/* Second Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Financial Wellbeing */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="font-semibold text-gray-800 mb-4">Financial Wellbeing</h3>
              <div className="flex items-center mb-4">
                <span className="text-3xl font-bold text-gray-800">20</span>
                <span className="text-green-500 text-sm ml-2 bg-green-100 px-2 py-1 rounded">
                  ↗ 2.1%
                </span>
              </div>
              <span className="text-sm text-gray-600 block mb-6">Total Franchisees</span>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm text-gray-600">Target</span>
                  <div className="text-xl font-bold text-gray-800">$500,000</div>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Current</span>
                  <div className="text-xl font-bold text-gray-800">$450,000</div>
                </div>
              </div>
            </div>

            {/* Prospect Leads */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="font-semibold text-gray-800 mb-4">Prospect Leads</h3>
              <div className="space-y-3">
                {franchisees.map((franchisee) => (
                  <div key={franchisee.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="text-lg">{franchisee.avatar}</div>
                      <span className="font-medium text-gray-800">{franchisee.name}</span>
                    </div>
                    <span className="text-sm text-gray-600">{franchisee.stage}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Documents Section */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-semibold text-gray-800">My Uploads</h3>
                <p className="text-sm text-gray-600">Documents that are uploaded by you.</p>
              </div>
              <MoreHorizontal className="w-5 h-5 text-gray-400" />
            </div>

            {/* Search and Filter */}
            <div className="flex items-center justify-between mb-6">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search here.."
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <button className="flex items-center space-x-2 px-4 py-2 text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50">
                <Filter className="w-4 h-4" />
                <span>Filters</span>
              </button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Document Name</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Document Type</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">AI App Inclusion</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Dashboard Inclusion</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Stage Access</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDocuments.map((doc) => (
                    <tr key={doc.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-3">
                          <FileIcon fileName={doc.name} />
                          <div>
                            <div className="font-medium text-gray-800">{doc.name}</div>
                            <div className="text-sm text-gray-500">{doc.size}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`
                          px-2 py-1 rounded-xl text-xs font-medium
                          ${doc.type === 'Legal' ? 'bg-blue-100 text-blue-800 ' : ''}
                          ${doc.type === 'Vendors & Assets' ? 'bg-green-100 text-green-800' : ''}
                          ${doc.type === 'Technology' ? 'bg-orange-100 text-orange-800' : ''}
                          ${doc.type === 'Financial' ? 'bg-purple-100 text-purple-800' : ''}
                        `}>
                          {doc.type} 
                        </span>
                      </td>
                      <td className="py-4 px-4 ">
                        <Toggle
                          enabled={documentStates[doc.id]?.aiApp ?? doc.aiAppInclusion}
                          onChange={(enabled) => updateDocumentState(doc.id, 'aiApp', enabled)}
                        />
                      </td>
                      <td className="py-4 px-4">
                        <Toggle
                          enabled={documentStates[doc.id]?.dashboard ?? doc.dashboardInclusion}
                          onChange={(enabled) => updateDocumentState(doc.id, 'dashboard', enabled)}
                        />
                      </td>
                      <td className="py-4 px-4">
                        <select
                          className="border border-gray-200 rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          value={documentStates[doc.id]?.access ?? doc.stageAccess}
                          onChange={(e) => updateDocumentState(doc.id, 'access', e.target.value)}
                        >
                          <option value="Full">Full</option>
                          <option value="Onboarding">Onboarding</option>
                          <option value="Franchisee">Franchisee</option>
                          <option value="Prospect">Prospect</option>
                        </select>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-2">
                          <button className="text-sm">Delete</button>
                          <button className="text-sky-400 text-sm">Edit</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
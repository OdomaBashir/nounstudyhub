import React, { useState } from 'react';
import { X, Lock, Mail, User as UserIcon, GraduationCap, Building2, BookOpen, CheckCircle, ShieldAlert } from 'lucide-react';
import { Level, User } from '../types';
import { NOUN_FACULTIES, NOUN_DEPARTMENTS, NOUN_PROGRAMMES, NOUN_STUDY_CENTRES } from '../data/nounData';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  onSaveUser: (user: User) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onSaveUser,
}) => {
  const [tab, setTab] = useState<'profile' | 'login' | 'signup' | 'reset'>('profile');
  const [resetSent, setResetSent] = useState(false);

  // Form states
  const [fullName, setFullName] = useState(currentUser.fullName);
  const [email, setEmail] = useState(currentUser.email);
  const [matricNo, setMatricNo] = useState(currentUser.matricNo);
  const [password, setPassword] = useState('••••••••');
  const [faculty, setFaculty] = useState(currentUser.faculty);
  const [department, setDepartment] = useState(currentUser.department);
  const [programme, setProgramme] = useState(currentUser.programme);
  const [level, setLevel] = useState<Level>(currentUser.level);
  const [studyCentre, setStudyCentre] = useState(currentUser.studyCentre);
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: User = {
      ...currentUser,
      fullName,
      email,
      matricNo,
      faculty,
      department,
      programme,
      level,
      studyCentre,
    };
    onSaveUser(updated);
    setSuccessMsg('Profile updated successfully!');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    const newUser: User = {
      id: `usr-${Date.now()}`,
      fullName,
      email,
      matricNo: matricNo || `NOU${Math.floor(100000000 + Math.random() * 900000000)}`,
      role: 'student',
      faculty,
      department,
      programme,
      level,
      studyCentre,
      savedCourseIds: ['course-cit-432'],
      savedMaterialIds: ['mat-cit432-cw'],
      downloadedMaterialIds: [],
      quizzesCompleted: 0,
      averageScore: 0,
      joinedDate: new Date().toISOString().split('T')[0],
    };
    onSaveUser(newUser);
    setTab('profile');
    setSuccessMsg('Account registered successfully! Welcome to NOUN Study Hub.');
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setResetSent(true);
  };

  return (
    <div 
      id="auth-modal"
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150"
    >
      <div className="relative bg-white rounded-2xl w-full max-w-lg shadow-2xl border border-slate-200 overflow-hidden">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-emerald-900 text-white">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-base font-display">
              {tab === 'profile' ? 'Student Profile & Settings' : 
               tab === 'signup' ? 'Create NOUN Student Account' : 
               tab === 'login' ? 'Student Sign In' : 'Reset Portal Password'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-emerald-200 hover:text-white hover:bg-emerald-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-slate-50 text-xs font-semibold">
          <button
            onClick={() => setTab('profile')}
            className={`flex-1 py-3 text-center border-b-2 transition-colors ${
              tab === 'profile'
                ? 'border-emerald-700 text-emerald-900 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            My Profile
          </button>
          <button
            onClick={() => setTab('signup')}
            className={`flex-1 py-3 text-center border-b-2 transition-colors ${
              tab === 'signup'
                ? 'border-emerald-700 text-emerald-900 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Sign Up
          </button>
          <button
            onClick={() => setTab('login')}
            className={`flex-1 py-3 text-center border-b-2 transition-colors ${
              tab === 'login'
                ? 'border-emerald-700 text-emerald-900 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Log In
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 max-h-[75vh] overflow-y-auto">
          {successMsg && (
            <div className="mb-4 p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-xs text-emerald-900 font-semibold flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Profile Tab */}
          {tab === 'profile' && (
            <form onSubmit={handleUpdateProfile} className="space-y-4 text-xs">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-emerald-800 text-white font-bold text-base flex items-center justify-center">
                  {currentUser.fullName.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900">{currentUser.fullName}</h4>
                  <p className="text-slate-500 font-mono text-[11px]">{currentUser.matricNo || 'Matric: Unassigned'}</p>
                  <span className="inline-block mt-0.5 px-2 py-0.5 bg-emerald-100 text-emerald-800 font-semibold rounded text-[10px]">
                    Role: {currentUser.role === 'admin' ? 'Administrator' : 'NOUN Distance Student'}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Full Name</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-300 focus:border-emerald-600 outline-none text-xs"
                    required
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-300 focus:border-emerald-600 outline-none text-xs"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Matriculation Number</label>
                  <input
                    type="text"
                    value={matricNo}
                    onChange={(e) => setMatricNo(e.target.value)}
                    placeholder="e.g. NOU214088921"
                    className="w-full p-2.5 rounded-lg border border-slate-300 focus:border-emerald-600 outline-none text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Current Level</label>
                  <select
                    value={level}
                    onChange={(e) => setLevel(e.target.value as Level)}
                    className="w-full p-2.5 rounded-lg border border-slate-300 focus:border-emerald-600 outline-none text-xs"
                  >
                    <option value="100L">100 Level</option>
                    <option value="200L">200 Level</option>
                    <option value="300L">300 Level</option>
                    <option value="400L">400 Level</option>
                    <option value="500L">500 Level</option>
                    <option value="PG">Postgraduate (PGD/M.Sc./Ph.D.)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Faculty</label>
                <select
                  value={faculty}
                  onChange={(e) => setFaculty(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-300 focus:border-emerald-600 outline-none text-xs"
                >
                  {NOUN_FACULTIES.map(f => (
                    <option key={f.id} value={f.name}>{f.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Department</label>
                  <input
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-300 focus:border-emerald-600 outline-none text-xs"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Programme</label>
                  <input
                    type="text"
                    value={programme}
                    onChange={(e) => setProgramme(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-300 focus:border-emerald-600 outline-none text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Assigned Study Centre</label>
                <select
                  value={studyCentre}
                  onChange={(e) => setStudyCentre(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-300 focus:border-emerald-600 outline-none text-xs"
                >
                  {NOUN_STUDY_CENTRES.map(sc => (
                    <option key={sc} value={sc}>{sc}</option>
                  ))}
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 font-semibold hover:bg-slate-50"
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-emerald-800 hover:bg-emerald-700 text-white font-bold shadow-sm transition-colors"
                >
                  Save Profile Changes
                </button>
              </div>
            </form>
          )}

          {/* Sign Up Tab */}
          {tab === 'signup' && (
            <form onSubmit={handleSignUp} className="space-y-3.5 text-xs">
              <div className="text-slate-600 text-xs mb-2">
                Create your student account to bookmark courseware, participate in AI quizzes, and track study progress.
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Full Name *</label>
                  <input
                    type="text"
                    placeholder="e.g. Bashir Odoma"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-300 focus:border-emerald-600 outline-none text-xs"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Email Address *</label>
                  <input
                    type="email"
                    placeholder="student@noun.edu.ng"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-300 focus:border-emerald-600 outline-none text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">NOUN Matric No</label>
                  <input
                    type="text"
                    placeholder="NOU..."
                    value={matricNo}
                    onChange={(e) => setMatricNo(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-300 focus:border-emerald-600 outline-none text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Create Password *</label>
                  <input
                    type="password"
                    placeholder="Minimum 6 characters"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-300 focus:border-emerald-600 outline-none text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Faculty *</label>
                <select
                  value={faculty}
                  onChange={(e) => setFaculty(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-300 focus:border-emerald-600 outline-none text-xs"
                >
                  {NOUN_FACULTIES.map(f => (
                    <option key={f.id} value={f.name}>{f.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Department</label>
                  <input
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-300 focus:border-emerald-600 outline-none text-xs"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Current Level *</label>
                  <select
                    value={level}
                    onChange={(e) => setLevel(e.target.value as Level)}
                    className="w-full p-2.5 rounded-lg border border-slate-300 focus:border-emerald-600 outline-none text-xs"
                  >
                    <option value="100L">100 Level</option>
                    <option value="200L">200 Level</option>
                    <option value="300L">300 Level</option>
                    <option value="400L">400 Level</option>
                    <option value="500L">500 Level</option>
                    <option value="PG">Postgraduate</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Study Centre</label>
                <select
                  value={studyCentre}
                  onChange={(e) => setStudyCentre(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-300 focus:border-emerald-600 outline-none text-xs"
                >
                  {NOUN_STUDY_CENTRES.map(sc => (
                    <option key={sc} value={sc}>{sc}</option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-lg bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition-colors mt-2"
              >
                Register Student Account
              </button>
            </form>
          )}

          {/* Log In Tab */}
          {tab === 'login' && (
            <div className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">NOUN Matric No or Email</label>
                <input
                  type="text"
                  placeholder="e.g. NOU214088921 or your email"
                  defaultValue={currentUser.matricNo || currentUser.email}
                  className="w-full p-2.5 rounded-lg border border-slate-300 focus:border-emerald-600 outline-none text-xs"
                />
              </div>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="font-semibold text-slate-700">Password</label>
                  <button 
                    type="button" 
                    onClick={() => setTab('reset')}
                    className="text-emerald-700 hover:underline font-semibold"
                  >
                    Forgot Password?
                  </button>
                </div>
                <input
                  type="password"
                  defaultValue="password123"
                  className="w-full p-2.5 rounded-lg border border-slate-300 focus:border-emerald-600 outline-none text-xs"
                />
              </div>

              <button
                onClick={() => {
                  setSuccessMsg('Successfully signed in!');
                  setTimeout(() => {
                    setSuccessMsg('');
                    onClose();
                  }, 1200);
                }}
                className="w-full py-2.5 rounded-lg bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition-colors"
              >
                Sign In to Study Hub
              </button>
            </div>
          )}

          {/* Reset Password Tab */}
          {tab === 'reset' && (
            <div className="space-y-4 text-xs">
              {resetSent ? (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 text-center space-y-2">
                  <CheckCircle className="w-8 h-8 text-emerald-600 mx-auto" />
                  <h4 className="font-bold text-sm">Reset Link Sent!</h4>
                  <p className="text-xs text-slate-600">
                    A password recovery link has been dispatched to <strong>{email}</strong>. Check your inbox to set a new password.
                  </p>
                  <button
                    onClick={() => {
                      setResetSent(false);
                      setTab('login');
                    }}
                    className="mt-3 px-4 py-1.5 bg-emerald-800 text-white rounded-lg font-semibold"
                  >
                    Back to Log In
                  </button>
                </div>
              ) : (
                <form onSubmit={handleResetPassword} className="space-y-3">
                  <p className="text-slate-600">
                    Enter the email address registered with your NOUN student portal. We will send you verification instructions.
                  </p>
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Student Email Address</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="student@noun.edu.ng"
                      className="w-full p-2.5 rounded-lg border border-slate-300 focus:border-emerald-600 outline-none text-xs"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setTab('login')}
                      className="flex-1 py-2 border border-slate-300 rounded-lg font-semibold text-slate-700"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-2 bg-emerald-800 text-white font-bold rounded-lg hover:bg-emerald-700"
                    >
                      Send Reset Instructions
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

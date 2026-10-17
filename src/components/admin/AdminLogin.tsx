import React, { useState } from 'react';
import { Doodle } from '@/components/brand/Doodle';

interface AdminLoginProps {
  onLogin: (email: string, pass: string) => Promise<unknown>;
  loading: boolean;
  error: string | null;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLogin, loading, error }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    if (!email.trim() || !password) {
      setLocalError('Please enter both email and password.');
      return;
    }

    try {
      await onLogin(email, password);
    } catch (err) {
      setLocalError((err as Error).message);
    }
  };

  return (
    <div className="min-h-screen bg-cream flex flex-col justify-center items-center px-4 py-12">
      <div className="w-full max-w-sm bg-ivory rounded-card border-hairline p-6 sm:p-8 shadow-sm space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 mx-auto rounded-full border border-hairline bg-cream flex items-center justify-center">
            <Doodle name="bow" size={24} className="text-ink" />
          </div>
          <h1 className="font-script text-3xl sm:text-4xl text-ink">
            Say By Saniya
          </h1>
          <p className="font-sans text-xs uppercase tracking-button text-ink-soft">
            Owner &amp; Admin Portal
          </p>
        </div>

        {(error || localError) && (
          <div className="p-3 bg-strawberry/15 border border-strawberry/30 rounded text-xs text-ink space-y-1">
            <p className="font-semibold text-heart">Access Denied</p>
            <p>{localError || error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="admin-email"
              className="block text-[11px] font-sans font-medium uppercase tracking-eyebrow text-ink-soft mb-1"
            >
              Admin Email
            </label>
            <input
              id="admin-email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="saniya@saylipss.co"
              className="w-full bg-cream/50 border border-hairline rounded p-2.5 text-sm text-ink focus:outline-none focus:border-ink transition-colors"
            />
          </div>

          <div>
            <label
              htmlFor="admin-password"
              className="block text-[11px] font-sans font-medium uppercase tracking-eyebrow text-ink-soft mb-1"
            >
              Password
            </label>
            <input
              id="admin-password"
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full bg-cream/50 border border-hairline rounded p-2.5 text-sm text-ink focus:outline-none focus:border-ink transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-pill bg-ink text-cream font-sans uppercase text-xs tracking-button font-medium hover:bg-heart active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <span>Signing In...</span>
            ) : (
              <>
                <span>Enter Admin Panel</span>
                <Doodle name="heart" size={14} className="text-cream" />
              </>
            )}
          </button>
        </form>

        <p className="text-[11px] text-center text-ink-soft">
          Protected by Supabase Auth &amp; Row Level Security. Only authorized staff accounts can access this panel.
        </p>
      </div>
    </div>
  );
};

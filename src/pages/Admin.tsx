import React, { useState, useEffect } from 'react';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { AdminLogin } from '@/components/admin/AdminLogin';
import { AdminDashboard } from '@/components/admin/AdminDashboard';
import { AdminProducts } from '@/components/admin/AdminProducts';
import { AdminDeals } from '@/components/admin/AdminDeals';
import { Doodle } from '@/components/brand/Doodle';

export const Admin: React.FC = () => {
  const { user, isAdmin, loading, error, login, logout } = useAdminAuth();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'deals' | 'enquiries' | 'reviews' | 'settings'>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Inject noindex meta tag to ensure search engines never index the admin portal
  useEffect(() => {
    let meta = document.querySelector('meta[name="robots"]') as HTMLMetaElement | null;
    const originalContent = meta ? meta.content : null;

    if (!meta) {
      meta = document.createElement('meta');
      meta.name = 'robots';
      document.head.appendChild(meta);
    }
    meta.content = 'noindex, nofollow';

    return () => {
      if (meta) {
        if (originalContent) meta.content = originalContent;
        else meta.remove();
      }
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex flex-col items-center justify-center p-6 text-center space-y-3">
        <Doodle name="bow" size={32} className="text-ink animate-bounce" />
        <p className="font-display text-xl text-ink">Verifying Admin Access...</p>
        <p className="text-xs text-ink-soft">Checking allowlist permissions</p>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return <AdminLogin onLogin={login} loading={loading} error={error} />;
  }

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: 'heart' as const },
    { id: 'products', label: 'Products & Photos', icon: 'bow' as const },
    { id: 'deals', label: 'Special Deals', icon: 'sparkle' as const },
  ];

  return (
    <div className="min-h-screen bg-cream text-ink flex flex-col">
      {/* Top Admin Bar */}
      <header className="sticky top-0 z-40 bg-ivory/95 backdrop-blur-md border-hairline-b px-4 sm:px-6 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="sm:hidden p-2 -ml-2 text-ink hover:text-heart"
            aria-label="Toggle navigation"
          >
            ☰
          </button>
          <div className="flex items-center gap-2">
            <span className="font-script text-2xl text-ink">Say By Saniya</span>
            <span className="text-[10px] uppercase font-sans font-semibold tracking-wider px-2 py-0.5 rounded-full bg-cream border border-hairline text-ink-soft">
              Admin
            </span>
          </div>
        </div>

        {/* Desktop Tabs */}
        <nav className="hidden sm:flex items-center gap-1 font-sans text-xs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`px-3.5 py-1.5 rounded-pill font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-ink text-cream shadow-sm'
                  : 'text-ink-soft hover:text-ink hover:bg-cream'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        {/* User Info & Logout */}
        <div className="flex items-center gap-3">
          <span className="hidden md:inline text-xs text-ink-soft font-mono truncate max-w-[140px]">
            {user.email}
          </span>
          <button
            type="button"
            onClick={logout}
            className="px-3 py-1.5 rounded-pill border border-hairline hover:border-ink text-xs font-sans font-medium text-ink transition-colors"
          >
            Sign Out
          </button>
        </div>
      </header>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden bg-ivory border-hairline-b p-4 space-y-2 animate-in slide-in-from-top duration-200">
          <p className="text-[11px] font-mono text-ink-soft mb-2 truncate">
            Signed in: {user.email}
          </p>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                setActiveTab(tab.id as typeof activeTab);
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-3 py-2 rounded text-xs font-medium flex items-center justify-between ${
                activeTab === tab.id
                  ? 'bg-ink text-cream'
                  : 'text-ink hover:bg-cream'
              }`}
            >
              <span>{tab.label}</span>
              <Doodle name={tab.icon} size={12} className={activeTab === tab.id ? 'text-cream' : 'text-heart'} />
            </button>
          ))}
        </div>
      )}

      {/* Main Admin Content Container */}
      <main className="flex-grow max-w-6xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {activeTab === 'dashboard' && <AdminDashboard onNavigate={(t) => setActiveTab(t as typeof activeTab)} />}
        {activeTab === 'products' && <AdminProducts />}
        {activeTab === 'deals' && <AdminDeals />}
      </main>

      {/* Admin Mobile Footer Tab Bar */}
      <div className="sm:hidden sticky bottom-0 z-30 bg-ivory/95 backdrop-blur-md border-hairline-t p-2 flex items-center justify-around shadow-lg">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`flex flex-col items-center py-1 px-3 rounded text-[11px] font-sans font-medium transition-colors ${
              activeTab === tab.id ? 'text-heart font-semibold' : 'text-ink-soft'
            }`}
          >
            <Doodle name={tab.icon} size={14} className={activeTab === tab.id ? 'text-heart' : 'text-ink-soft'} />
            <span className="mt-1">{tab.label.split(' ')[0]}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

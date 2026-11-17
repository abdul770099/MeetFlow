import React, { useState } from 'react';
import {
  LayoutDashboard,
  UploadCloud,
  History,
  Settings,
  X,
} from 'lucide-react';
import { NavPage, WorkspaceSettings } from '../types/meeting';

interface SidebarProps {
  activePage: NavPage;
  onNavigate: (page: NavPage) => void;
  settings: WorkspaceSettings;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

const NAV_ITEMS: { page: NavPage; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { page: NavPage.Dashboard, label: 'Dashboard', icon: LayoutDashboard },
  { page: NavPage.Upload, label: 'Upload Meeting', icon: UploadCloud },
  { page: NavPage.History, label: 'Meeting History', icon: History },
  { page: NavPage.Settings, label: 'Settings', icon: Settings },
];

export function Sidebar({
  activePage,
  onNavigate,
  settings,
  mobileOpen,
  onCloseMobile,
}: SidebarProps) {
  const [avatarError, setAvatarError] = useState(false);

  const initials = settings.userName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase())
    .join('') || 'MP';

  const handleNavClick = (page: NavPage) => {
    onNavigate(page);
    onCloseMobile();
  };

  const navContent = (
    <div className="flex h-full flex-col justify-between bg-white">
      <div>
        {/* Brand Header */}
        <div className="flex h-16 items-center justify-between border-b border-slate-200/80 px-5">
          <button
            type="button"
            onClick={() => handleNavClick(NavPage.Dashboard)}
            className="flex items-center gap-2.5 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 rounded-lg"
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#2563EB] text-white shadow-xs">
              <svg
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M4 12v-2a8 8 0 0 1 16 0v2" />
                <path d="M8 12v4" />
                <path d="M12 9v9" />
                <path d="M16 12v4" />
              </svg>
            </span>
            <span className="font-display text-[17px] font-bold tracking-tight text-[#0F2440] whitespace-nowrap">
              MeetFlow AI
            </span>
          </button>

          <button
            type="button"
            onClick={onCloseMobile}
            aria-label="Close navigation menu"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-[#0F2440] lg:hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav aria-label="Main navigation" className="px-3 py-5">
          <ul className="space-y-1">
            {NAV_ITEMS.map(({ page, label, icon: Icon }) => {
              const isActive =
                activePage === page ||
                (page === NavPage.History && activePage === NavPage.Minutes);

              return (
                <li key={page}>
                  <button
                    type="button"
                    onClick={() => handleNavClick(page)}
                    aria-current={isActive ? 'page' : undefined}
                    className={`flex w-full items-center gap-3 rounded-lg px-3.5 py-2.5 text-sm transition-colors duration-150 whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 ${
                      isActive
                        ? 'bg-[#EFF6FF] font-semibold text-[#1D4ED8]'
                        : 'font-medium text-[#475569] hover:bg-slate-50 hover:text-[#0F2440]'
                    }`}
                  >
                    <Icon
                      className={`h-[18px] w-[18px] shrink-0 ${
                        isActive ? 'text-[#2563EB]' : 'text-slate-400'
                      }`}
                    />
                    <span className="truncate">{label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>

      {/* Workspace User Footer */}
      <div className="border-t border-slate-200/80 p-4">
        <button
          type="button"
          onClick={() => handleNavClick(NavPage.Settings)}
          className="flex w-full items-center gap-3 rounded-lg p-1.5 text-left transition-colors hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
        >
          {!avatarError ? (
            <img
              src="/src/assets/images/avatar_workspace_user_1794910582596.jpg"
              alt={settings.userName}
              referrerPolicy="no-referrer"
              onError={() => setAvatarError(true)}
              className="h-9 w-9 shrink-0 rounded-full object-cover border border-slate-200"
            />
          ) : (
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#EFF6FF] text-xs font-semibold text-[#1D4ED8] border border-blue-200">
              {initials}
            </span>
          )}
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-[#0F2440]">
              {settings.userName}
            </p>
            <p className="truncate text-xs text-[#475569]">
              {settings.workspaceName}
            </p>
          </div>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-30 lg:block lg:w-64 lg:border-r lg:border-slate-200/80">
        {navContent}
      </aside>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-50 lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
        >
          <div
            className="fixed inset-0 bg-[#0F2440]/30 backdrop-blur-[1px] transition-opacity"
            onClick={onCloseMobile}
          />
          <aside className="fixed inset-y-0 left-0 w-72 max-w-[85vw] border-r border-slate-200 shadow-xl">
            {navContent}
          </aside>
        </div>
      )}
    </>
  );
}

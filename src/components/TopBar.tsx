import { Menu, UploadCloud } from 'lucide-react';
import { NavPage } from '../types/meeting';

interface TopBarProps {
  activePage: NavPage;
  selectedMeetingTitle?: string;
  onOpenMobileMenu: () => void;
  onNavigate: (page: NavPage) => void;
}

const PAGE_TITLES: Record<NavPage, string> = {
  [NavPage.Dashboard]: 'Dashboard',
  [NavPage.Upload]: 'Upload Meeting',
  [NavPage.History]: 'Meeting History',
  [NavPage.Minutes]: 'Meeting Minutes',
  [NavPage.Settings]: 'Settings',
};

export function TopBar({
  activePage,
  selectedMeetingTitle,
  onOpenMobileMenu,
  onNavigate,
}: TopBarProps) {
  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between gap-4 border-b border-slate-200/80 bg-white/95 px-4 backdrop-blur-sm sm:px-6 lg:px-8">
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          onClick={onOpenMobileMenu}
          aria-label="Open navigation menu"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-[#0F2440] hover:bg-slate-50 lg:hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
        >
          <Menu className="h-5 w-5" />
        </button>

        <nav aria-label="Breadcrumb" className="flex min-w-0 items-center gap-2 text-sm">
          {activePage === NavPage.Minutes && selectedMeetingTitle ? (
            <>
              <button
                type="button"
                onClick={() => onNavigate(NavPage.History)}
                className="shrink-0 font-medium text-[#475569] hover:text-[#0F2440] transition-colors whitespace-nowrap focus:outline-none focus-visible:underline"
              >
                Meeting History
              </button>
              <span className="text-slate-300" aria-hidden="true">
                /
              </span>
              <span className="truncate font-semibold text-[#0F2440]">
                {selectedMeetingTitle}
              </span>
            </>
          ) : (
            <span className="truncate font-display text-base font-semibold text-[#0F2440]">
              {PAGE_TITLES[activePage]}
            </span>
          )}
        </nav>
      </div>

      <div className="flex shrink-0 items-center gap-3">
        {activePage !== NavPage.Upload && (
          <button
            type="button"
            onClick={() => onNavigate(NavPage.Upload)}
            className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#2563EB] px-4 text-sm font-medium text-white shadow-xs transition-colors duration-150 hover:bg-[#1D4ED8] whitespace-nowrap shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
          >
            <UploadCloud className="h-4 w-4 shrink-0" />
            <span>Upload Meeting</span>
          </button>
        )}
      </div>
    </header>
  );
}

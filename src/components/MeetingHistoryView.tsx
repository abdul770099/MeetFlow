import { useMemo, useState } from 'react';
import { Search, Download, X, FileText } from 'lucide-react';
import { ActionItemStatus, MeetingRecord, NavPage } from '../types/meeting';
import { exportMeetingToPdf, formatMeetingDate } from '../utils/pdfExport';

interface MeetingHistoryViewProps {
  meetings: MeetingRecord[];
  onSelectMeeting: (meetingId: string) => void;
  onNavigate: (page: NavPage) => void;
}

type HistoryFilter = 'all' | 'open' | 'completed';

export function MeetingHistoryView({
  meetings,
  onSelectMeeting,
  onNavigate,
}: MeetingHistoryViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<HistoryFilter>('all');

  const filteredMeetings = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    return meetings.filter((meeting) => {
      const hasOpenTasks = meeting.actionItems.some(
        (item) => item.status !== ActionItemStatus.Completed
      );

      if (filter === 'open' && !hasOpenTasks) return false;
      if (filter === 'completed' && hasOpenTasks) return false;

      if (!q) return true;

      return (
        meeting.title.toLowerCase().includes(q) ||
        meeting.summary.toLowerCase().includes(q) ||
        meeting.audioFileName.toLowerCase().includes(q) ||
        meeting.participants.some((p) => p.toLowerCase().includes(q)) ||
        formatMeetingDate(meeting.date).toLowerCase().includes(q)
      );
    });
  }, [meetings, searchQuery, filter]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-[#0F2440]">
            Meeting History
          </h1>
          <p className="mt-1 text-sm text-[#475569]">
            Search past meetings, inspect dates and deliverables, or open generated minutes.
          </p>
        </div>
        <p className="text-xs font-medium text-[#475569] tabular-nums">
          {filteredMeetings.length} of {meetings.length} meetings
        </p>
      </div>

      {/* Search and Filter Toolbar */}
      <div className="flex flex-col gap-3 rounded-xl border border-slate-200/80 bg-white p-4 shadow-[0_1px_3px_rgba(15,23,42,0.05)] sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 sm:max-w-md">
          <Search
            className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
            aria-hidden="true"
          />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by meeting title, participant, or keyword..."
            aria-label="Search meeting history"
            className="h-10 w-full rounded-lg border border-slate-200 bg-[#F8FAFC] pl-10 pr-9 text-sm text-[#0F2440] placeholder:text-slate-400 focus:border-[#2563EB] focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/20"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              aria-label="Clear search"
              className="absolute right-2.5 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded text-slate-400 hover:text-[#0F2440]"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Interactive Filter Tabs */}
        <div
          role="tablist"
          aria-label="Filter meetings by action item status"
          className="flex items-center gap-1 self-start rounded-lg bg-[#F1F5F9] p-1 sm:self-auto"
        >
          {(
            [
              { id: 'all', label: 'All Meetings' },
              { id: 'open', label: 'Open Actions' },
              { id: 'completed', label: 'All Done' },
            ] as const
          ).map((tab) => {
            const active = filter === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setFilter(tab.id)}
                className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 ${
                  active
                    ? 'bg-white text-[#0F2440] shadow-2xs'
                    : 'text-[#475569] hover:text-[#0F2440]'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Results List */}
      <section className="rounded-xl border border-slate-200/80 bg-white shadow-[0_1px_3px_rgba(15,23,42,0.05)]">
        {filteredMeetings.length === 0 ? (
          <div className="px-6 py-14 text-center">
            <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-[#EFF6FF] text-[#2563EB]">
              <FileText className="h-5 w-5" aria-hidden="true" />
            </span>
            <p className="mt-3 text-sm font-semibold text-[#0F2440]">
              No matching meetings found
            </p>
            <p className="mt-1 text-sm text-[#475569]">
              Try adjusting your search keywords or filter selection.
            </p>
            <div className="mt-4 flex items-center justify-center gap-3">
              {(searchQuery || filter !== 'all') && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setFilter('all');
                  }}
                  className="inline-flex h-9 items-center rounded-lg border border-slate-200 bg-white px-3.5 text-xs font-medium text-[#0F2440] hover:bg-slate-50"
                >
                  Clear filters
                </button>
              )}
              <button
                type="button"
                onClick={() => onNavigate(NavPage.Upload)}
                className="inline-flex h-9 items-center rounded-lg bg-[#2563EB] px-3.5 text-xs font-medium text-white hover:bg-[#1D4ED8]"
              >
                Upload New Meeting
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Desktop & Tablet Table */}
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="border-b border-slate-200/80 bg-[#F8FAFC] text-xs font-semibold text-[#475569]">
                    <th scope="col" className="py-3 pl-6 pr-4">
                      Meeting
                    </th>
                    <th scope="col" className="px-4 py-3">
                      Date
                    </th>
                    <th scope="col" className="px-4 py-3 text-right">
                      Duration
                    </th>
                    <th scope="col" className="px-4 py-3 text-right">
                      Decisions
                    </th>
                    <th scope="col" className="px-4 py-3 text-right">
                      Action Items
                    </th>
                    <th scope="col" className="py-3 pl-4 pr-6 text-right">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200/70 text-sm">
                  {filteredMeetings.map((meeting) => {
                    const completedCount = meeting.actionItems.filter(
                      (i) => i.status === ActionItemStatus.Completed
                    ).length;

                    return (
                      <tr
                        key={meeting.id}
                        className="transition-colors hover:bg-[#F8FAFC]"
                      >
                        <td className="py-4 pl-6 pr-4">
                          <button
                            type="button"
                            onClick={() => onSelectMeeting(meeting.id)}
                            className="text-left font-semibold text-[#0F2440] hover:text-[#2563EB] transition-colors focus:outline-none focus-visible:underline"
                          >
                            {meeting.title}
                          </button>
                          <p className="mt-1 line-clamp-1 max-w-xl text-xs text-[#475569]">
                            {meeting.summary}
                          </p>
                        </td>
                        <td className="px-4 py-4 text-[#475569] tabular-nums whitespace-nowrap">
                          {formatMeetingDate(meeting.date)}
                        </td>
                        <td className="px-4 py-4 text-right text-[#475569] tabular-nums whitespace-nowrap">
                          {meeting.durationMinutes} min
                        </td>
                        <td className="px-4 py-4 text-right text-[#475569] tabular-nums whitespace-nowrap">
                          {meeting.importantDecisions.length}
                        </td>
                        <td className="px-4 py-4 text-right text-[#475569] tabular-nums whitespace-nowrap">
                          {completedCount}/{meeting.actionItems.length}
                        </td>
                        <td className="py-4 pl-4 pr-6 text-right whitespace-nowrap">
                          <div className="inline-flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => exportMeetingToPdf(meeting)}
                              aria-label={`Download PDF for ${meeting.title}`}
                              title="Download PDF"
                              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-[#475569] transition-colors hover:bg-slate-50 hover:text-[#0F2440] focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                            >
                              <Download className="h-4 w-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => onSelectMeeting(meeting.id)}
                              className="inline-flex h-9 items-center rounded-lg border border-slate-200 bg-white px-3.5 text-xs font-medium text-[#0F2440] transition-colors hover:border-blue-200 hover:bg-[#EFF6FF] hover:text-[#1D4ED8] focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                            >
                              View Minutes
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="divide-y divide-slate-200/70 md:hidden">
              {filteredMeetings.map((meeting) => {
                const completedCount = meeting.actionItems.filter(
                  (i) => i.status === ActionItemStatus.Completed
                ).length;

                return (
                  <div key={meeting.id} className="p-4">
                    <button
                      type="button"
                      onClick={() => onSelectMeeting(meeting.id)}
                      className="text-left text-sm font-semibold text-[#0F2440] hover:text-[#2563EB]"
                    >
                      {meeting.title}
                    </button>
                    <p className="mt-1 text-xs text-[#475569] tabular-nums">
                      {formatMeetingDate(meeting.date)} · {meeting.durationMinutes} min ·{' '}
                      {completedCount}/{meeting.actionItems.length} action items done
                    </p>
                    <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-[#475569]">
                      {meeting.summary}
                    </p>
                    <div className="mt-3 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => onSelectMeeting(meeting.id)}
                        className="inline-flex h-9 flex-1 items-center justify-center rounded-lg border border-slate-200 bg-white px-3 text-xs font-medium text-[#0F2440] hover:bg-[#EFF6FF] hover:text-[#1D4ED8]"
                      >
                        View Minutes
                      </button>
                      <button
                        type="button"
                        onClick={() => exportMeetingToPdf(meeting)}
                        aria-label={`Download PDF for ${meeting.title}`}
                        className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-[#475569] hover:bg-slate-50"
                      >
                        <Download className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </section>
    </div>
  );
}

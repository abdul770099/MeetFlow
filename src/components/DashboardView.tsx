import {
  FileText,
  CheckSquare,
  Clock,
  FolderKanban,
  UploadCloud,
  ArrowRight,
} from 'lucide-react';
import { ActionItemStatus, MeetingRecord, NavPage } from '../types/meeting';
import { formatMeetingDate } from '../utils/pdfExport';

interface DashboardViewProps {
  userName: string;
  meetings: MeetingRecord[];
  onNavigate: (page: NavPage) => void;
  onSelectMeeting: (meetingId: string) => void;
}

export function DashboardView({
  userName,
  meetings,
  onNavigate,
  onSelectMeeting,
}: DashboardViewProps) {
  const firstName = userName.split(' ')[0] || 'there';

  const totalMeetings = meetings.length;
  const minutesGenerated = meetings.length;
  const allActionItems = meetings.flatMap((m) => m.actionItems);
  const totalActionItems = allActionItems.length;
  const openActionItems = allActionItems.filter(
    (item) => item.status !== ActionItemStatus.Completed
  ).length;

  const totalSavedMinutes = meetings.reduce(
    (acc, m) => acc + m.timeSavedMinutes,
    0
  );
  const savedHours = Math.floor(totalSavedMinutes / 60);
  const savedRemainderMins = totalSavedMinutes % 60;
  const formattedTimeSaved =
    savedHours > 0
      ? `${savedHours}h ${savedRemainderMins}m`
      : `${savedRemainderMins}m`;

  const recentMeetings = meetings.slice(0, 5);

  const stats = [
    {
      label: 'Total Meetings',
      value: String(totalMeetings),
      detail: 'Recorded sessions',
      icon: FolderKanban,
    },
    {
      label: 'Minutes Generated',
      value: String(minutesGenerated),
      detail: 'Ready for review & export',
      icon: FileText,
    },
    {
      label: 'Action Items',
      value: String(totalActionItems),
      detail: `${openActionItems} open tasks remaining`,
      icon: CheckSquare,
    },
    {
      label: 'Processing Time Saved',
      value: formattedTimeSaved,
      detail: 'Estimated manual note-taking saved',
      icon: Clock,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Banner Row */}
      <section className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-[#0F2440] sm:text-3xl">
            Welcome back, {firstName}
          </h1>
          <p className="mt-1.5 text-sm text-[#475569] sm:text-base">
            Review recent meeting minutes, track team action items, or process a new recording.
          </p>
        </div>

        <button
          type="button"
          onClick={() => onNavigate(NavPage.Upload)}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-[#2563EB] px-5 text-sm font-medium text-white shadow-xs transition-colors duration-150 hover:bg-[#1D4ED8] whitespace-nowrap shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
        >
          <UploadCloud className="h-4 w-4 shrink-0" />
          <span>Quick Upload</span>
        </button>
      </section>

      {/* Statistics Cards */}
      <section aria-label="Workspace statistics" className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(({ label, value, detail, icon: Icon }) => (
          <div
            key={label}
            className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-[0_1px_3px_rgba(15,23,42,0.05)]"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm font-medium text-[#475569]">{label}</p>
                <p className="mt-2 font-display text-3xl font-bold tracking-tight text-[#0F2440] tabular-nums">
                  {value}
                </p>
              </div>
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#EFF6FF] text-[#2563EB]">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>
            </div>
            <p className="mt-3 text-xs text-[#475569]">{detail}</p>
          </div>
        ))}
      </section>

      {/* Recent Meetings Table */}
      <section className="rounded-xl border border-slate-200/80 bg-white shadow-[0_1px_3px_rgba(15,23,42,0.05)]">
        <div className="flex flex-col gap-2 border-b border-slate-200/80 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div>
            <h2 className="font-display text-lg font-semibold text-[#0F2440]">
              Recent Meetings
            </h2>
            <p className="text-xs text-[#475569]">
              Latest processed recordings and generated meeting minutes
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate(NavPage.History)}
            className="inline-flex items-center gap-1.5 self-start text-sm font-medium text-[#2563EB] hover:text-[#1D4ED8] transition-colors whitespace-nowrap sm:self-auto focus:outline-none focus-visible:underline"
          >
            <span>View all meetings</span>
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        {recentMeetings.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <p className="text-sm font-medium text-[#0F2440]">
              No meetings recorded yet
            </p>
            <p className="mt-1 text-sm text-[#475569]">
              Upload an MP3 or WAV recording to generate your first set of meeting minutes.
            </p>
            <button
              type="button"
              onClick={() => onNavigate(NavPage.Upload)}
              className="mt-4 inline-flex h-10 items-center gap-2 rounded-lg bg-[#2563EB] px-4 text-sm font-medium text-white hover:bg-[#1D4ED8]"
            >
              <UploadCloud className="h-4 w-4" />
              <span>Upload Meeting</span>
            </button>
          </div>
        ) : (
          <>
            {/* Desktop & Tablet Table */}
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="border-b border-slate-200/80 bg-[#F8FAFC] text-xs font-semibold text-[#475569]">
                    <th scope="col" className="py-3 pl-6 pr-4">
                      Meeting Title
                    </th>
                    <th scope="col" className="px-4 py-3">
                      Date
                    </th>
                    <th scope="col" className="px-4 py-3 text-right">
                      Duration
                    </th>
                    <th scope="col" className="px-4 py-3 text-right">
                      Action Items
                    </th>
                    <th scope="col" className="py-3 pl-4 pr-6 text-right">
                      Minutes
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200/70 text-sm">
                  {recentMeetings.map((meeting) => {
                    const completedCount = meeting.actionItems.filter(
                      (i) => i.status === ActionItemStatus.Completed
                    ).length;

                    return (
                      <tr
                        key={meeting.id}
                        className="transition-colors hover:bg-[#F8FAFC]"
                      >
                        <td className="py-3.5 pl-6 pr-4">
                          <button
                            type="button"
                            onClick={() => onSelectMeeting(meeting.id)}
                            className="text-left font-medium text-[#0F2440] hover:text-[#2563EB] transition-colors focus:outline-none focus-visible:underline"
                          >
                            {meeting.title}
                          </button>
                          <p className="mt-0.5 text-xs text-[#475569]">
                            {meeting.participants.length} participants · {meeting.audioFileName}
                          </p>
                        </td>
                        <td className="px-4 py-3.5 text-[#475569] tabular-nums whitespace-nowrap">
                          {formatMeetingDate(meeting.date)}
                        </td>
                        <td className="px-4 py-3.5 text-right text-[#475569] tabular-nums whitespace-nowrap">
                          {meeting.durationMinutes} min
                        </td>
                        <td className="px-4 py-3.5 text-right text-[#475569] tabular-nums whitespace-nowrap">
                          {completedCount}/{meeting.actionItems.length} done
                        </td>
                        <td className="py-3.5 pl-4 pr-6 text-right whitespace-nowrap">
                          <button
                            type="button"
                            onClick={() => onSelectMeeting(meeting.id)}
                            className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 text-xs font-medium text-[#0F2440] transition-colors hover:border-blue-200 hover:bg-[#EFF6FF] hover:text-[#1D4ED8] focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                          >
                            <span>View Minutes</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile List Layout */}
            <div className="divide-y divide-slate-200/70 md:hidden">
              {recentMeetings.map((meeting) => (
                <div key={meeting.id} className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <button
                        type="button"
                        onClick={() => onSelectMeeting(meeting.id)}
                        className="text-left text-sm font-semibold text-[#0F2440] hover:text-[#2563EB]"
                      >
                        {meeting.title}
                      </button>
                      <p className="mt-1 text-xs text-[#475569] tabular-nums">
                        {formatMeetingDate(meeting.date)} · {meeting.durationMinutes} min ·{' '}
                        {meeting.actionItems.length} action items
                      </p>
                    </div>
                  </div>
                  <div className="mt-3">
                    <button
                      type="button"
                      onClick={() => onSelectMeeting(meeting.id)}
                      className="inline-flex h-9 w-full items-center justify-center rounded-lg border border-slate-200 bg-white px-3 text-xs font-medium text-[#0F2440] hover:bg-[#EFF6FF] hover:text-[#1D4ED8]"
                    >
                      View Minutes
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </section>
    </div>
  );
}

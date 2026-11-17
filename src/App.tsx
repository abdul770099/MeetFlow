import { useState } from 'react';
import { INITIAL_MEETINGS, INITIAL_SETTINGS } from './data/mockMeetings';
import { MeetingRecord, NavPage, WorkspaceSettings } from './types/meeting';
import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { DashboardView } from './components/DashboardView';
import { UploadMeetingView } from './components/UploadMeetingView';
import { MeetingHistoryView } from './components/MeetingHistoryView';
import { MeetingMinutesView } from './components/MeetingMinutesView';
import { SettingsView } from './components/SettingsView';

export default function App() {
  const [activePage, setActivePage] = useState<NavPage>(NavPage.Dashboard);
  const [meetings, setMeetings] = useState<MeetingRecord[]>(INITIAL_MEETINGS);
  const [selectedMeetingId, setSelectedMeetingId] = useState<string>(
    INITIAL_MEETINGS[0]?.id ?? ''
  );
  const [settings, setSettings] = useState<WorkspaceSettings>(INITIAL_SETTINGS);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const selectedMeeting =
    meetings.find((m) => m.id === selectedMeetingId) ?? meetings[0];

  const handleSelectMeeting = (meetingId: string) => {
    setSelectedMeetingId(meetingId);
    setActivePage(NavPage.Minutes);
  };

  const handleMeetingGenerated = (newMeeting: MeetingRecord) => {
    setMeetings((prev) => [newMeeting, ...prev]);
    setSelectedMeetingId(newMeeting.id);
    setActivePage(NavPage.Minutes);
  };

  const handleSaveMeeting = (updated: MeetingRecord) => {
    setMeetings((prev) =>
      prev.map((m) => (m.id === updated.id ? updated : m))
    );
  };

  return (
    <div className="min-h-screen bg-[#F4F7FB] text-[#0F2440]">
      <Sidebar
        activePage={activePage}
        onNavigate={setActivePage}
        settings={settings}
        mobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
      />

      <div className="flex min-h-screen flex-col lg:pl-64">
        <TopBar
          activePage={activePage}
          selectedMeetingTitle={
            activePage === NavPage.Minutes ? selectedMeeting?.title : undefined
          }
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
          onNavigate={setActivePage}
        />

        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          {activePage === NavPage.Dashboard && (
            <DashboardView
              userName={settings.userName}
              meetings={meetings}
              onNavigate={setActivePage}
              onSelectMeeting={handleSelectMeeting}
            />
          )}

          {activePage === NavPage.Upload && (
            <UploadMeetingView
              defaultOwner={settings.userName}
              onMeetingGenerated={handleMeetingGenerated}
            />
          )}

          {activePage === NavPage.History && (
            <MeetingHistoryView
              meetings={meetings}
              onSelectMeeting={handleSelectMeeting}
              onNavigate={setActivePage}
            />
          )}

          {activePage === NavPage.Minutes && selectedMeeting && (
            <MeetingMinutesView
              meeting={selectedMeeting}
              onSaveMeeting={handleSaveMeeting}
              onBackToHistory={() => setActivePage(NavPage.History)}
            />
          )}

          {activePage === NavPage.Settings && (
            <SettingsView
              settings={settings}
              onSaveSettings={setSettings}
            />
          )}
        </main>
      </div>
    </div>
  );
}

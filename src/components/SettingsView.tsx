import React, { useState } from 'react';
import { Check, Save } from 'lucide-react';
import { SummaryDepth, WorkspaceSettings } from '../types/meeting';

interface SettingsViewProps {
  settings: WorkspaceSettings;
  onSaveSettings: (updated: WorkspaceSettings) => void;
}

const DEPTH_OPTIONS: SummaryDepth[] = ['Concise', 'Balanced', 'Detailed'];

export function SettingsView({ settings, onSaveSettings }: SettingsViewProps) {
  const [formState, setFormState] = useState<WorkspaceSettings>(settings);
  const [savedNotice, setSavedNotice] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettings({
      ...formState,
      userName: formState.userName.trim() || settings.userName,
      userRole: formState.userRole.trim() || settings.userRole,
      workspaceName: formState.workspaceName.trim() || settings.workspaceName,
    });
    setSavedNotice(true);
    window.setTimeout(() => setSavedNotice(false), 3000);
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight text-[#0F2440]">
          Workspace Settings
        </h1>
        <p className="mt-1.5 text-sm text-[#475569]">
          Manage your profile details and default meeting minutes formatting preferences.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="rounded-xl border border-slate-200/80 bg-white shadow-[0_1px_3px_rgba(15,23,42,0.05)] divide-y divide-slate-200/80"
      >
        {/* Profile Section */}
        <section className="p-6 sm:p-8">
          <h2 className="font-display text-base font-semibold text-[#0F2440]">
            Profile & Workspace
          </h2>
          <p className="mt-1 text-xs text-[#475569]">
            Used for dashboard greeting, default action-item ownership, and exported headers.
          </p>

          <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label
                htmlFor="settings-name"
                className="block text-sm font-medium text-[#0F2440]"
              >
                Full Name
              </label>
              <input
                id="settings-name"
                type="text"
                value={formState.userName}
                onChange={(e) =>
                  setFormState({ ...formState, userName: e.target.value })
                }
                className="mt-1.5 h-10 w-full rounded-lg border border-slate-200 bg-white px-3.5 text-sm text-[#0F2440] focus:border-[#2563EB] focus:outline-none focus:ring-2 focus:ring-blue-600/20"
              />
            </div>

            <div>
              <label
                htmlFor="settings-role"
                className="block text-sm font-medium text-[#0F2440]"
              >
                Role
              </label>
              <input
                id="settings-role"
                type="text"
                value={formState.userRole}
                onChange={(e) =>
                  setFormState({ ...formState, userRole: e.target.value })
                }
                className="mt-1.5 h-10 w-full rounded-lg border border-slate-200 bg-white px-3.5 text-sm text-[#0F2440] focus:border-[#2563EB] focus:outline-none focus:ring-2 focus:ring-blue-600/20"
              />
            </div>

            <div className="sm:col-span-2">
              <label
                htmlFor="settings-workspace"
                className="block text-sm font-medium text-[#0F2440]"
              >
                Workspace Name
              </label>
              <input
                id="settings-workspace"
                type="text"
                value={formState.workspaceName}
                onChange={(e) =>
                  setFormState({ ...formState, workspaceName: e.target.value })
                }
                className="mt-1.5 h-10 w-full rounded-lg border border-slate-200 bg-white px-3.5 text-sm text-[#0F2440] focus:border-[#2563EB] focus:outline-none focus:ring-2 focus:ring-blue-600/20"
              />
            </div>
          </div>
        </section>

        {/* Generation Preferences */}
        <section className="p-6 sm:p-8">
          <h2 className="font-display text-base font-semibold text-[#0F2440]">
            Minutes Preferences
          </h2>
          <p className="mt-1 text-xs text-[#475569]">
            Configure how simulated meeting minutes are structured by default.
          </p>

          <div className="mt-5 space-y-5">
            <div>
              <span className="block text-sm font-medium text-[#0F2440]">
                Summary Detail Level
              </span>
              <div className="mt-2 inline-flex rounded-lg bg-[#F1F5F9] p-1">
                {DEPTH_OPTIONS.map((option) => {
                  const selected = formState.summaryDepth === option;
                  return (
                    <button
                      key={option}
                      type="button"
                      onClick={() =>
                        setFormState({ ...formState, summaryDepth: option })
                      }
                      className={`rounded-md px-3.5 py-1.5 text-xs font-medium transition-colors whitespace-nowrap ${
                        selected
                          ? 'bg-white text-[#0F2440] shadow-2xs'
                          : 'text-[#475569] hover:text-[#0F2440]'
                      }`}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-3">
              <label className="flex cursor-pointer items-start gap-3">
                <input
                  type="checkbox"
                  checked={formState.includeSpeakerNames}
                  onChange={(e) =>
                    setFormState({
                      ...formState,
                      includeSpeakerNames: e.target.checked,
                    })
                  }
                  className="mt-0.5 h-4 w-4 rounded border-slate-300 text-[#2563EB] focus:ring-blue-600"
                />
                <span>
                  <span className="block text-sm font-medium text-[#0F2440]">
                    Include speaker attribution
                  </span>
                  <span className="block text-xs text-[#475569]">
                    Tag participants alongside discussion points and decisions
                  </span>
                </span>
              </label>

              <label className="flex cursor-pointer items-start gap-3">
                <input
                  type="checkbox"
                  checked={formState.autoExtractActionItems}
                  onChange={(e) =>
                    setFormState({
                      ...formState,
                      autoExtractActionItems: e.target.checked,
                    })
                  }
                  className="mt-0.5 h-4 w-4 rounded border-slate-300 text-[#2563EB] focus:ring-blue-600"
                />
                <span>
                  <span className="block text-sm font-medium text-[#0F2440]">
                    Automatically extract action items
                  </span>
                  <span className="block text-xs text-[#475569]">
                    Populate tasks, assignees, and suggested deadlines into the action items table
                  </span>
                </span>
              </label>
            </div>
          </div>
        </section>

        {/* Footer Save Bar */}
        <footer className="flex flex-col gap-3 px-6 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <div className="min-h-5">
            {savedNotice && (
              <span
                role="status"
                className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700"
              >
                <Check className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Preferences updated</span>
              </span>
            )}
          </div>
          <button
            type="submit"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-[#2563EB] px-4 text-sm font-medium text-white shadow-xs transition-colors hover:bg-[#1D4ED8] whitespace-nowrap shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
          >
            <Save className="h-4 w-4" aria-hidden="true" />
            <span>Save Preferences</span>
          </button>
        </footer>
      </form>
    </div>
  );
}

import { useEffect, useState } from 'react';
import {
  ArrowLeft,
  Pencil,
  Save,
  Download,
  Plus,
  Trash2,
  Check,
  X,
} from 'lucide-react';
import { ActionItem, ActionItemStatus, MeetingRecord } from '../types/meeting';
import { exportMeetingToPdf, formatMeetingDate } from '../utils/pdfExport';
import { StatusLabel } from './StatusLabel';

interface MeetingMinutesViewProps {
  meeting: MeetingRecord;
  onSaveMeeting: (updated: MeetingRecord) => void;
  onBackToHistory: () => void;
}

export function MeetingMinutesView({
  meeting,
  onSaveMeeting,
  onBackToHistory,
}: MeetingMinutesViewProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState<MeetingRecord>(meeting);
  const [savedToast, setSavedToast] = useState(false);

  useEffect(() => {
    setDraft(meeting);
    setIsEditing(false);
  }, [meeting.id]);

  const handleStartEdit = () => {
    setDraft(structuredClone(meeting));
    setIsEditing(true);
    setSavedToast(false);
  };

  const handleCancelEdit = () => {
    setDraft(structuredClone(meeting));
    setIsEditing(false);
  };

  const handleSave = () => {
    const cleaned: MeetingRecord = {
      ...draft,
      title: draft.title.trim() || meeting.title,
      summary: draft.summary.trim(),
      keyDiscussionPoints: draft.keyDiscussionPoints
        .map((p) => p.trim())
        .filter(Boolean),
      importantDecisions: draft.importantDecisions
        .map((d) => d.trim())
        .filter(Boolean),
      actionItems: draft.actionItems
        .filter((item) => item.task.trim().length > 0)
        .map((item) => ({
          ...item,
          task: item.task.trim(),
          assignedTo: item.assignedTo.trim() || 'Unassigned',
        })),
      updatedAt: new Date().toISOString(),
    };

    onSaveMeeting(cleaned);
    setDraft(cleaned);
    setIsEditing(false);
    setSavedToast(true);
    window.setTimeout(() => setSavedToast(false), 3000);
  };

  const handleQuickStatusChange = (itemId: string, nextStatus: ActionItemStatus) => {
    const updatedActionItems = meeting.actionItems.map((item) =>
      item.id === itemId ? { ...item, status: nextStatus } : item
    );
    const updatedMeeting: MeetingRecord = {
      ...meeting,
      actionItems: updatedActionItems,
      updatedAt: new Date().toISOString(),
    };
    onSaveMeeting(updatedMeeting);
    setDraft(updatedMeeting);
  };

  const updatePoint = (index: number, value: string) => {
    const next = [...draft.keyDiscussionPoints];
    next[index] = value;
    setDraft({ ...draft, keyDiscussionPoints: next });
  };

  const removePoint = (index: number) => {
    setDraft({
      ...draft,
      keyDiscussionPoints: draft.keyDiscussionPoints.filter((_, i) => i !== index),
    });
  };

  const updateDecision = (index: number, value: string) => {
    const next = [...draft.importantDecisions];
    next[index] = value;
    setDraft({ ...draft, importantDecisions: next });
  };

  const removeDecision = (index: number) => {
    setDraft({
      ...draft,
      importantDecisions: draft.importantDecisions.filter((_, i) => i !== index),
    });
  };

  const updateActionItem = (
    index: number,
    field: keyof ActionItem,
    value: string
  ) => {
    const next = [...draft.actionItems];
    next[index] = {
      ...next[index],
      [field]: value,
    };
    setDraft({ ...draft, actionItems: next });
  };

  const addActionItem = () => {
    setDraft({
      ...draft,
      actionItems: [
        ...draft.actionItems,
        {
          id: `ai-${Date.now()}`,
          task: '',
          assignedTo: '',
          deadline: draft.date,
          status: ActionItemStatus.Pending,
        },
      ],
    });
  };

  const removeActionItem = (index: number) => {
    setDraft({
      ...draft,
      actionItems: draft.actionItems.filter((_, i) => i !== index),
    });
  };

  const activeData = isEditing ? draft : meeting;

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {/* Top Action Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="button"
          onClick={onBackToHistory}
          className="inline-flex items-center gap-2 self-start text-sm font-medium text-[#475569] hover:text-[#0F2440] transition-colors whitespace-nowrap focus:outline-none focus-visible:underline"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          <span>Back to Meeting History</span>
        </button>

        <div className="flex flex-wrap items-center gap-2.5">
          {savedToast && (
            <span
              role="status"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700 mr-1"
            >
              <Check className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Changes saved</span>
            </span>
          )}

          {!isEditing ? (
            <>
              <button
                type="button"
                onClick={handleStartEdit}
                className="inline-flex h-10 items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 text-sm font-medium text-[#0F2440] shadow-2xs transition-colors hover:bg-slate-50 whitespace-nowrap shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
              >
                <Pencil className="h-4 w-4 text-[#475569]" aria-hidden="true" />
                <span>Edit</span>
              </button>

              <button
                type="button"
                onClick={() => exportMeetingToPdf(meeting)}
                className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#2563EB] px-4 text-sm font-medium text-white shadow-xs transition-colors hover:bg-[#1D4ED8] whitespace-nowrap shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
              >
                <Download className="h-4 w-4" aria-hidden="true" />
                <span>Download PDF</span>
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={handleCancelEdit}
                className="inline-flex h-10 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-4 text-sm font-medium text-[#475569] transition-colors hover:bg-slate-50 hover:text-[#0F2440] whitespace-nowrap shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
              >
                <X className="h-4 w-4" aria-hidden="true" />
                <span>Cancel</span>
              </button>

              <button
                type="button"
                onClick={handleSave}
                className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#2563EB] px-4 text-sm font-medium text-white shadow-xs transition-colors hover:bg-[#1D4ED8] whitespace-nowrap shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
              >
                <Save className="h-4 w-4" aria-hidden="true" />
                <span>Save</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Main Document Card */}
      <article className="rounded-xl border border-slate-200/80 bg-white shadow-[0_1px_3px_rgba(15,23,42,0.05)] divide-y divide-slate-200/80">
        {/* Document Header */}
        <header className="p-6 sm:p-8">
          {isEditing ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="sm:col-span-2">
                <label
                  htmlFor="edit-title"
                  className="block text-xs font-semibold text-[#475569]"
                >
                  Meeting Title
                </label>
                <input
                  id="edit-title"
                  type="text"
                  value={draft.title}
                  onChange={(e) => setDraft({ ...draft, title: e.target.value })}
                  className="mt-1.5 h-11 w-full rounded-lg border border-slate-200 bg-white px-3.5 font-display text-lg font-semibold text-[#0F2440] focus:border-[#2563EB] focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                />
              </div>
              <div>
                <label
                  htmlFor="edit-date"
                  className="block text-xs font-semibold text-[#475569]"
                >
                  Meeting Date
                </label>
                <input
                  id="edit-date"
                  type="date"
                  value={draft.date}
                  onChange={(e) => setDraft({ ...draft, date: e.target.value })}
                  className="mt-1.5 h-11 w-full rounded-lg border border-slate-200 bg-white px-3.5 text-sm text-[#0F2440] tabular-nums focus:border-[#2563EB] focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                />
              </div>
            </div>
          ) : (
            <div>
              <h1 className="font-display text-2xl font-bold tracking-tight text-[#0F2440] sm:text-3xl text-balance">
                {activeData.title}
              </h1>
              <div className="mt-3 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-sm text-[#475569] tabular-nums">
                <span className="font-medium text-[#0F2440]">
                  {formatMeetingDate(activeData.date)}
                </span>
                <span aria-hidden="true">·</span>
                <span>{activeData.durationMinutes} min</span>
                <span aria-hidden="true">·</span>
                <span>{activeData.participants.join(', ')}</span>
                <span aria-hidden="true">·</span>
                <span className="font-mono text-xs">{activeData.audioFileName}</span>
              </div>
            </div>
          )}
        </header>

        {/* Meeting Summary */}
        <section className="p-6 sm:p-8">
          <h2 className="font-display text-base font-semibold text-[#0F2440]">
            Meeting Summary
          </h2>
          {isEditing ? (
            <textarea
              rows={4}
              value={draft.summary}
              onChange={(e) => setDraft({ ...draft, summary: e.target.value })}
              className="mt-3 w-full rounded-lg border border-slate-200 bg-white p-3.5 text-sm leading-relaxed text-[#0F2440] focus:border-[#2563EB] focus:outline-none focus:ring-2 focus:ring-blue-600/20"
            />
          ) : (
            <p className="mt-3 max-w-[75ch] text-[15px] leading-relaxed text-[#1E293B]">
              {activeData.summary}
            </p>
          )}
        </section>

        {/* Key Discussion Points */}
        <section className="p-6 sm:p-8">
          <div className="flex items-center justify-between gap-4">
            <h2 className="font-display text-base font-semibold text-[#0F2440]">
              Key Discussion Points
            </h2>
            {isEditing && (
              <button
                type="button"
                onClick={() =>
                  setDraft({
                    ...draft,
                    keyDiscussionPoints: [...draft.keyDiscussionPoints, ''],
                  })
                }
                className="inline-flex h-8 items-center gap-1 rounded-md px-2.5 text-xs font-medium text-[#2563EB] hover:bg-[#EFF6FF]"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add point</span>
              </button>
            )}
          </div>

          {isEditing ? (
            <div className="mt-3 space-y-2.5">
              {draft.keyDiscussionPoints.map((point, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={point}
                    onChange={(e) => updatePoint(index, e.target.value)}
                    placeholder="Enter discussion point"
                    className="h-10 flex-1 rounded-lg border border-slate-200 bg-white px-3 text-sm text-[#0F2440] focus:border-[#2563EB] focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                  />
                  <button
                    type="button"
                    onClick={() => removePoint(index)}
                    aria-label="Remove discussion point"
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <ul className="mt-3 space-y-2.5">
              {activeData.keyDiscussionPoints.map((point, index) => (
                <li
                  key={index}
                  className="flex items-start gap-3 text-[15px] leading-relaxed text-[#1E293B]"
                >
                  <span
                    className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#2563EB]"
                    aria-hidden="true"
                  />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Important Decisions */}
        <section className="p-6 sm:p-8">
          <div className="flex items-center justify-between gap-4">
            <h2 className="font-display text-base font-semibold text-[#0F2440]">
              Important Decisions
            </h2>
            {isEditing && (
              <button
                type="button"
                onClick={() =>
                  setDraft({
                    ...draft,
                    importantDecisions: [...draft.importantDecisions, ''],
                  })
                }
                className="inline-flex h-8 items-center gap-1 rounded-md px-2.5 text-xs font-medium text-[#2563EB] hover:bg-[#EFF6FF]"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add decision</span>
              </button>
            )}
          </div>

          {isEditing ? (
            <div className="mt-3 space-y-2.5">
              {draft.importantDecisions.map((decision, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={decision}
                    onChange={(e) => updateDecision(index, e.target.value)}
                    placeholder="Enter decision"
                    className="h-10 flex-1 rounded-lg border border-slate-200 bg-white px-3 text-sm text-[#0F2440] focus:border-[#2563EB] focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                  />
                  <button
                    type="button"
                    onClick={() => removeDecision(index)}
                    aria-label="Remove decision"
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <ol className="mt-3 space-y-3">
              {activeData.importantDecisions.map((decision, index) => (
                <li
                  key={index}
                  className="flex items-start gap-3 text-[15px] leading-relaxed text-[#1E293B]"
                >
                  <span className="mt-0.5 font-mono text-xs font-semibold text-[#2563EB] tabular-nums">
                    {String(index + 1).padStart(2, '0')}.
                  </span>
                  <span>{decision}</span>
                </li>
              ))}
            </ol>
          )}
        </section>

        {/* Action Items Table */}
        <section className="p-6 sm:p-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="font-display text-base font-semibold text-[#0F2440]">
                Action Items
              </h2>
              <p className="mt-0.5 text-xs text-[#475569]">
                Assigned deliverables, owners, target deadlines, and current status
              </p>
            </div>
            {isEditing && (
              <button
                type="button"
                onClick={addActionItem}
                className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-blue-200 bg-[#EFF6FF] px-3 text-xs font-medium text-[#1D4ED8] hover:bg-blue-100/70 whitespace-nowrap"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add Action Item</span>
              </button>
            )}
          </div>

          {activeData.actionItems.length === 0 ? (
            <p className="mt-4 text-sm text-[#475569]">
              No action items recorded for this meeting.
            </p>
          ) : (
            <>
              {/* Desktop & Tablet Table */}
              <div className="mt-4 hidden overflow-x-auto rounded-lg border border-slate-200/80 md:block">
                <table className="w-full border-collapse text-left">
                  <thead>
                    <tr className="border-b border-slate-200/80 bg-[#F8FAFC] text-xs font-semibold text-[#475569]">
                      <th scope="col" className="py-3 pl-4 pr-3">
                        Task
                      </th>
                      <th scope="col" className="px-3 py-3">
                        Assigned Person
                      </th>
                      <th scope="col" className="px-3 py-3">
                        Deadline
                      </th>
                      <th scope="col" className="py-3 pl-3 pr-4">
                        Status
                      </th>
                      {isEditing && (
                        <th scope="col" className="py-3 pr-4 text-right">
                          <span className="sr-only">Remove</span>
                        </th>
                      )}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200/70 text-sm">
                    {activeData.actionItems.map((item, idx) => (
                      <tr key={item.id} className="hover:bg-[#F8FAFC]/70">
                        <td className="py-3 pl-4 pr-3 text-[#0F2440]">
                          {isEditing ? (
                            <input
                              type="text"
                              value={item.task}
                              onChange={(e) =>
                                updateActionItem(idx, 'task', e.target.value)
                              }
                              placeholder="Describe task"
                              className="h-9 w-full min-w-[220px] rounded-md border border-slate-200 bg-white px-2.5 text-sm text-[#0F2440] focus:border-[#2563EB] focus:outline-none"
                            />
                          ) : (
                            <span className="font-medium">{item.task}</span>
                          )}
                        </td>
                        <td className="px-3 py-3 text-[#475569] whitespace-nowrap">
                          {isEditing ? (
                            <input
                              type="text"
                              value={item.assignedTo}
                              onChange={(e) =>
                                updateActionItem(idx, 'assignedTo', e.target.value)
                              }
                              placeholder="Assignee"
                              className="h-9 w-36 rounded-md border border-slate-200 bg-white px-2.5 text-sm text-[#0F2440] focus:border-[#2563EB] focus:outline-none"
                            />
                          ) : (
                            item.assignedTo
                          )}
                        </td>
                        <td className="px-3 py-3 text-[#475569] tabular-nums whitespace-nowrap">
                          {isEditing ? (
                            <input
                              type="date"
                              value={item.deadline}
                              onChange={(e) =>
                                updateActionItem(idx, 'deadline', e.target.value)
                              }
                              className="h-9 rounded-md border border-slate-200 bg-white px-2.5 text-sm text-[#0F2440] tabular-nums focus:border-[#2563EB] focus:outline-none"
                            />
                          ) : (
                            formatMeetingDate(item.deadline)
                          )}
                        </td>
                        <td className="py-3 pl-3 pr-4 whitespace-nowrap">
                          {isEditing ? (
                            <select
                              value={item.status}
                              onChange={(e) =>
                                updateActionItem(
                                  idx,
                                  'status',
                                  e.target.value as ActionItemStatus
                                )
                              }
                              className="h-9 rounded-md border border-slate-200 bg-white px-2.5 text-xs font-medium text-[#0F2440] focus:border-[#2563EB] focus:outline-none"
                            >
                              <option value={ActionItemStatus.Pending}>Pending</option>
                              <option value={ActionItemStatus.InProgress}>
                                In Progress
                              </option>
                              <option value={ActionItemStatus.Completed}>
                                Completed
                              </option>
                            </select>
                          ) : (
                            <div className="flex items-center gap-2">
                              <StatusLabel status={item.status} />
                              <select
                                aria-label={`Update status for ${item.task}`}
                                value={item.status}
                                onChange={(e) =>
                                  handleQuickStatusChange(
                                    item.id,
                                    e.target.value as ActionItemStatus
                                  )
                                }
                                className="h-7 rounded border border-slate-200 bg-white px-1.5 text-xs text-[#475569] hover:border-slate-300 focus:border-[#2563EB] focus:outline-none"
                              >
                                <option value={ActionItemStatus.Pending}>Pending</option>
                                <option value={ActionItemStatus.InProgress}>
                                  In Progress
                                </option>
                                <option value={ActionItemStatus.Completed}>
                                  Completed
                                </option>
                              </select>
                            </div>
                          )}
                        </td>
                        {isEditing && (
                          <td className="py-3 pr-4 text-right">
                            <button
                              type="button"
                              onClick={() => removeActionItem(idx)}
                              aria-label="Remove action item"
                              className="inline-flex h-8 w-8 items-center justify-center rounded-md text-slate-400 hover:bg-red-50 hover:text-red-600"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Action Items Stack */}
              <div className="mt-4 space-y-3 md:hidden">
                {activeData.actionItems.map((item, idx) => (
                  <div
                    key={item.id}
                    className="rounded-lg border border-slate-200/80 bg-[#F8FAFC] p-3.5"
                  >
                    {isEditing ? (
                      <div className="space-y-2.5">
                        <input
                          type="text"
                          value={item.task}
                          onChange={(e) =>
                            updateActionItem(idx, 'task', e.target.value)
                          }
                          placeholder="Task description"
                          className="h-9 w-full rounded-md border border-slate-200 bg-white px-2.5 text-sm text-[#0F2440]"
                        />
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="text"
                            value={item.assignedTo}
                            onChange={(e) =>
                              updateActionItem(idx, 'assignedTo', e.target.value)
                            }
                            placeholder="Assigned to"
                            className="h-9 rounded-md border border-slate-200 bg-white px-2.5 text-xs text-[#0F2440]"
                          />
                          <input
                            type="date"
                            value={item.deadline}
                            onChange={(e) =>
                              updateActionItem(idx, 'deadline', e.target.value)
                            }
                            className="h-9 rounded-md border border-slate-200 bg-white px-2.5 text-xs text-[#0F2440] tabular-nums"
                          />
                        </div>
                        <div className="flex items-center justify-between gap-2">
                          <select
                            value={item.status}
                            onChange={(e) =>
                              updateActionItem(
                                idx,
                                'status',
                                e.target.value as ActionItemStatus
                              )
                            }
                            className="h-9 flex-1 rounded-md border border-slate-200 bg-white px-2.5 text-xs font-medium text-[#0F2440]"
                          >
                            <option value={ActionItemStatus.Pending}>Pending</option>
                            <option value={ActionItemStatus.InProgress}>
                              In Progress
                            </option>
                            <option value={ActionItemStatus.Completed}>
                              Completed
                            </option>
                          </select>
                          <button
                            type="button"
                            onClick={() => removeActionItem(idx)}
                            aria-label="Remove action item"
                            className="flex h-9 w-9 items-center justify-center rounded-md border border-slate-200 bg-white text-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <p className="text-sm font-medium text-[#0F2440]">
                          {item.task}
                        </p>
                        <p className="mt-1 text-xs text-[#475569] tabular-nums">
                          {item.assignedTo} · Due {formatMeetingDate(item.deadline)}
                        </p>
                        <div className="mt-2.5 flex items-center justify-between gap-2">
                          <StatusLabel status={item.status} />
                          <select
                            aria-label={`Update status for ${item.task}`}
                            value={item.status}
                            onChange={(e) =>
                              handleQuickStatusChange(
                                item.id,
                                e.target.value as ActionItemStatus
                              )
                            }
                            className="h-8 rounded border border-slate-200 bg-white px-2 text-xs text-[#475569]"
                          >
                            <option value={ActionItemStatus.Pending}>Pending</option>
                            <option value={ActionItemStatus.InProgress}>
                              In Progress
                            </option>
                            <option value={ActionItemStatus.Completed}>
                              Completed
                            </option>
                          </select>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
        </section>
      </article>
    </div>
  );
}

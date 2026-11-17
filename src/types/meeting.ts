export enum NavPage {
  Dashboard = 'dashboard',
  Upload = 'upload',
  History = 'history',
  Minutes = 'minutes',
  Settings = 'settings',
}

export enum ActionItemStatus {
  Pending = 'Pending',
  InProgress = 'In Progress',
  Completed = 'Completed',
}

export interface ActionItem {
  id: string;
  task: string;
  assignedTo: string;
  deadline: string;
  status: ActionItemStatus;
}

export interface MeetingRecord {
  id: string;
  title: string;
  date: string;
  durationMinutes: number;
  timeSavedMinutes: number;
  audioFileName: string;
  participants: string[];
  summary: string;
  keyDiscussionPoints: string[];
  importantDecisions: string[];
  actionItems: ActionItem[];
  updatedAt: string;
}

export type SummaryDepth = 'Concise' | 'Balanced' | 'Detailed';

export interface WorkspaceSettings {
  userName: string;
  userRole: string;
  workspaceName: string;
  summaryDepth: SummaryDepth;
  includeSpeakerNames: boolean;
  autoExtractActionItems: boolean;
}

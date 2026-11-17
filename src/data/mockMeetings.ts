import { ActionItemStatus, MeetingRecord, WorkspaceSettings } from '../types/meeting';

export const INITIAL_SETTINGS: WorkspaceSettings = {
  userName: 'Maya Patel',
  userRole: 'Senior Product Manager',
  workspaceName: 'Northstar Product Ops',
  summaryDepth: 'Balanced',
  includeSpeakerNames: true,
  autoExtractActionItems: true,
};

export const INITIAL_MEETINGS: MeetingRecord[] = [
  {
    id: 'mtg-101',
    title: 'Q4 Product Roadmap & Release Readiness',
    date: '2026-11-16',
    durationMinutes: 48,
    timeSavedMinutes: 38,
    audioFileName: 'q4_roadmap_readiness_sync.wav',
    participants: ['Maya Patel', 'Daniel Kim', 'Elena Rostova', 'Marcus Vance'],
    summary:
      'The product, engineering, and design leads reviewed milestone completion for the Q4 enterprise release. Core onboarding flows and role-based permissions are code-complete, while automated billing webhooks require an additional five days of integration testing before general availability.',
    keyDiscussionPoints: [
      'Reviewed QA pass rates across 142 automated end-to-end tests, currently standing at 98.6% stability.',
      'Evaluated customer pilot feedback from three beta accounts regarding workspace switching latency.',
      'Assessed documentation readiness for the public API changelog and migration checklist.',
      'Discussed phased rollout schedule starting with 25% of annual accounts on December 1.',
    ],
    importantDecisions: [
      'Shift general availability launch date from November 25 to December 2 to complete webhook stress testing.',
      'Approve the streamlined two-step team invitation modal for the initial Q4 release.',
      'Assign dedicated support engineering coverage during the first 72 hours of rollout.',
    ],
    actionItems: [
      {
        id: 'ai-101-1',
        task: 'Complete Stripe webhook retry load tests in staging environment',
        assignedTo: 'Daniel Kim',
        deadline: '2026-11-22',
        status: ActionItemStatus.InProgress,
      },
      {
        id: 'ai-101-2',
        task: 'Publish updated workspace migration guide to help center',
        assignedTo: 'Elena Rostova',
        deadline: '2026-11-26',
        status: ActionItemStatus.Pending,
      },
      {
        id: 'ai-101-3',
        task: 'Finalize phased rollout cohort list for beta customers',
        assignedTo: 'Maya Patel',
        deadline: '2026-11-20',
        status: ActionItemStatus.Completed,
      },
      {
        id: 'ai-101-4',
        task: 'Configure pager rotation for December launch weekend',
        assignedTo: 'Marcus Vance',
        deadline: '2026-11-28',
        status: ActionItemStatus.Pending,
      },
    ],
    updatedAt: '2026-11-16T15:30:00Z',
  },
  {
    id: 'mtg-102',
    title: 'Client Onboarding Workshop — Meridian Health',
    date: '2026-11-14',
    durationMinutes: 36,
    timeSavedMinutes: 29,
    audioFileName: 'meridian_onboarding_call.mp3',
    participants: ['Maya Patel', 'Claire Bennett', 'Dr. Samuel Osei'],
    summary:
      'Conducted the kickoff workshop with Meridian Health operations leadership to align on data import formats, single sign-on requirements, and staff training timelines ahead of their January department rollout.',
    keyDiscussionPoints: [
      'Clarified SAML 2.0 identity provider configuration with Meridian IT security team.',
      'Walked through CSV schema validation rules for importing 1,400 existing clinician profiles.',
      'Reviewed training session formats preferred by clinical coordinators across four regional clinics.',
    ],
    importantDecisions: [
      'Use Okta SAML integration in sandbox first, targeting production sign-off by December 5.',
      'Deliver two live 45-minute recorded training sessions tailored for clinic administrators.',
    ],
    actionItems: [
      {
        id: 'ai-102-1',
        task: 'Share SAML metadata XML and ACS endpoint URL with Meridian IT',
        assignedTo: 'Claire Bennett',
        deadline: '2026-11-18',
        status: ActionItemStatus.Completed,
      },
      {
        id: 'ai-102-2',
        task: 'Prepare sanitized sample CSV template for clinician directory import',
        assignedTo: 'Maya Patel',
        deadline: '2026-11-21',
        status: ActionItemStatus.InProgress,
      },
      {
        id: 'ai-102-3',
        task: 'Confirm regional training dates with clinic leads',
        assignedTo: 'Dr. Samuel Osei',
        deadline: '2026-11-24',
        status: ActionItemStatus.Pending,
      },
    ],
    updatedAt: '2026-11-14T11:15:00Z',
  },
  {
    id: 'mtg-103',
    title: 'Capstone Research Group — Thesis Literature Review',
    date: '2026-11-11',
    durationMinutes: 54,
    timeSavedMinutes: 42,
    audioFileName: 'capstone_lit_review_nov11.mp3',
    participants: ['Maya Patel', 'Liam Chen', 'Priya Nair', 'Prof. Alan Mercer'],
    summary:
      'Academic working session reviewing 18 peer-reviewed papers on distributed edge caching and acoustic signal compression. The group narrowed the experimental baseline and agreed on evaluation benchmarks for chapter three.',
    keyDiscussionPoints: [
      'Compared latency-versus-memory trade-offs across three benchmark datasets.',
      'Identified gaps in baseline citations for low-power ARM microcontroller inference.',
      'Reviewed IRB exemption paperwork and raw dataset anonymization protocol.',
    ],
    importantDecisions: [
      'Standardize all ablation experiments on the 2025 AudioBench-Lite corpus.',
      'Submit combined methodology draft to Prof. Mercer two weeks before final defense review.',
    ],
    actionItems: [
      {
        id: 'ai-103-1',
        task: 'Synthesize comparison matrix for Section 2.3 related work',
        assignedTo: 'Priya Nair',
        deadline: '2026-11-19',
        status: ActionItemStatus.Completed,
      },
      {
        id: 'ai-103-2',
        task: 'Run baseline inference benchmarks on Raspberry Pi 5 testbed',
        assignedTo: 'Liam Chen',
        deadline: '2026-11-23',
        status: ActionItemStatus.InProgress,
      },
    ],
    updatedAt: '2026-11-11T16:45:00Z',
  },
  {
    id: 'mtg-104',
    title: 'Weekly Marketing & Demand Gen Alignment',
    date: '2026-11-08',
    durationMinutes: 32,
    timeSavedMinutes: 25,
    audioFileName: 'marketing_alignment_w45.wav',
    participants: ['Hannah Brooks', 'Jordan Alvarez', 'Maya Patel'],
    summary:
      'Reviewed October webinar conversion metrics, organic search growth on comparison landing pages, and creative deliverables for the upcoming winter product announcement campaign.',
    keyDiscussionPoints: [
      'Webinar attendance grew 22% month-over-month with a 34% follow-up demo request rate.',
      'Analyzed top-performing customer case studies driving enterprise inbound leads.',
      'Aligned product messaging around automated action-item tracking for project teams.',
    ],
    importantDecisions: [
      'Reallocate 15% of paid social budget toward high-intent search terms for meeting workflows.',
      'Feature two customer ROI spotlights in the December product newsletter.',
    ],
    actionItems: [
      {
        id: 'ai-104-1',
        task: 'Draft landing page copy for team collaboration workflows',
        assignedTo: 'Hannah Brooks',
        deadline: '2026-11-15',
        status: ActionItemStatus.Completed,
      },
      {
        id: 'ai-104-2',
        task: 'Approve updated Q4 webinar slide deck and speaker notes',
        assignedTo: 'Jordan Alvarez',
        deadline: '2026-11-19',
        status: ActionItemStatus.Completed,
      },
    ],
    updatedAt: '2026-11-08T14:00:00Z',
  },
  {
    id: 'mtg-105',
    title: 'Design System Accessibility Audit Review',
    date: '2026-11-04',
    durationMinutes: 41,
    timeSavedMinutes: 33,
    audioFileName: 'a11y_audit_design_sync.mp3',
    participants: ['Elena Rostova', 'Daniel Kim', 'Maya Patel'],
    summary:
      'Audited keyboard navigation, focus ring contrast, and screen-reader ARIA announcements across core dashboard tables and modal drawers to ensure full WCAG 2.1 AA compliance.',
    keyDiscussionPoints: [
      'Identified low-contrast placeholder text in secondary filter inputs.',
      'Tested VoiceOver and NVDA tab order inside the action items editing table.',
      'Standardized focus-visible outline tokens across buttons and navigation links.',
    ],
    importantDecisions: [
      'Adopt #475569 as minimum secondary text color on white surfaces to guarantee 7:1 contrast.',
      'Add explicit aria-live status announcements when saving edited meeting minutes.',
    ],
    actionItems: [
      {
        id: 'ai-105-1',
        task: 'Update focus ring and contrast tokens in design system library',
        assignedTo: 'Elena Rostova',
        deadline: '2026-11-12',
        status: ActionItemStatus.Completed,
      },
      {
        id: 'ai-105-2',
        task: 'Verify keyboard trap prevention across mobile navigation drawer',
        assignedTo: 'Daniel Kim',
        deadline: '2026-11-18',
        status: ActionItemStatus.InProgress,
      },
    ],
    updatedAt: '2026-11-04T10:20:00Z',
  },
];

export function generateSimulatedMeetingRecord(params: {
  title: string;
  date: string;
  audioFileName: string;
  fileSizeBytes: number;
  defaultOwner: string;
}): MeetingRecord {
  const { title, date, audioFileName, fileSizeBytes, defaultOwner } = params;
  const cleanTitle = title.trim() || 'Team Strategy & Planning Sync';
  // Estimate realistic meeting duration between 24 and 58 minutes from file size
  const mb = Math.max(1, fileSizeBytes / (1024 * 1024));
  const durationMinutes = Math.min(65, Math.max(22, Math.round(20 + mb * 2.5)));
  const timeSavedMinutes = Math.round(durationMinutes * 0.78);

  const baseDate = new Date(`${date}T12:00:00`);
  const addDays = (days: number): string => {
    const next = new Date(baseDate);
    next.setDate(next.getDate() + days);
    return next.toISOString().split('T')[0];
  };

  const id = `mtg-${Date.now()}`;

  return {
    id,
    title: cleanTitle,
    date,
    durationMinutes,
    timeSavedMinutes,
    audioFileName,
    participants: [defaultOwner, 'Daniel Kim', 'Elena Rostova', 'Jordan Alvarez'],
    summary: `Structured summary generated from "${audioFileName}" for "${cleanTitle}". Participants reviewed current project milestones, addressed cross-functional dependencies, and established clear ownership and target deadlines for upcoming deliverables.`,
    keyDiscussionPoints: [
      `Evaluated current progress and scope priorities for ${cleanTitle}.`,
      'Reviewed timeline risks, resource allocation, and cross-team handoff checkpoints.',
      'Aligned on quality benchmarks and documentation updates required prior to the next milestone.',
      'Confirmed communication cadence for stakeholder updates and weekly check-ins.',
    ],
    importantDecisions: [
      `Lock primary deliverable scope for ${cleanTitle} and freeze non-essential changes until review.`,
      'Centralize action item tracking and status updates within the shared workspace.',
      'Schedule a 20-minute follow-up review to verify milestone sign-off.',
    ],
    actionItems: [
      {
        id: `${id}-ai-1`,
        task: `Distribute finalized ${cleanTitle} brief and timeline to stakeholders`,
        assignedTo: defaultOwner,
        deadline: addDays(3),
        status: ActionItemStatus.Pending,
      },
      {
        id: `${id}-ai-2`,
        task: 'Complete technical feasibility and dependency verification checklist',
        assignedTo: 'Daniel Kim',
        deadline: addDays(5),
        status: ActionItemStatus.InProgress,
      },
      {
        id: `${id}-ai-3`,
        task: 'Prepare review deck and updated metrics summary for next sync',
        assignedTo: 'Elena Rostova',
        deadline: addDays(7),
        status: ActionItemStatus.Pending,
      },
    ],
    updatedAt: new Date().toISOString(),
  };
}

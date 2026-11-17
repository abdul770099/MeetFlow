import { jsPDF } from 'jspdf';
import { MeetingRecord } from '../types/meeting';

export function formatMeetingDate(dateStr: string): string {
  const parsed = new Date(`${dateStr}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return dateStr;
  return parsed.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function exportMeetingToPdf(meeting: MeetingRecord): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'pt',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 48;
  const contentWidth = pageWidth - margin * 2;
  let y = 52;

  const ensureSpace = (needed: number) => {
    if (y + needed > pageHeight - 54) {
      doc.addPage();
      y = 52;
    }
  };

  // Header brand bar
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(37, 99, 235); // #2563EB
  doc.text('MEETFLOW AI  ·  MEETING MINUTES', margin, y);
  y += 22;

  // Meeting Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.setTextColor(15, 36, 64); // #0F2440 Navy
  const titleLines = doc.splitTextToSize(meeting.title, contentWidth);
  doc.text(titleLines, margin, y);
  y += titleLines.length * 24 + 4;

  // Metadata line
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(71, 85, 105);
  const metaText = `${formatMeetingDate(meeting.date)}  ·  ${meeting.durationMinutes} min  ·  Source: ${meeting.audioFileName}`;
  doc.text(metaText, margin, y);
  y += 16;

  if (meeting.participants.length > 0) {
    const participantsLines = doc.splitTextToSize(
      `Participants: ${meeting.participants.join(', ')}`,
      contentWidth
    );
    doc.text(participantsLines, margin, y);
    y += participantsLines.length * 14 + 6;
  }

  // Divider
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(1);
  doc.line(margin, y, pageWidth - margin, y);
  y += 24;

  // Section helper
  const drawSectionHeading = (heading: string) => {
    ensureSpace(36);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(15, 36, 64);
    doc.text(heading, margin, y);
    y += 18;
  };

  // Summary
  drawSectionHeading('Meeting Summary');
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10.5);
  doc.setTextColor(30, 41, 59);
  const summaryLines = doc.splitTextToSize(meeting.summary, contentWidth);
  ensureSpace(summaryLines.length * 15 + 16);
  doc.text(summaryLines, margin, y);
  y += summaryLines.length * 15 + 20;

  // Key Discussion Points
  drawSectionHeading('Key Discussion Points');
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10.5);
  doc.setTextColor(30, 41, 59);
  meeting.keyDiscussionPoints.forEach((point) => {
    const wrapped = doc.splitTextToSize(point, contentWidth - 16);
    ensureSpace(wrapped.length * 15 + 8);
    doc.setTextColor(37, 99, 235);
    doc.text('•', margin + 2, y);
    doc.setTextColor(30, 41, 59);
    doc.text(wrapped, margin + 16, y);
    y += wrapped.length * 15 + 6;
  });
  y += 12;

  // Important Decisions
  drawSectionHeading('Important Decisions');
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10.5);
  meeting.importantDecisions.forEach((decision, index) => {
    const wrapped = doc.splitTextToSize(decision, contentWidth - 20);
    ensureSpace(wrapped.length * 15 + 8);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(37, 99, 235);
    doc.text(`${index + 1}.`, margin, y);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(30, 41, 59);
    doc.text(wrapped, margin + 20, y);
    y += wrapped.length * 15 + 6;
  });
  y += 16;

  // Action Items Table
  drawSectionHeading('Action Items');
  ensureSpace(50);

  const colTask = margin;
  const colOwner = margin + 250;
  const colDeadline = margin + 365;
  const colStatus = margin + 445;

  // Table header
  doc.setFillColor(239, 246, 255); // Light blue #EFF6FF
  doc.rect(margin, y - 12, contentWidth, 24, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(15, 36, 64);
  doc.text('Task', colTask + 8, y + 3);
  doc.text('Assigned To', colOwner, y + 3);
  doc.text('Deadline', colDeadline, y + 3);
  doc.text('Status', colStatus, y + 3);
  y += 22;

  meeting.actionItems.forEach((item) => {
    const taskLines = doc.splitTextToSize(item.task, 234);
    const rowHeight = Math.max(24, taskLines.length * 14 + 10);
    ensureSpace(rowHeight + 6);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor(30, 41, 59);
    doc.text(taskLines, colTask + 8, y);
    doc.text(item.assignedTo, colOwner, y);
    doc.text(formatMeetingDate(item.deadline), colDeadline, y);
    doc.text(item.status, colStatus, y);

    const lineY = y + rowHeight - 10;
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.5);
    doc.line(margin, lineY, pageWidth - margin, lineY);
    y += rowHeight;
  });

  const safeFileName = meeting.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_|_$/g, '');
  doc.save(`${safeFileName || 'meeting_minutes'}.pdf`);
}

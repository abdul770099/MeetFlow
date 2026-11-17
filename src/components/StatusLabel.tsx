import { CheckCircle2, Clock, CircleDot } from 'lucide-react';
import { ActionItemStatus } from '../types/meeting';

interface StatusLabelProps {
  status: ActionItemStatus;
}

export function StatusLabel({ status }: StatusLabelProps) {
  if (status === ActionItemStatus.Completed) {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700 whitespace-nowrap">
        <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-600" aria-hidden="true" />
        <span>Completed</span>
      </span>
    );
  }

  if (status === ActionItemStatus.InProgress) {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#1D4ED8] whitespace-nowrap">
        <Clock className="h-3.5 w-3.5 shrink-0 text-[#2563EB]" aria-hidden="true" />
        <span>In Progress</span>
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-700 whitespace-nowrap">
      <CircleDot className="h-3.5 w-3.5 shrink-0 text-amber-600" aria-hidden="true" />
      <span>Pending</span>
    </span>
  );
}

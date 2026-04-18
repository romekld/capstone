import {
  AlertTriangleIcon,
  CheckCircle2Icon,
  CircleIcon,
  ClipboardCheckIcon,
  FileWarningIcon,
  HistoryIcon,
  RotateCcwIcon,
} from 'lucide-react'
import type { CityBarangayImportAction } from './schema'

export const scopeOptions = [
  {
    label: 'In CHO2 scope',
    value: 'in_scope',
    icon: CheckCircle2Icon,
  },
  {
    label: 'Outside scope',
    value: 'outside_scope',
    icon: CircleIcon,
  },
]

export const importActionOptions: {
  label: string
  value: CityBarangayImportAction
  icon: React.ComponentType<{ className?: string }>
}[] = [
  {
    label: 'Ready to create',
    value: 'create',
    icon: ClipboardCheckIcon,
  },
  {
    label: 'Needs review',
    value: 'review_required',
    icon: HistoryIcon,
  },
  {
    label: 'Will overwrite',
    value: 'overwrite',
    icon: RotateCcwIcon,
  },
  {
    label: 'Skipped',
    value: 'skip',
    icon: CircleIcon,
  },
  {
    label: 'Invalid geometry',
    value: 'invalid',
    icon: FileWarningIcon,
  },
  {
    label: 'Committed',
    value: 'committed',
    icon: CheckCircle2Icon,
  },
]

export const validityOptions = [
  {
    label: 'Current',
    value: 'current',
    icon: CheckCircle2Icon,
  },
  {
    label: 'Has valid-to date',
    value: 'has_valid_to',
    icon: AlertTriangleIcon,
  },
]


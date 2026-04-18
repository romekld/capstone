'use client'

import dynamic from 'next/dynamic'
import { Skeleton } from '@/components/ui/skeleton'
import type {
  CityBarangayImportItem,
  CityBarangayRegistryRecord,
} from '../data/schema'

const RegistryMapCanvas = dynamic(
  () =>
    import('./registry-map-canvas').then((module) => module.RegistryMapCanvas),
  {
    ssr: false,
    loading: () => <Skeleton className='h-full min-h-[520px] w-full' />,
  }
)

type RegistryMapPanelProps = {
  records: CityBarangayRegistryRecord[]
  selectedPcode: string | null
  previewItem: CityBarangayImportItem | null
  onSelectPcode: (pcode: string) => void
  onOpenHistory: (record: CityBarangayRegistryRecord) => void
}

export function RegistryMapPanel({
  records,
  selectedPcode,
  previewItem,
  onSelectPcode,
  onOpenHistory,
}: RegistryMapPanelProps) {
  return (
    <RegistryMapCanvas
      onOpenHistory={onOpenHistory}
      onSelectPcode={onSelectPcode}
      previewItem={previewItem}
      records={records}
      selectedPcode={selectedPcode}
    />
  )
}

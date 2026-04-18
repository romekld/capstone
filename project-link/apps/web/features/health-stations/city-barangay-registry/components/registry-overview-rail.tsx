import { FileJsonIcon, MapPinnedIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import type {
  CityBarangayPageMode,
  CityBarangayRegistryRecord,
  CityBarangayRegistryStats,
} from '../data/schema'
import { formatArea, formatCompactNumber, formatDate } from '../data/formatters'
import { SelectedBarangayCard } from './selected-barangay-card'

type RegistryOverviewRailProps = {
  stats: CityBarangayRegistryStats
  selectedRecord: CityBarangayRegistryRecord | null
  mode: CityBarangayPageMode
  onShowImport: () => void
}

export function RegistryOverviewRail({
  stats,
  selectedRecord,
  mode,
  onShowImport,
}: RegistryOverviewRailProps) {
  const scopePercent =
    stats.totalBarangays > 0
      ? Math.round((stats.inCho2Scope / stats.totalBarangays) * 100)
      : 0

  return (
    <aside className='flex flex-col gap-3 pb-4 xl:sticky xl:top-4 xl:max-h-[calc(100svh-6rem)] xl:self-start xl:overflow-y-auto'>
      <Card size='sm'>
        <CardHeader>
          <CardTitle>City Barangay Registry</CardTitle>
          <CardDescription>
            Canonical Dasmarinas boundaries and staged GeoJSON imports.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {mode === 'admin' ? (
            <Button className='h-11 w-full' onClick={onShowImport}>
              <FileJsonIcon data-icon='inline-start' />
              Import review
            </Button>
          ) : (
            <Button className='h-11 w-full' disabled variant='outline'>
              <MapPinnedIcon data-icon='inline-start' />
              Read-only registry
            </Button>
          )}
        </CardContent>
      </Card>

      <Card size='sm'>
        <CardHeader>
          <CardTitle>Registry Overview</CardTitle>
          <CardDescription>Master boundary coverage.</CardDescription>
        </CardHeader>
        <CardContent>
          <dl className='grid gap-2 text-sm'>
            <RailRow
              label='City barangays'
              value={formatCompactNumber(stats.totalBarangays)}
            />
            <RailRow
              label='In CHO2 scope'
              value={formatCompactNumber(stats.inCho2Scope)}
            />
            <RailRow
              label='Outside scope'
              value={formatCompactNumber(stats.outsideCho2Scope)}
            />
            <RailRow label='CHO2 coverage' value={`${scopePercent}%`} />
          </dl>
        </CardContent>
      </Card>

      <Card size='sm'>
        <CardHeader>
          <CardTitle>Geometry Source</CardTitle>
          <CardDescription>GeoJSON source metadata.</CardDescription>
        </CardHeader>
        <CardContent>
          <dl className='grid gap-2 text-sm'>
            <RailRow label='Source date' value={formatDate(stats.sourceDate)} />
            <RailRow label='Valid on' value={formatDate(stats.validOn)} />
            <RailRow
              label='Total area'
              value={formatArea(stats.totalAreaSqKm)}
            />
            <RailRow
              label='Latest update'
              value={formatDate(stats.latestUpdatedAt)}
            />
          </dl>
        </CardContent>
      </Card>

      <SelectedBarangayCard
        record={selectedRecord}
      />
    </aside>
  )
}

function RailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className='flex items-center justify-between gap-3'>
      <dt className='text-muted-foreground'>{label}</dt>
      <dd className='text-right font-mono font-medium tabular-nums'>{value}</dd>
    </div>
  )
}

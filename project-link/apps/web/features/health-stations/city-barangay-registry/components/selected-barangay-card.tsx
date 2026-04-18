import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import type { CityBarangayRegistryRecord } from '../data/schema'
import { formatArea, formatDate } from '../data/formatters'
import { ScopeBadge } from './scope-badge'

type SelectedBarangayCardProps = {
  record: CityBarangayRegistryRecord | null
}

export function SelectedBarangayCard({ record }: SelectedBarangayCardProps) {
  return (
    <Card size='sm'>
      <CardHeader>
        <CardTitle>Selected Barangay</CardTitle>
        <CardDescription>Compact active polygon summary.</CardDescription>
      </CardHeader>
      <CardContent>
        {record ? (
          <div className='flex flex-col gap-3'>
            <div className='flex items-start justify-between gap-3'>
              <div className='min-w-0'>
                <p className='font-medium'>{record.name}</p>
                <p className='font-mono text-xs text-muted-foreground'>
                  {record.pcode}
                </p>
              </div>
              <ScopeBadge inCho2Scope={record.inCho2Scope} />
            </div>

            <Separator />

            <dl className='grid gap-2 text-sm'>
              <div className='flex items-center justify-between gap-3'>
                <dt className='text-muted-foreground'>Source FID</dt>
                <dd className='font-mono tabular-nums'>{record.sourceFid}</dd>
              </div>
              <div className='flex items-center justify-between gap-3'>
                <dt className='text-muted-foreground'>Valid on</dt>
                <dd>{formatDate(record.sourceValidOn)}</dd>
              </div>
              <div className='flex items-center justify-between gap-3'>
                <dt className='text-muted-foreground'>Area</dt>
                <dd className='font-mono tabular-nums'>
                  {formatArea(record.sourceAreaSqKm)}
                </dd>
              </div>
            </dl>
          </div>
        ) : (
          <p className='text-sm text-muted-foreground'>
            Select a barangay from the map or table to inspect its source
            metadata.
          </p>
        )}
      </CardContent>
    </Card>
  )
}

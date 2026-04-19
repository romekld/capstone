'use client'

import { useMemo, useState } from 'react'
import { BadgeCheck, HistoryIcon, XIcon } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { GisMapPopup } from '@/features/gis-map/components/gis-map-popup'
import { GisMapShell } from '@/features/gis-map/components/gis-map-shell'
import type {
  GisMapPopupState,
  GisPolygonFeatureCollection,
} from '@/features/gis-map/data/types'
import type {
  CityBarangayImportItem,
  CityBarangayRegistryRecord,
} from '../data/schema'
import { formatArea, formatDate, formatScope } from '../data/formatters'
import { toRegistryFeatureCollection } from '../data/geojson'

type RegistryMapCanvasProps = {
  records: CityBarangayRegistryRecord[]
  selectedPcode: string | null
  previewItem: CityBarangayImportItem | null
  onSelectPcode: (pcode: string) => void
  onOpenHistory: (record: CityBarangayRegistryRecord) => void
}

export function RegistryMapCanvas({
  records,
  selectedPcode,
  previewItem,
  onSelectPcode,
  onOpenHistory,
}: RegistryMapCanvasProps) {
  const [popup, setPopup] = useState<GisMapPopupState | null>(null)

  const featureCollection = useMemo(
    () =>
      toRegistryFeatureCollection(records) as unknown as GisPolygonFeatureCollection,
    [records]
  )

  const selectedRecord = useMemo(
    () => records.find((record) => record.pcode === selectedPcode) ?? null,
    [records, selectedPcode]
  )

  const selectedId = selectedRecord?.id ?? null
  const popupRecord = useMemo(
    () => records.find((record) => record.id === popup?.id) ?? null,
    [popup?.id, records]
  )

  function handlePolygonClick(id: string, nextPopup: GisMapPopupState) {
    const record = records.find((item) => item.id === id)
    if (!record) return

    onSelectPcode(record.pcode)
    setPopup(nextPopup)
  }

  return (
    <GisMapShell
      className='min-h-[520px]'
      featureCollection={featureCollection}
      onMapMoveStart={() => setPopup(null)}
      onPolygonClick={handlePolygonClick}
      previewGeometry={previewItem?.geometry ?? null}
      selectedId={selectedId}
    >
      <GisMapPopup
        onClose={() => setPopup(null)}
        popup={popupRecord ? popup : null}
        showCloseButton={false}
      >
        {popupRecord ? (
          <MapPopupContent
            onClose={() => setPopup(null)}
            onOpenHistory={() => onOpenHistory(popupRecord)}
            record={popupRecord}
          />
        ) : null}
      </GisMapPopup>
    </GisMapShell>
  )
}

function MapPopupContent({
  record,
  onClose,
  onOpenHistory,
}: {
  record: CityBarangayRegistryRecord
  onClose: () => void
  onOpenHistory: () => void
}) {
  return (
    <div className='flex flex-col gap-3'>
      <div className='min-w-0'>
        <div className='flex items-start justify-between gap-3'>
          <div className='min-w-0'>
            <p className='truncate font-medium'>{record.name}</p>
            <p className='mt-1 font-mono text-xs text-muted-foreground'>
              {record.pcode}
            </p>
          </div>
          <Button
            aria-label='Close map popup'
            onClick={onClose}
            size='icon'
            variant='ghost'
          >
            <XIcon />
          </Button>
        </div>
        <Badge variant={record.inCho2Scope ? 'default' : 'outline'}>
          {record.inCho2Scope ? <BadgeCheck data-icon='inline-start' /> : null}{' '}
          {formatScope(record.inCho2Scope)}
        </Badge>
      </div>

      <Separator />

      <dl className='grid grid-cols-3 gap-2 text-xs'>
        <div>
          <dt className='text-muted-foreground'>Data source date</dt>
          <dd className='font-medium'>{formatDate(record.sourceDate)}</dd>
        </div>
        <div>
          <dt className='text-muted-foreground'>Validity start</dt>
          <dd className='font-medium'>{formatDate(record.sourceValidOn)}</dd>
        </div>
        <div>
          <dt className='text-muted-foreground'>Area</dt>
          <dd className='font-medium'>{formatArea(record.sourceAreaSqKm)}</dd>
        </div>
      </dl>

      <Button className='w-full' onClick={onOpenHistory} variant='outline'>
        <HistoryIcon data-icon='inline-start' />
        View geometry history
      </Button>
    </div>
  )
}

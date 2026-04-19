'use client'

import { useMemo, useState } from 'react'
import { FolderInput, MapIcon, MapPinnedIcon, FileCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type {
  CityBarangayImportItem,
  CityBarangayPageMode,
  CityBarangayRegistryData,
  CityBarangayRegistryRecord,
} from '../data/schema'
import { RegistryOverviewRail } from './registry-overview-rail'
import { RegistryMapPanel } from './registry-map-panel'
import { RegistryTable } from './registry-table'
import { GeometryHistorySheet } from './geometry-history-sheet'
import { ImportReviewPanel } from './import-review-panel'

type RegistryPageShellProps = {
  data: CityBarangayRegistryData
  mode: CityBarangayPageMode
}

export function RegistryPageShell({ data, mode }: RegistryPageShellProps) {
  const isAdmin = mode === 'admin'
  const [activeTab, setActiveTab] = useState<'registry' | 'import'>('registry')
  const [selectedPcode, setSelectedPcode] = useState(
    data.records[0]?.pcode ?? null
  )
  const [historyRecord, setHistoryRecord] =
    useState<CityBarangayRegistryRecord | null>(null)
  const [importItems, setImportItems] = useState(data.importItems)
  const [selectedImportItemId, setSelectedImportItemId] = useState<string | null>(
    data.importItems.find((item) => item.geometry)?.id ?? null
  )

  const selectedRecord = useMemo(
    () => data.records.find((record) => record.pcode === selectedPcode) ?? null,
    [data.records, selectedPcode]
  )

  const selectedImportItem = useMemo(
    () => importItems.find((item) => item.id === selectedImportItemId) ?? null,
    [importItems, selectedImportItemId]
  )

  const historyVersions = useMemo(() => {
    if (!historyRecord) return []

    return data.geometryVersions.filter(
      (version) => version.cityBarangayId === historyRecord.id
    )
  }, [data.geometryVersions, historyRecord])

  const cityNames = useMemo(
    () =>
      Array.from(
        new Set(
          data.records
            .map((record) => record.city)
            .filter((city): city is string => Boolean(city))
        )
      ),
    [data.records]
  )

  const hasMultipleCities = cityNames.length > 1
  const primaryCity = cityNames[0] ?? 'Selected city'
  const pageTitle = hasMultipleCities
    ? 'Barangays in Selected Cities'
    : `Barangays in ${primaryCity}`
  const pageDescription = hasMultipleCities
    ? 'Official barangay boundary records and staged GeoJSON imports for the selected cities.'
    : `Official barangay boundary records and staged GeoJSON imports for ${primaryCity}.`

  function handleSelectRecord(record: CityBarangayRegistryRecord) {
    setSelectedPcode(record.pcode)
    setActiveTab('registry')
  }

  function handleSelectPcode(pcode: string) {
    setSelectedPcode(pcode)
    setActiveTab('registry')
  }

  function handlePreviewImportItem(item: CityBarangayImportItem) {
    setSelectedImportItemId(item.id)
    setActiveTab('import')
  }

  function handleImportItemsChange(nextItems: CityBarangayImportItem[]) {
    setImportItems(nextItems)
  }

  return (
    <section className='min-h-0 xl:h-[calc(100svh-6rem)] xl:overflow-hidden'>
      <div className='grid min-h-0 gap-4 xl:h-full xl:grid-cols-[300px_minmax(0,1fr)]'>
        <RegistryOverviewRail
          cityName={primaryCity}
          hasMultipleCities={hasMultipleCities}
          selectedRecord={selectedRecord}
          stats={data.stats}
        />

        <div className='min-h-0 min-w-0 overflow-y-auto pb-4 pr-1'>
          <Tabs
            className='flex min-w-0 flex-col gap-4'
            onValueChange={(value) => {
              if (value === 'registry' || (value === 'import' && isAdmin)) {
                setActiveTab(value)
              }
            }}
            value={activeTab}
          >
            <div className='flex flex-wrap items-end justify-between gap-3'>
              <div className='min-w-0'>
                <h1 className='font-heading text-2xl font-bold tracking-tight'>
                  {pageTitle}
                </h1>
                <p className='text-sm text-muted-foreground'>
                  {pageDescription}
                </p>
              </div>
              <div className='flex flex-wrap items-center gap-2'>
                <TabsList>
                  <TabsTrigger value='registry'>
                    <MapIcon />
                    Boundaries
                  </TabsTrigger>
                  {isAdmin ? (
                    <TabsTrigger value='import'>
                      <FileCheck />
                      GeoJSON Review
                    </TabsTrigger>
                  ) : null}
                </TabsList>
                {isAdmin ? (
                  <Button onClick={() => setActiveTab('import')}>
                    <FolderInput />
                    Open Import Review
                  </Button>
                ) : (
                  <Button disabled variant='outline'>
                    <MapPinnedIcon />
                    Read-only Access
                  </Button>
                )}
              </div>
            </div>

            <div className='h-[min(60svh,600px)] min-h-[500px]'>
              <RegistryMapPanel
                onOpenHistory={setHistoryRecord}
                onSelectPcode={handleSelectPcode}
                previewItem={activeTab === 'import' ? selectedImportItem : null}
                records={data.records}
                selectedPcode={selectedPcode}
              />
            </div>

            <TabsContent className='mt-0' value='registry'>
              <RegistryTable
                data={data.records}
                onOpenHistory={setHistoryRecord}
                onSelect={handleSelectRecord}
                selectedPcode={selectedPcode}
              />
            </TabsContent>

            {isAdmin ? (
              <TabsContent className='mt-0' value='import'>
                <ImportReviewPanel
                  items={importItems}
                  job={data.importJob}
                  onItemsChange={handleImportItemsChange}
                  onPreview={handlePreviewImportItem}
                  selectedItemId={selectedImportItemId}
                />
              </TabsContent>
            ) : null}
          </Tabs>
        </div>
      </div>

      <GeometryHistorySheet
        onOpenChange={(open) => {
          if (!open) setHistoryRecord(null)
        }}
        open={!!historyRecord}
        record={historyRecord}
        versions={historyVersions}
      />
    </section>
  )
}

'use client'

import { useMemo, useState } from 'react'
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
    <section className='flex min-h-0 flex-col gap-4 pb-8'>
      <div className='grid min-h-0 gap-4 xl:grid-cols-[300px_minmax(0,1fr)]'>
        <RegistryOverviewRail
          mode={mode}
          onShowImport={() => setActiveTab('import')}
          selectedRecord={selectedRecord}
          stats={data.stats}
        />

        <div className='flex min-w-0 flex-col gap-4 pb-8'>
          <Tabs
            className='flex min-w-0 flex-col gap-4'
            onValueChange={(value) => {
              if (value === 'registry' || (value === 'import' && isAdmin)) {
                setActiveTab(value)
              }
            }}
            value={activeTab}
          >
            <div className='flex flex-wrap items-center justify-between gap-3'>
              <TabsList>
                <TabsTrigger value='registry'>Registry</TabsTrigger>
                {isAdmin ? (
                  <TabsTrigger value='import'>Import Review</TabsTrigger>
                ) : null}
              </TabsList>
            </div>

            <div className='h-[min(64svh,640px)] min-h-[520px]'>
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

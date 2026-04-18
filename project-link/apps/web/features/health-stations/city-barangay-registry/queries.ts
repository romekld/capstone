import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { cache } from 'react'
import type {
  CityBarangayGeometryVersion,
  CityBarangayImportItem,
  CityBarangayImportJob,
  CityBarangayRegistryData,
  CityBarangayRegistryRecord,
  CityBarangaySourceProperties,
} from './data/schema'
import type { SourceFeatureCollection } from './data/geojson'

const GIS_ROOT = path.join(process.cwd(), '..', '..', 'docs', 'gis')

async function readGeoJson(filename: string): Promise<SourceFeatureCollection> {
  const file = await readFile(path.join(GIS_ROOT, filename), 'utf8')
  return JSON.parse(file) as SourceFeatureCollection
}

function toId(pcode: string) {
  return `city-barangay-${pcode.toLowerCase()}`
}

function toVersion(record: CityBarangayRegistryRecord): CityBarangayGeometryVersion {
  return {
    id: `version-${record.pcode}-1`,
    cityBarangayId: record.id,
    versionNo: 1,
    changeType: 'create',
    reason: 'Initial GeoJSON import',
    changedBy: 'System Admin',
    changedAt: record.sourceValidOn || record.sourceDate,
    sourcePayload: record.sourcePayload,
  }
}

function buildStats(records: CityBarangayRegistryRecord[]) {
  const sourceDates = new Set(records.map((record) => record.sourceDate).filter(Boolean))
  const validOnDates = new Set(
    records.map((record) => record.sourceValidOn).filter(Boolean)
  )
  const latestUpdatedAt = records
    .map((record) => record.updatedAt)
    .filter(Boolean)
    .sort()
    .at(-1)

  return {
    totalBarangays: records.length,
    inCho2Scope: records.filter((record) => record.inCho2Scope).length,
    outsideCho2Scope: records.filter((record) => !record.inCho2Scope).length,
    sourceDate: sourceDates.size === 1 ? Array.from(sourceDates)[0] : null,
    validOn: validOnDates.size === 1 ? Array.from(validOnDates)[0] : null,
    totalAreaSqKm: records.reduce(
      (total, record) => total + record.sourceAreaSqKm,
      0
    ),
    latestUpdatedAt: latestUpdatedAt ?? null,
  }
}

function buildImportJob(items: CityBarangayImportItem[]): CityBarangayImportJob {
  const validItems = items.filter((item) => item.action !== 'invalid')

  return {
    id: 'sample-import-job-dasmarinas',
    filename: 'dasmarinas_boundaries.geojson',
    status: 'validated',
    totalFeatures: items.length,
    validFeatures: validItems.length,
    errorFeatures: items.length - validItems.length,
    duplicateFeatures: items.filter((item) =>
      ['review_required', 'overwrite', 'skip'].includes(item.action)
    ).length,
    payloadSizeBytes: 479389,
    createdAt: '2026-04-18T00:00:00.000Z',
    validatedAt: '2026-04-18T00:01:00.000Z',
    committedAt: null,
  }
}

function makeImportItem(
  record: CityBarangayRegistryRecord,
  index: number,
  action: CityBarangayImportItem['action']
): CityBarangayImportItem {
  return {
    id: `sample-import-item-${record.pcode}`,
    jobId: 'sample-import-job-dasmarinas',
    featureIndex: index,
    pcode: record.pcode,
    name: record.name,
    action,
    validationErrors: [],
    geometry: record.geometry,
    selectedOverwrite: action === 'overwrite',
    existingCityBarangayId: record.id,
    existingBarangayName: record.name,
    processedAt: action === 'skip' ? '2026-04-18T00:02:00.000Z' : null,
    sourcePayload: record.sourcePayload,
  }
}

function buildImportItems(records: CityBarangayRegistryRecord[]) {
  const sample = records.slice(0, 5).map((record, index) => {
    const actions: CityBarangayImportItem['action'][] = [
      'review_required',
      'overwrite',
      'skip',
      'review_required',
      'create',
    ]
    const item = makeImportItem(record, index + 1, actions[index])

    if (item.action === 'create') {
      return {
        ...item,
        id: 'sample-import-item-new-boundary',
        pcode: 'PH0402106999',
        name: 'Sample New Barangay Boundary',
        existingCityBarangayId: null,
        existingBarangayName: null,
      }
    }

    return item
  })

  return [
    ...sample,
    {
      id: 'sample-import-item-invalid',
      jobId: 'sample-import-job-dasmarinas',
      featureIndex: 6,
      pcode: null,
      name: 'Unnamed boundary',
      action: 'invalid',
      validationErrors: ['Missing ADM4_PCODE or pcode', 'Missing geometry'],
      geometry: null,
      selectedOverwrite: false,
      existingCityBarangayId: null,
      existingBarangayName: null,
      processedAt: null,
      sourcePayload: null,
    } satisfies CityBarangayImportItem,
  ]
}

export const getCityBarangayRegistryData = cache(
  async (): Promise<CityBarangayRegistryData> => {
    const [registryGeoJson, cho2GeoJson] = await Promise.all([
      readGeoJson('dasmarinas_boundaries.geojson'),
      readGeoJson('cho2_boundaries.geojson'),
    ])

    const cho2Pcodes = new Set(
      cho2GeoJson.features.map((feature) => feature.properties.ADM4_PCODE)
    )

    const records = registryGeoJson.features
      .map((feature) => {
        const properties = feature.properties as CityBarangaySourceProperties

        return {
          id: toId(properties.ADM4_PCODE),
          name: properties.ADM4_EN,
          pcode: properties.ADM4_PCODE,
          city: properties.ADM3_EN,
          sourceFid: properties.fid,
          sourceDate: properties.date,
          sourceValidOn: properties.validOn,
          sourceValidTo: properties.validTo,
          sourceAreaSqKm: properties.AREA_SQKM,
          inCho2Scope: cho2Pcodes.has(properties.ADM4_PCODE),
          geometry: feature.geometry,
          sourcePayload: properties,
          versionCount: 1,
          updatedAt: properties.validOn || properties.date,
        } satisfies CityBarangayRegistryRecord
      })
      .sort((a, b) => a.name.localeCompare(b.name))

    const importItems = buildImportItems(records)

    return {
      records,
      geometryVersions: records.map(toVersion),
      importJob: buildImportJob(importItems),
      importItems,
      stats: buildStats(records),
    }
  }
)


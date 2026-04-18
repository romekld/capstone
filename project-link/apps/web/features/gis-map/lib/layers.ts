import type {
  FilterSpecification,
  GeoJSONSource,
  Map as MapLibreMap,
} from 'maplibre-gl'
import type {
  GisPolygonFeatureCollection,
  GisPreviewFeatureCollection,
} from '../data/types'
import type { GisGeometry } from '../data/types'

export const GIS_BOUNDARY_SOURCE = 'gis-boundaries'
export const GIS_BOUNDARY_FILL_LAYER = 'gis-boundaries-fill'
export const GIS_BOUNDARY_LINE_LAYER = 'gis-boundaries-line'
export const GIS_BOUNDARY_HOVER_FILL_LAYER = 'gis-boundaries-hover-fill'
export const GIS_BOUNDARY_HOVER_LINE_LAYER = 'gis-boundaries-hover-line'
export const GIS_BOUNDARY_SELECTED_LINE_LAYER = 'gis-boundaries-selected-line'
export const GIS_PREVIEW_SOURCE = 'gis-preview'
export const GIS_PREVIEW_FILL_LAYER = 'gis-preview-fill'
export const GIS_PREVIEW_LINE_LAYER = 'gis-preview-line'

type SourceData = Parameters<GeoJSONSource['setData']>[0]

export function setBoundarySourceData(
  map: MapLibreMap,
  featureCollection: GisPolygonFeatureCollection
) {
  const source = map.getSource(GIS_BOUNDARY_SOURCE) as GeoJSONSource | undefined
  source?.setData(featureCollection as SourceData)
}

export function setSelectedBoundary(map: MapLibreMap, id: string | null) {
  if (!map.getLayer(GIS_BOUNDARY_SELECTED_LINE_LAYER)) return

  map.setFilter(GIS_BOUNDARY_SELECTED_LINE_LAYER, [
    '==',
    ['get', 'id'],
    id ?? '',
  ])
}

export function setHoveredBoundary(map: MapLibreMap, id: string | null) {
  const filter: FilterSpecification = ['==', ['get', 'id'], id ?? '']

  if (map.getLayer(GIS_BOUNDARY_HOVER_FILL_LAYER)) {
    map.setFilter(GIS_BOUNDARY_HOVER_FILL_LAYER, filter)
  }

  if (map.getLayer(GIS_BOUNDARY_HOVER_LINE_LAYER)) {
    map.setFilter(GIS_BOUNDARY_HOVER_LINE_LAYER, filter)
  }
}

export function setPreviewGeometry(
  map: MapLibreMap,
  geometry: GisGeometry | null
) {
  const source = map.getSource(GIS_PREVIEW_SOURCE) as GeoJSONSource | undefined
  source?.setData(toPreviewFeatureCollection(geometry) as SourceData)
}

export function ensureGisLayers(
  map: MapLibreMap,
  featureCollection: GisPolygonFeatureCollection,
  previewGeometry: GisGeometry | null,
  selectedId: string | null,
  hoveredId: string | null
) {
  const beforeId = getFirstSymbolLayerId(map)

  if (!map.getSource(GIS_BOUNDARY_SOURCE)) {
    map.addSource(GIS_BOUNDARY_SOURCE, {
      type: 'geojson',
      data: featureCollection as SourceData,
    })
  } else {
    setBoundarySourceData(map, featureCollection)
  }

  if (!map.getLayer(GIS_BOUNDARY_FILL_LAYER)) {
    map.addLayer(
      {
        id: GIS_BOUNDARY_FILL_LAYER,
        type: 'fill',
        source: GIS_BOUNDARY_SOURCE,
        paint: {
          'fill-color': [
            'case',
            ['==', ['get', 'inCho2Scope'], true],
            '#1f7a5b',
            '#64748b',
          ],
          'fill-opacity': [
            'case',
            ['==', ['get', 'inCho2Scope'], true],
            0.28,
            0.14,
          ],
        },
      },
      beforeId
    )
  }

  if (!map.getLayer(GIS_BOUNDARY_HOVER_FILL_LAYER)) {
    map.addLayer(
      {
        id: GIS_BOUNDARY_HOVER_FILL_LAYER,
        type: 'fill',
        source: GIS_BOUNDARY_SOURCE,
        filter: ['==', ['get', 'id'], hoveredId ?? ''],
        paint: {
          'fill-color': '#0f5cff',
          'fill-opacity': 0.2,
        },
      },
      beforeId
    )
  }

  if (!map.getLayer(GIS_BOUNDARY_LINE_LAYER)) {
    map.addLayer(
      {
        id: GIS_BOUNDARY_LINE_LAYER,
        type: 'line',
        source: GIS_BOUNDARY_SOURCE,
        paint: {
          'line-color': [
            'case',
            ['==', ['get', 'inCho2Scope'], true],
            '#0f513e',
            '#475569',
          ],
          'line-opacity': 0.95,
          'line-width': [
            'interpolate',
            ['linear'],
            ['zoom'],
            9,
            0.9,
            13,
            1.8,
          ],
        },
      },
      beforeId
    )
  }

  if (!map.getLayer(GIS_BOUNDARY_HOVER_LINE_LAYER)) {
    map.addLayer(
      {
        id: GIS_BOUNDARY_HOVER_LINE_LAYER,
        type: 'line',
        source: GIS_BOUNDARY_SOURCE,
        filter: ['==', ['get', 'id'], hoveredId ?? ''],
        paint: {
          'line-color': '#0f5cff',
          'line-width': 3,
          'line-opacity': 0.85,
        },
      },
      beforeId
    )
  }

  if (!map.getLayer(GIS_BOUNDARY_SELECTED_LINE_LAYER)) {
    map.addLayer(
      {
        id: GIS_BOUNDARY_SELECTED_LINE_LAYER,
        type: 'line',
        source: GIS_BOUNDARY_SOURCE,
        filter: ['==', ['get', 'id'], selectedId ?? ''],
        paint: {
          'line-color': '#2563eb',
          'line-width': 4.5,
          'line-opacity': 0.95,
        },
      },
      beforeId
    )
  }

  if (!map.getSource(GIS_PREVIEW_SOURCE)) {
    map.addSource(GIS_PREVIEW_SOURCE, {
      type: 'geojson',
      data: toPreviewFeatureCollection(previewGeometry) as SourceData,
    })
  } else {
    setPreviewGeometry(map, previewGeometry)
  }

  if (!map.getLayer(GIS_PREVIEW_FILL_LAYER)) {
    map.addLayer(
      {
        id: GIS_PREVIEW_FILL_LAYER,
        type: 'fill',
        source: GIS_PREVIEW_SOURCE,
        paint: {
          'fill-color': '#f59e0b',
          'fill-opacity': 0.26,
        },
      },
      beforeId
    )
  }

  if (!map.getLayer(GIS_PREVIEW_LINE_LAYER)) {
    map.addLayer(
      {
        id: GIS_PREVIEW_LINE_LAYER,
        type: 'line',
        source: GIS_PREVIEW_SOURCE,
        paint: {
          'line-color': '#f59e0b',
          'line-dasharray': [2, 1],
          'line-width': 3.5,
        },
      },
      beforeId
    )
  }

  setHoveredBoundary(map, hoveredId)
  setSelectedBoundary(map, selectedId)
}

function getFirstSymbolLayerId(map: MapLibreMap) {
  return map
    .getStyle()
    .layers?.find((layer) => layer.type === 'symbol')?.id
}

function toPreviewFeatureCollection(
  geometry: GisGeometry | null
): GisPreviewFeatureCollection {
  return {
    type: 'FeatureCollection',
    features: geometry
      ? [
          {
            type: 'Feature',
            geometry,
            properties: {},
          },
        ]
      : [],
  }
}

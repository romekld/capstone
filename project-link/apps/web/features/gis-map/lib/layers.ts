import type {
  FilterSpecification,
  GeoJSONSource,
  Map as MapLibreMap,
} from 'maplibre-gl'
import type {
  GisMapStyleMode,
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
  hoveredId: string | null,
  mode: GisMapStyleMode
) {
  const beforeId = getFirstSymbolLayerId(map)
  const colors = getBoundaryColors(mode)

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
            colors.inScopeFill,
            colors.outsideFill,
          ],
          'fill-opacity': [
            'case',
            ['==', ['get', 'inCho2Scope'], true],
            colors.inScopeFillOpacity,
            colors.outsideFillOpacity,
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
          'fill-color': colors.hoverFill,
          'fill-opacity': colors.hoverFillOpacity,
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
            colors.inScopeLine,
            colors.outsideLine,
          ],
          'line-opacity': colors.lineOpacity,
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
          'line-color': colors.hoverLine,
          'line-width': 3,
          'line-opacity': colors.hoverLineOpacity,
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
          'line-color': colors.selectedLine,
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

function getBoundaryColors(mode: GisMapStyleMode) {
  if (mode === 'dark') {
    return {
      inScopeFill: '#34d399',
      outsideFill: '#cbd5e1',
      inScopeFillOpacity: 0.3,
      outsideFillOpacity: 0.16,
      inScopeLine: '#a7f3d0',
      outsideLine: '#e2e8f0',
      lineOpacity: 0.88,
      hoverFill: '#60a5fa',
      hoverFillOpacity: 0.24,
      hoverLine: '#bfdbfe',
      hoverLineOpacity: 0.95,
      selectedLine: '#3b82f6',
    }
  }

  return {
    inScopeFill: '#1f7a5b',
    outsideFill: '#64748b',
    inScopeFillOpacity: 0.28,
    outsideFillOpacity: 0.14,
    inScopeLine: '#0f513e',
    outsideLine: '#475569',
    lineOpacity: 0.95,
    hoverFill: '#0f5cff',
    hoverFillOpacity: 0.2,
    hoverLine: '#0f5cff',
    hoverLineOpacity: 0.85,
    selectedLine: '#2563eb',
  }
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

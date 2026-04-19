'use client'

import type React from 'react'
import { useCallback, useEffect, useMemo, useRef } from 'react'
import { useTheme } from 'next-themes'
import maplibregl, {
  type LngLatBoundsLike,
  type Map as MapLibreMap,
  type MapLayerMouseEvent,
} from 'maplibre-gl'
import { ExpandIcon, LocateFixedIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import type {
  GisGeometry,
  GisMapPopupState,
  GisPolygonFeature,
  GisPolygonFeatureCollection,
} from '../data/types'
import {
  GIS_BOUNDARY_FILL_LAYER,
  ensureGisLayers,
  setBoundarySourceData,
  setHoveredBoundary,
  setPreviewGeometry,
  setSelectedBoundary,
} from '../lib/layers'
import { getGisMapStyleUrl } from '../lib/styles'

type GisMapShellProps = {
  className?: string
  featureCollection: GisPolygonFeatureCollection
  selectedId: string | null
  previewGeometry: GisGeometry | null
  onPolygonClick: (id: string, popup: GisMapPopupState) => void
  onMapMoveStart?: () => void
  children?: React.ReactNode
}

export function GisMapShell({
  className,
  featureCollection,
  selectedId,
  previewGeometry,
  onPolygonClick,
  onMapMoveStart,
  children,
}: GisMapShellProps) {
  const { resolvedTheme } = useTheme()
  const mode = resolvedTheme === 'dark' ? 'dark' : 'light'
  const styleUrl = getGisMapStyleUrl(mode)
  const mapRef = useRef<MapLibreMap | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const initialStyleUrlRef = useRef(styleUrl)
  const currentStyleRef = useRef<string | null>(null)
  const mapReadyRef = useRef(false)
  const interactionsReadyRef = useRef(false)
  const hoveredIdRef = useRef<string | null>(null)
  const polygonClickRef = useRef(onPolygonClick)
  const moveStartRef = useRef(onMapMoveStart)
  const hydrateLayersRef = useRef<(map: MapLibreMap) => void>(() => undefined)
  const cityBoundsRef = useRef<[[number, number], [number, number]] | null>(
    null
  )

  const cityBounds = useMemo(
    () =>
      getGeometryBounds(
        featureCollection.features.map((feature) => feature.geometry)
      ),
    [featureCollection]
  )

  const hydrateLayers = useCallback(
    (map: MapLibreMap) => {
      ensureGisLayers(
        map,
        featureCollection,
        previewGeometry,
        selectedId,
        hoveredIdRef.current,
        mode
      )
      registerInteractionsOnce(
        map,
        interactionsReadyRef,
        hoveredIdRef,
        polygonClickRef
      )
    },
    [featureCollection, mode, previewGeometry, selectedId]
  )

  useEffect(() => {
    polygonClickRef.current = onPolygonClick
  }, [onPolygonClick])

  useEffect(() => {
    moveStartRef.current = onMapMoveStart
  }, [onMapMoveStart])

  useEffect(() => {
    cityBoundsRef.current = cityBounds
  }, [cityBounds])

  useEffect(() => {
    hydrateLayersRef.current = hydrateLayers
  }, [hydrateLayers])

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: initialStyleUrlRef.current,
      center: [120.94, 14.32],
      zoom: 11,
      attributionControl: false,
      canvasContextAttributes: { antialias: true },
    })
    currentStyleRef.current = initialStyleUrlRef.current

    map.addControl(new maplibregl.AttributionControl({ compact: true }), 'bottom-left')
    map.addControl(
      new maplibregl.NavigationControl({ showCompass: true }),
      'bottom-right'
    )

    map.on('load', () => {
      mapReadyRef.current = true
      hydrateLayersRef.current(map)

      if (cityBoundsRef.current) {
        map.fitBounds(cityBoundsRef.current as LngLatBoundsLike, {
          padding: 44,
          duration: 0,
        })
      }
    })

    map.on('dragstart', () => {
      moveStartRef.current?.()
    })

    map.on('zoomstart', () => {
      moveStartRef.current?.()
    })

    mapRef.current = map

    return () => {
      mapReadyRef.current = false
      mapRef.current = null
      map.remove()
    }
  }, [])

  useEffect(() => {
    const map = mapRef.current
    if (!map || !mapReadyRef.current || currentStyleRef.current === styleUrl) return

    currentStyleRef.current = styleUrl
    moveStartRef.current?.()
    map.setStyle(styleUrl)
    map.once('style.load', () => {
      hydrateLayers(map)
    })
  }, [hydrateLayers, styleUrl])

  useEffect(() => {
    const map = mapRef.current
    if (!map || !mapReadyRef.current) return

    if (map.getSource('gis-boundaries')) {
      setBoundarySourceData(map, featureCollection)
    } else {
      hydrateLayersRef.current(map)
    }
  }, [featureCollection])

  useEffect(() => {
    const map = mapRef.current
    if (!map || !mapReadyRef.current) return

    setSelectedBoundary(map, selectedId)
  }, [selectedId])

  useEffect(() => {
    const map = mapRef.current
    if (!map || !mapReadyRef.current) return

    setPreviewGeometry(map, previewGeometry)
  }, [previewGeometry])

  function fitCity() {
    const map = mapRef.current
    if (!map || !cityBounds) return

    map.fitBounds(cityBounds as LngLatBoundsLike, {
      padding: 44,
      duration: 450,
    })
  }

  function requestFullscreen() {
    containerRef.current?.requestFullscreen?.()
  }

  return (
    <div
      className={cn(
        'relative h-full min-h-[480px] overflow-hidden rounded-md border bg-muted',
        className
      )}
    >
      <div className='absolute right-3 top-3 z-10 flex gap-2'>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              aria-label='Fit map to city boundaries'
              onClick={fitCity}
              size='icon'
              variant='secondary'
            >
              <LocateFixedIcon />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Fit city</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              aria-label='Open map fullscreen'
              onClick={requestFullscreen}
              size='icon'
              variant='secondary'
            >
              <ExpandIcon />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Fullscreen</TooltipContent>
        </Tooltip>
      </div>

      <div className='h-full min-h-[480px] w-full' ref={containerRef} />
      {children}
    </div>
  )
}

function registerInteractionsOnce(
  map: MapLibreMap,
  interactionsReadyRef: React.MutableRefObject<boolean>,
  hoveredIdRef: React.MutableRefObject<string | null>,
  polygonClickRef: React.MutableRefObject<
    (id: string, popup: GisMapPopupState) => void
  >
) {
  if (interactionsReadyRef.current) return

  map.on('click', GIS_BOUNDARY_FILL_LAYER, (event: MapLayerMouseEvent) => {
    const feature = event.features?.[0] as GisPolygonFeature | undefined
    const id = feature?.properties?.id

    if (typeof id === 'string') {
      polygonClickRef.current(id, {
        id,
        lngLat: {
          lng: event.lngLat.lng,
          lat: event.lngLat.lat,
        },
        point: {
          x: event.point.x,
          y: event.point.y,
        },
      })
    }
  })

  map.on('mousemove', GIS_BOUNDARY_FILL_LAYER, (event: MapLayerMouseEvent) => {
    const feature = event.features?.[0] as GisPolygonFeature | undefined
    const id = feature?.properties?.id ?? null

    if (id !== hoveredIdRef.current) {
      hoveredIdRef.current = id
      setHoveredBoundary(map, id)
    }

    map.getCanvas().style.cursor = id ? 'pointer' : ''
  })

  map.on('mouseleave', GIS_BOUNDARY_FILL_LAYER, () => {
    hoveredIdRef.current = null
    setHoveredBoundary(map, null)
    map.getCanvas().style.cursor = ''
  })

  interactionsReadyRef.current = true
}

function getGeometryBounds(geometries: GisGeometry[]) {
  let minLng = Number.POSITIVE_INFINITY
  let minLat = Number.POSITIVE_INFINITY
  let maxLng = Number.NEGATIVE_INFINITY
  let maxLat = Number.NEGATIVE_INFINITY

  for (const geometry of geometries) {
    visitPositions(geometry, ([lng, lat]) => {
      minLng = Math.min(minLng, lng)
      minLat = Math.min(minLat, lat)
      maxLng = Math.max(maxLng, lng)
      maxLat = Math.max(maxLat, lat)
    })
  }

  if (!Number.isFinite(minLng)) return null

  return [
    [minLng, minLat],
    [maxLng, maxLat],
  ] as [[number, number], [number, number]]
}

function visitPositions(
  geometry: GisGeometry,
  visit: (position: [number, number]) => void
) {
  if (geometry.type === 'Polygon') {
    for (const ring of geometry.coordinates) {
      for (const position of ring) {
        visit([position[0], position[1]])
      }
    }
    return
  }

  for (const polygon of geometry.coordinates) {
    for (const ring of polygon) {
      for (const position of ring) {
        visit([position[0], position[1]])
      }
    }
  }
}

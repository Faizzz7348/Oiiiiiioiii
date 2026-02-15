import { lazy, Suspense } from 'react'

type RouteDetail = {
  id: number
  code: string
  name: string
  delivery: string
  lat?: string
  long?: string
}

type MapWrapperProps = {
  routeDetails: RouteDetail[]
}

// Lazy load MapView only on client side
const MapView = lazy(() => import('./map-view-lazy').then(module => ({ default: module.MapView })))

export function MapWrapper({ routeDetails }: MapWrapperProps) {
  return (
    <Suspense 
      fallback={
        <div className="w-full relative flex items-center justify-center bg-muted/50 rounded-lg" style={{ height: '600px' }}>
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading map...</p>
          </div>
        </div>
      }
    >
      <MapView routeDetails={routeDetails} />
    </Suspense>
  )
}

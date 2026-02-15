import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'

// Fix for default marker icons in Leaflet with Webpack/Vite
// eslint-disable-next-line @typescript-eslint/no-explicit-any
if ((L.Icon.Default.prototype as any)._getIconUrl) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  delete (L.Icon.Default.prototype as any)._getIconUrl
}

L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

// Default center for Selangor region
const DEFAULT_CENTER: [number, number] = [3.0738, 101.5183]

type RouteDetail = {
  id: number
  code: string
  name: string
  delivery: string
  lat?: string
  long?: string
}

type MapViewProps = {
  routeDetails: RouteDetail[]
}

export function MapView({ routeDetails }: MapViewProps) {
  // Calculate center from available coordinates
  const validCoords = routeDetails
    .filter(d => d.lat && d.long && !isNaN(parseFloat(d.lat)) && !isNaN(parseFloat(d.long)))
    .map(d => [parseFloat(d.lat!), parseFloat(d.long!)] as [number, number])
  
  const center: [number, number] = validCoords.length > 0
    ? [
        validCoords.reduce((sum, coord) => sum + coord[0], 0) / validCoords.length,
        validCoords.reduce((sum, coord) => sum + coord[1], 0) / validCoords.length
      ]
    : DEFAULT_CENTER

  // Create a unique key for MapContainer to force re-render when center changes
  const mapKey = `${center[0]}-${center[1]}`

  return (
    <div className="w-full relative" style={{ height: '400px' }}>
      <MapContainer
        key={mapKey}
        center={center}
        zoom={12}
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%', borderRadius: '0.5rem' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {validCoords.length > 0 ? (
          routeDetails.map((detail) => {
            if (!detail.lat || !detail.long) return null
            
            const lat = parseFloat(detail.lat)
            const long = parseFloat(detail.long)
            
            if (isNaN(lat) || isNaN(long)) return null
            
            return (
              <Marker 
                key={detail.id} 
                position={[lat, long]}
              >
                <Popup>
                  <div className="p-2">
                    <h3 className="font-bold text-lg mb-1">{detail.name}</h3>
                    <p className="text-sm text-gray-600">Code: {detail.code}</p>
                    <p className="text-sm text-gray-600">Delivery: {detail.delivery}</p>
                    <p className="text-sm text-gray-600">Coordinates: {detail.lat}, {detail.long}</p>
                  </div>
                </Popup>
              </Marker>
            )
          })
        ) : (
          <Marker position={center}>
            <Popup>No valid coordinates found</Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  )
}

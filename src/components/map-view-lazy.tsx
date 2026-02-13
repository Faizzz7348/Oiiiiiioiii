import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix for default marker icons in Leaflet with Webpack/Vite
// @ts-expect-error - Leaflet icon configuration
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

// Sample coordinates for Malaysia locations (you can adjust these)
const locationCoordinates: { [key: string]: [number, number] } = {
  "KPJ Klang": [3.0319, 101.4451],
  "Hospital Shah Alam": [3.0738, 101.5183],
  "Pasar Malam": [3.0333, 101.4833],
  "Stesen KTM Klang": [3.0357, 101.4451],
  "Terminal Bas Klang": [3.0445, 101.4451],
}

// Default center for Selangor region
const DEFAULT_CENTER: [number, number] = [3.0738, 101.5183]

type RouteDetail = {
  id: number
  code: string
  name: string
  delivery: string
}

type MapViewProps = {
  routeDetails: RouteDetail[]
}

export function MapView({ routeDetails }: MapViewProps) {
  return (
    <div className="w-full relative" style={{ height: '600px' }}>
      <MapContainer
        center={DEFAULT_CENTER}
        zoom={12}
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%', borderRadius: '0.5rem' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {routeDetails.map((detail) => {
          const coord = locationCoordinates[detail.name]
          if (!coord) return null
          
          return (
            <Marker 
              key={detail.id} 
              position={coord}
            >
              <Popup>
                <div className="p-2">
                  <h3 className="font-bold text-lg mb-1">{detail.name}</h3>
                  <p className="text-sm text-gray-600">Code: {detail.code}</p>
                  <p className="text-sm text-gray-600">Delivery: {detail.delivery}</p>
                </div>
              </Popup>
            </Marker>
          )
        })}
      </MapContainer>
    </div>
  )
}

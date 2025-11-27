import { useState, useEffect } from "react";
import { useApp } from "@/lib/store";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, Navigation, Search, ArrowLeft, MapPin } from "lucide-react";
import { useLocation } from "wouter";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix Leaflet marker icon issue
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

// Component to handle map flyTo
function MapController({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, 14);
  }, [center, map]);
  return null;
}

export default function MapPage() {
  const { shops } = useApp();
  const [, setLocation] = useLocation();
  const [selectedShop, setSelectedShop] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [mapCenter, setMapCenter] = useState<[number, number]>([28.6139, 77.2090]); // Default: New Delhi

  // Mock coordinates for shops (simulated around Delhi for demo)
  const shopCoordinates: Record<string, [number, number]> = {
    "s1": [28.6139, 77.2090],
    "s2": [28.6239, 77.2190],
    "s3": [28.6039, 77.1990],
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple search logic: fly to first matching shop
    const foundShop = shops.find(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()));
    if (foundShop && shopCoordinates[foundShop.id]) {
      setMapCenter(shopCoordinates[foundShop.id]);
      setSelectedShop(foundShop.id);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col relative">
      {/* Header Overlay */}
      <div className="absolute top-0 left-0 right-0 z-[1000] p-4 bg-gradient-to-b from-black/50 to-transparent pt-8 pointer-events-none">
        <div className="flex items-center gap-2 pointer-events-auto">
           <Button variant="secondary" size="icon" className="h-10 w-10 rounded-full bg-white text-black hover:bg-white/90 shadow-lg" onClick={() => setLocation("/")}>
             <ArrowLeft className="w-5 h-5" />
           </Button>
           <form onSubmit={handleSearch} className="flex-1 bg-white rounded-full shadow-lg px-4 h-10 flex items-center gap-2">
             <Search className="w-4 h-4 text-muted-foreground" />
             <input 
               className="flex-1 bg-transparent border-none outline-none text-sm" 
               placeholder="Search shops..." 
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
             />
           </form>
        </div>
      </div>

      {/* Map View */}
      <div className="flex-1 relative z-0">
        <MapContainer center={mapCenter} zoom={13} style={{ height: "100%", width: "100%" }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapController center={mapCenter} />
          
          {shops.map((shop) => (
            <Marker 
              key={shop.id} 
              position={shopCoordinates[shop.id] || mapCenter}
              eventHandlers={{
                click: () => {
                  setSelectedShop(shop.id);
                  setMapCenter(shopCoordinates[shop.id]);
                },
              }}
            >
              <Popup>
                <div className="font-bold">{shop.name}</div>
                <div className="text-xs">{shop.address}</div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* Shop Details Card Overlay */}
      {selectedShop && (
        <div className="absolute bottom-4 left-4 right-4 z-[1000] animate-in slide-in-from-bottom-10 duration-300">
          {shops.filter(s => s.id === selectedShop).map(shop => (
            <Card key={shop.id} className="shadow-xl border-none">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="w-16 h-16 bg-slate-100 rounded-lg flex-shrink-0 overflow-hidden">
                   <img 
                     src={`https://images.unsplash.com/photo-1604719312566-b76d4685332c?auto=format&fit=crop&w=200&q=80`} 
                     className="w-full h-full object-cover" 
                     alt={shop.name}
                   />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold truncate">{shop.name}</h3>
                    <div className="flex items-center gap-1 text-xs font-bold text-yellow-600 bg-yellow-50 px-1.5 py-0.5 rounded">
                       <Star className="w-3 h-3 fill-current" /> {shop.rating}
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground truncate">{shop.address}</p>
                  <div className="flex items-center gap-2 mt-2">
                     <Badge variant="secondary" className="text-[10px] h-5 px-1.5 bg-green-100 text-green-700">Open</Badge>
                     <span className="text-xs text-slate-500 flex items-center gap-1">
                       <Navigation className="w-3 h-3" /> {shop.distance}km
                     </span>
                  </div>
                </div>
                <Button size="icon" className="rounded-full shrink-0">
                  <Navigation className="w-4 h-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

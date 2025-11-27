import { useState } from "react";
import { useApp } from "@/lib/store";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Star, Navigation, Search, ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";
import mapImg from "@assets/generated_images/map_with_shop_pins.png";

export default function MapPage() {
  const { shops } = useApp();
  const [, setLocation] = useLocation();
  const [selectedShop, setSelectedShop] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col relative">
      {/* Header Overlay */}
      <div className="absolute top-0 left-0 right-0 z-20 p-4 bg-gradient-to-b from-black/50 to-transparent pt-8">
        <div className="flex items-center gap-2">
           <Button variant="secondary" size="icon" className="h-10 w-10 rounded-full bg-white text-black hover:bg-white/90 shadow-lg" onClick={() => setLocation("/")}>
             <ArrowLeft className="w-5 h-5" />
           </Button>
           <div className="flex-1 bg-white rounded-full shadow-lg px-4 h-10 flex items-center gap-2">
             <Search className="w-4 h-4 text-muted-foreground" />
             <input className="flex-1 bg-transparent border-none outline-none text-sm" placeholder="Search area..." />
           </div>
        </div>
      </div>

      {/* Map View (Simulated) */}
      <div className="flex-1 relative bg-slate-200 overflow-hidden">
         <img src={mapImg} className="w-full h-full object-cover scale-150 origin-center" alt="Map" />
         
         {/* Pins */}
         {shops.map((shop, idx) => (
           <button 
             key={shop.id}
             onClick={() => setSelectedShop(shop.id)}
             className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 hover:scale-110 ${
               selectedShop === shop.id ? 'z-10 scale-125' : 'z-0'
             }`}
             style={{ 
               top: `${40 + (idx * 15)}%`, 
               left: `${30 + (idx * 20)}%` 
             }}
           >
             <div className={`
               flex flex-col items-center
             `}>
               <div className={`
                 px-3 py-1 rounded-full text-xs font-bold shadow-md mb-1 whitespace-nowrap
                 ${selectedShop === shop.id ? 'bg-primary text-white' : 'bg-white text-slate-900'}
               `}>
                 ₹{30 + idx * 5}
               </div>
               <MapPin className={`
                 w-8 h-8 drop-shadow-md
                 ${selectedShop === shop.id ? 'text-primary fill-current' : 'text-red-500 fill-current'}
               `} />
             </div>
           </button>
         ))}
      </div>

      {/* Shop Details Card Overlay */}
      {selectedShop && (
        <div className="absolute bottom-4 left-4 right-4 z-20 animate-in slide-in-from-bottom-10 duration-300">
          {shops.filter(s => s.id === selectedShop).map(shop => (
            <Card key={shop.id} className="shadow-xl border-none">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="w-16 h-16 bg-slate-100 rounded-lg flex-shrink-0">
                   <img 
                     src={`https://images.unsplash.com/photo-1604719312566-b76d4685332c?auto=format&fit=crop&w=200&q=80`} 
                     className="w-full h-full object-cover rounded-lg" 
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

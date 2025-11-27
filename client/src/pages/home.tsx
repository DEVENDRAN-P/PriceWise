import { useApp } from "@/lib/store";
import { useLocation } from "wouter";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, MapPin, Flame, ArrowUpRight, Store } from "lucide-react";
import bannerImg from "@assets/generated_images/sale_banner_background.png";
import vegImg from "@assets/generated_images/fresh_vegetables_basket.png";
import { motion } from "framer-motion";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
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

export default function Home() {
  const { user, items, prices, shops } = useApp();
  const [, setLocation] = useLocation();

  // Get top deals (lowest prices marked as offers)
  const deals = prices.filter(p => p.isOffer).slice(0, 3);

  // Default center coordinates (New Delhi)
  const center: [number, number] = [28.6139, 77.2090];

  // Mock coordinates for shops (simulated around Delhi for demo)
  const shopCoordinates: Record<string, [number, number]> = {
    "s1": [28.6139, 77.2090],
    "s2": [28.6239, 77.2190],
    "s3": [28.6039, 77.1990],
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="bg-white p-4 sticky top-0 z-20 border-b border-gray-100">
        <div className="flex justify-between items-center mb-4">
          <div>
            <p className="text-xs text-muted-foreground font-medium">Current Location</p>
            <div className="flex items-center gap-1 text-primary font-bold">
              <MapPin className="w-4 h-4" />
              <span>Downtown Market, 2km</span>
            </div>
          </div>
          <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold">
            {user?.points} pts
          </div>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input 
            placeholder="Search for tomato, rice, etc..." 
            className="pl-9 bg-slate-50 border-none shadow-sm"
            onFocus={() => setLocation("/compare")}
          />
        </div>
      </header>

      <main className="p-4 space-y-6">
        {/* Hero Banner */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative h-40 rounded-2xl overflow-hidden shadow-lg"
        >
          <img src={bannerImg} alt="Offer" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex flex-col justify-center p-6 text-white">
            <Badge className="w-fit bg-secondary hover:bg-secondary text-white mb-2">Today's Special</Badge>
            <h2 className="text-2xl font-bold mb-1">Big Savings on<br/>Fresh Veggies</h2>
            <p className="text-white/80 text-sm">Up to 40% off at Fresh Mart</p>
          </div>
        </motion.div>

        {/* Categories */}
        <section>
          <h3 className="font-bold text-lg mb-3">Categories</h3>
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
            {["Vegetables", "Fruits", "Grains", "Dairy", "Spices"].map((cat, i) => (
              <div key={i} className="flex flex-col items-center gap-2 min-w-[80px]">
                <div className="w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center p-2 border border-slate-100">
                  <img src={vegImg} alt={cat} className="w-full h-full object-cover rounded-lg" />
                </div>
                <span className="text-xs font-medium text-slate-600">{cat}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Trending Deals */}
        <section>
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-bold text-lg flex items-center gap-2">
              <Flame className="w-5 h-5 text-secondary fill-secondary" /> Trending Deals
            </h3>
            <Button variant="ghost" size="sm" className="text-primary h-auto p-0 font-semibold">View all</Button>
          </div>
          
          <div className="space-y-3">
            {deals.map((deal) => {
              const item = items.find(i => i.id === deal.itemId);
              const shop = shops.find(s => s.id === deal.shopId);
              if (!item || !shop) return null;

              return (
                <Card key={deal.id} className="overflow-hidden border-none shadow-sm active:scale-[0.99] transition-transform">
                  <CardContent className="p-0 flex">
                    <div className="w-24 h-24 bg-slate-100">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 p-3 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start">
                          <h4 className="font-bold">{item.name}</h4>
                          <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-100 text-[10px] px-1.5">
                            {deal.stockStatus}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                          <Store className="w-3 h-3" /> {shop.name} • {shop.distance}km
                        </p>
                      </div>
                      <div className="flex justify-between items-end mt-2">
                        <div>
                          <span className="text-xs text-slate-400 line-through">₹{deal.price + 10}</span>
                          <div className="font-bold text-lg text-primary">₹{deal.price}<span className="text-xs text-slate-500 font-normal">/{item.unit}</span></div>
                        </div>
                        <Button size="sm" variant="outline" className="h-8 rounded-full text-xs">
                          Compare <ArrowUpRight className="w-3 h-3 ml-1" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Map Teaser */}
        <section className="relative rounded-2xl overflow-hidden h-40 shadow-md border border-slate-200">
           <MapContainer 
             center={center} 
             zoom={13} 
             zoomControl={false} 
             dragging={false} 
             touchZoom={false} 
             doubleClickZoom={false} 
             scrollWheelZoom={false}
             style={{ height: "100%", width: "100%" }}
           >
             <TileLayer
               url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
             />
             {shops.map((shop) => (
               <Marker 
                 key={shop.id} 
                 position={shopCoordinates[shop.id] || center}
               />
             ))}
           </MapContainer>
           <div className="absolute inset-0 bg-black/10 flex items-center justify-center z-[500] pointer-events-none">
             <Button 
               className="bg-white text-primary hover:bg-white/90 shadow-lg pointer-events-auto"
               onClick={() => setLocation("/map")}
             >
               <MapPin className="w-4 h-4 mr-2" /> View Full Map
             </Button>
           </div>
        </section>
      </main>
    </div>
  );
}

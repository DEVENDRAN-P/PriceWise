import { useApp } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Star, Navigation, Clock } from "lucide-react";

import shop1 from "@assets/stock_images/grocery_store_exteri_8cb07e4e.jpg";
import shop2 from "@assets/stock_images/grocery_store_exteri_6826da88.jpg";
import shop3 from "@assets/stock_images/grocery_store_exteri_04f4587b.jpg";

const shopImages = [shop1, shop2, shop3];

export default function ShopsPage() {
  const { shops } = useApp();

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      <header className="bg-white p-4 sticky top-0 z-20 border-b border-gray-100 shadow-sm">
        <h1 className="text-xl font-bold">Nearby Shops</h1>
      </header>

      <main className="p-4 space-y-4">
        {shops.map((shop, index) => (
          <Card key={shop.id} className="border-none shadow-md overflow-hidden group">
            <div className="h-40 bg-slate-200 relative overflow-hidden">
              <img 
                src={shopImages[index % shopImages.length]} 
                alt={shop.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black/60 to-transparent opacity-60" />
              
              <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md flex items-center gap-1 text-xs font-bold shadow-sm">
                <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                {shop.rating}
              </div>
              
              <div className="absolute bottom-3 left-3 text-white">
                 <Badge variant={shop.isOpen ? "default" : "secondary"} className={`mb-1 border-none ${shop.isOpen ? "bg-green-500/90" : "bg-slate-500/90"}`}>
                  {shop.isOpen ? "Open Now" : "Closed"}
                </Badge>
              </div>
            </div>
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h2 className="font-bold text-lg">{shop.name}</h2>
                  <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                    <MapPin className="w-3 h-3" /> {shop.address}
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-slate-100">
                <div className="text-xs text-slate-600 flex items-center gap-1.5">
                  <Navigation className="w-3.5 h-3.5 text-primary" /> {shop.distance} km away
                </div>
                <div className="text-xs text-slate-600 flex items-center gap-1.5">
                   <Clock className="w-3.5 h-3.5 text-primary" /> ~10 min walk
                </div>
              </div>
              
              <Button className="w-full mt-4 font-semibold" variant="outline">View Catalog</Button>
            </CardContent>
          </Card>
        ))}
      </main>
    </div>
  );
}

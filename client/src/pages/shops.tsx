import { useApp } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Star, Navigation } from "lucide-react";

export default function ShopsPage() {
  const { shops } = useApp();

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      <header className="bg-white p-4 sticky top-0 z-20 border-b border-gray-100 shadow-sm">
        <h1 className="text-xl font-bold">Nearby Shops</h1>
      </header>

      <main className="p-4 space-y-4">
        {shops.map((shop) => (
          <Card key={shop.id} className="border-none shadow-md overflow-hidden">
            <div className="h-32 bg-slate-200 relative">
              <img 
                src={`https://images.unsplash.com/photo-1604719312566-b76d4685332c?auto=format&fit=crop&w=800&q=80`} 
                alt={shop.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md flex items-center gap-1 text-xs font-bold shadow-sm">
                <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                {shop.rating}
              </div>
            </div>
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h2 className="font-bold text-lg">{shop.name}</h2>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> {shop.address}
                  </p>
                </div>
                <Badge variant={shop.isOpen ? "default" : "secondary"} className={shop.isOpen ? "bg-green-500 hover:bg-green-600" : ""}>
                  {shop.isOpen ? "Open" : "Closed"}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between mt-4">
                <div className="text-sm font-medium text-slate-600 flex items-center gap-1">
                  <Navigation className="w-4 h-4" /> {shop.distance} km away
                </div>
                <Button variant="outline" size="sm">View Details</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </main>
    </div>
  );
}

import { useState, useEffect } from "react";
import { useApp } from "@/lib/store";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, Navigation, Search, ArrowLeft, MapPin, Phone, Clock } from "lucide-react";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";

export default function MapPage() {
  const { shops } = useApp();
  const [, setLocation] = useLocation();
  const [selectedShop, setSelectedShop] = useState<string | null>(shops.length > 0 ? shops[0].id : null);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  const filteredShops = searchQuery.trim()
    ? shops.filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : shops;

  const handleSelectShop = (shopId: string) => {
    setSelectedShop(shopId);
  };

  const handleNavigate = (shop: any) => {
    toast({
      title: "Navigation",
      description: `Opening directions to ${shop.name}...`
    });
  };

  const selectedShopData = shops.find(s => s.id === selectedShop);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-slate-50 flex flex-col pb-20">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white border-b border-slate-200 p-4 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <Button 
            variant="ghost" 
            size="icon" 
            className="rounded-full"
            onClick={() => setLocation("/")}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-bold flex items-center gap-2">
            <MapPin className="w-5 h-5 text-primary" />
            Nearby Shops
          </h1>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
          <input
            className="w-full pl-10 pr-4 py-2 rounded-full border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary text-sm"
            placeholder="Search shops..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Map Placeholder with Beautiful UI */}
      <div className="flex-1 bg-gradient-to-b from-blue-100 to-blue-50 relative overflow-hidden">
        {/* Decorative map background */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative w-80 h-80">
            <div className="absolute inset-0 bg-blue-200 rounded-full opacity-30 animate-pulse" />
            <div className="absolute inset-8 bg-blue-300 rounded-full opacity-20 animate-pulse" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <MapPin className="w-12 h-12 text-blue-600 mx-auto mb-2" />
                <p className="text-sm font-semibold text-slate-600">Nearby Shops</p>
              </div>
            </div>
          </div>
        </div>

        {/* Shops positioned on map */}
        <div className="absolute inset-0 flex items-center justify-center gap-8 flex-wrap p-8">
          {filteredShops.map((shop, idx) => {
            const isSelected = selectedShop === shop.id;
            return (
              <button
                key={shop.id}
                onClick={() => handleSelectShop(shop.id)}
                className={`transition-all transform hover:scale-110 ${isSelected ? "scale-125" : "scale-100"}`}
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg border-2 ${isSelected ? "border-primary bg-primary text-white scale-150" : "border-white bg-white text-slate-700"}`}>
                  <MapPin className="w-6 h-6" />
                </div>
                <p className="text-xs font-semibold text-center mt-1 max-w-[80px] line-clamp-2">{shop.name}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Shop Details Card */}
      {selectedShopData && (
        <div className="fixed bottom-0 left-0 right-0 z-50 animate-in slide-in-from-bottom-10 duration-300">
          <Card className="m-4 shadow-2xl border-none rounded-2xl">
            <CardContent className="p-6">
              {/* Shop Header */}
              <div className="flex items-start gap-4 mb-4">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex-shrink-0 flex items-center justify-center">
                  <MapPin className="w-10 h-10 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <h2 className="font-bold text-lg">{selectedShopData.name}</h2>
                    <Badge className="bg-yellow-100 text-yellow-800 flex items-center gap-1">
                      <Star className="w-3 h-3 fill-current" />
                      {selectedShopData.rating}
                    </Badge>
                  </div>
                  <p className="text-sm text-slate-500 mb-2">{selectedShopData.address}</p>
                  <div className="flex gap-2 flex-wrap">
                    <Badge variant="secondary" className="bg-green-100 text-green-700">Open</Badge>
                    <Badge variant="outline">{selectedShopData.distance}km away</Badge>
                  </div>
                </div>
              </div>

              {/* Shop Info Grid */}
              <div className="grid grid-cols-2 gap-3 mb-4 py-4 border-y border-slate-200">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-slate-500" />
                  <div>
                    <p className="text-xs text-slate-500">Hours</p>
                    <p className="text-sm font-semibold">9AM - 10PM</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-slate-500" />
                  <div>
                    <p className="text-xs text-slate-500">Call</p>
                    <p className="text-sm font-semibold">+91 98765 43210</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button 
                  className="flex-1 rounded-lg gap-2 bg-primary hover:bg-primary/90"
                  onClick={() => handleNavigate(selectedShopData)}
                >
                  <Navigation className="w-4 h-4" />
                  Get Directions
                </Button>
                <Button 
                  variant="outline" 
                  className="flex-1 rounded-lg"
                  onClick={() => setLocation("/compare")}
                >
                  View Prices
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

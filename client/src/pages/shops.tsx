import { useApp } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Star, Navigation, Clock, Plus } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";

import shop1 from "@assets/stock_images/grocery_store_exteri_8cb07e4e.jpg";
import shop2 from "@assets/stock_images/grocery_store_exteri_6826da88.jpg";
import shop3 from "@assets/stock_images/grocery_store_exteri_04f4587b.jpg";

const shopImages = [shop1, shop2, shop3];

export default function ShopsPage() {
  const { shops, items, prices } = useApp();

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
              
              <Sheet>
                <SheetTrigger asChild>
                  <Button className="w-full mt-4 font-semibold" variant="outline">View Catalog</Button>
                </SheetTrigger>
                <SheetContent side="bottom" className="h-[85vh] rounded-t-[20px]">
                  <SheetHeader className="mb-4">
                    <div className="flex items-start gap-4">
                       <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                          <img src={shopImages[index % shopImages.length]} className="w-full h-full object-cover" />
                       </div>
                       <div>
                         <SheetTitle className="text-left">{shop.name}</SheetTitle>
                         <SheetDescription className="text-left">
                           {shop.address} • {shop.rating} ★
                         </SheetDescription>
                       </div>
                    </div>
                  </SheetHeader>
                  
                  <div className="mb-4">
                    <h3 className="font-bold mb-2">Available Items</h3>
                  </div>

                  <ScrollArea className="h-[60vh] pr-4">
                    <div className="space-y-3">
                      {items.map(item => {
                        // Mock finding price for this shop
                        // In a real app, we'd filter prices by shopId
                        const price = prices.find(p => p.itemId === item.id && p.shopId === shop.id) || 
                                    { price: Math.floor(Math.random() * 50) + 20, stockStatus: "available" };
                        
                        return (
                          <div key={item.id} className="flex items-center gap-3 p-2 border rounded-lg border-slate-100">
                            <div className="w-14 h-14 bg-slate-50 rounded-md overflow-hidden">
                              <img src={item.image} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1">
                              <div className="flex justify-between">
                                <h4 className="font-semibold text-sm">{item.name}</h4>
                                <span className="font-bold text-primary">₹{price.price}</span>
                              </div>
                              <div className="flex justify-between mt-1">
                                <span className="text-xs text-muted-foreground">per {item.unit}</span>
                                <Badge variant="outline" className="text-[10px] h-5 px-1 border-slate-200 text-slate-500">
                                  {price.stockStatus}
                                </Badge>
                              </div>
                            </div>
                            <Button size="icon" className="h-8 w-8 rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-white shadow-none">
                              <Plus className="w-4 h-4" />
                            </Button>
                          </div>
                        );
                      })}
                    </div>
                  </ScrollArea>
                </SheetContent>
              </Sheet>
            </CardContent>
          </Card>
        ))}
      </main>
    </div>
  );
}

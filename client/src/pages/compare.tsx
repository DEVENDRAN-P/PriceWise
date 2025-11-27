import { useState } from "react";
import { useApp } from "@/lib/store";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Search, Filter, ArrowUpDown, Navigation } from "lucide-react";

export default function ComparePage() {
  const { items, prices, shops } = useApp();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("price");

  // Group prices by item
  const filteredItems = items.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="bg-white p-4 sticky top-0 z-20 border-b border-gray-100 shadow-sm">
        <h1 className="text-xl font-bold mb-4">Compare Prices</h1>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input 
              placeholder="Search items..." 
              className="pl-9 bg-slate-50"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" size="icon" className="bg-slate-50 border-slate-200">
            <Filter className="w-4 h-4 text-slate-600" />
          </Button>
        </div>
      </header>

      <main className="p-4 space-y-6">
        {filteredItems.map(item => {
          const itemPrices = prices.filter(p => p.itemId === item.id);
          if (itemPrices.length === 0) return null;

          // Sort prices
          const sortedPrices = [...itemPrices].sort((a, b) => {
             if (sortBy === "price") return a.price - b.price;
             return 0;
          });

          const lowestPrice = sortedPrices[0]?.price;

          return (
            <div key={item.id} className="space-y-3">
               <div className="flex items-center gap-3 mb-2">
                 <div className="w-10 h-10 rounded-lg bg-slate-100 overflow-hidden">
                   <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                 </div>
                 <h2 className="font-bold text-lg">{item.name} <span className="text-sm font-normal text-muted-foreground">/ {item.unit}</span></h2>
               </div>

               <div className="grid gap-3">
                 {sortedPrices.map((price, idx) => {
                   const shop = shops.find(s => s.id === price.shopId);
                   if (!shop) return null;
                   
                   const isLowest = price.price === lowestPrice;

                   return (
                     <Card key={price.id} className={`border-none shadow-sm ${isLowest ? 'ring-2 ring-primary ring-offset-1' : ''}`}>
                       <CardContent className="p-4 flex justify-between items-center">
                         <div className="flex-1">
                           <div className="flex items-center gap-2">
                             <h3 className="font-semibold text-sm">{shop.name}</h3>
                             {isLowest && <Badge className="text-[10px] px-1.5 h-5 bg-primary/10 text-primary hover:bg-primary/10 border-none shadow-none">Best Price</Badge>}
                           </div>
                           <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                             <span className="flex items-center gap-1"><Navigation className="w-3 h-3" /> {shop.distance}km</span>
                             <span className={price.stockStatus === 'low' ? 'text-orange-500' : 'text-green-600'}>
                               {price.stockStatus === 'available' ? 'In Stock' : 'Low Stock'}
                             </span>
                           </div>
                         </div>
                         
                         <div className="text-right">
                           <div className="text-xl font-bold text-slate-900">₹{price.price}</div>
                           <div className="text-[10px] text-muted-foreground">Updated today</div>
                         </div>
                       </CardContent>
                     </Card>
                   );
                 })}
               </div>
            </div>
          );
        })}
      </main>
    </div>
  );
}

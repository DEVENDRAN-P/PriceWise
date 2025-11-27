import { useApp } from "@/lib/store";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Plus } from "lucide-react";

export default function CategoryPage() {
  const { getItemsByCategory, getCategories, addToCart } = useApp();
  const [location, setLocation] = useLocation();
  
  // Extract category from URL or get first category
  const category = (location.split("?cat=")[1] || getCategories()[0]) as string;
  const items = getItemsByCategory(category);
  const categories = getCategories();

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      <header className="bg-white p-4 sticky top-0 z-20 border-b border-gray-100 shadow-sm flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => setLocation("/")} className="h-8 w-8">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-xl font-bold flex-1">{category}</h1>
      </header>

      {/* Category Tabs */}
      <div className="bg-white border-b border-slate-100 overflow-x-auto sticky top-14 z-10">
        <div className="flex gap-2 p-3">
          {categories.map(cat => (
            <Button
              key={cat}
              variant={cat === category ? "default" : "outline"}
              size="sm"
              onClick={() => setLocation(`/category?cat=${cat}`)}
              className={cat === category ? "bg-primary text-white" : ""}
            >
              {cat}
            </Button>
          ))}
        </div>
      </div>

      <main className="p-4">
        <div className="grid grid-cols-2 gap-4">
          {items.map(item => (
            <Card key={item.id} className="overflow-hidden border-none shadow-sm group hover:shadow-md transition-shadow">
              <div className="w-full h-40 bg-slate-200 overflow-hidden">
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Crect fill='%23e2e8f0' width='200' height='200'/%3E%3C/svg%3E";
                  }}
                />
              </div>
              <CardContent className="p-3">
                <h3 className="font-bold text-sm truncate">{item.name}</h3>
                <p className="text-xs text-muted-foreground mb-3">per {item.unit}</p>
                
                <Button 
                  size="sm" 
                  className="w-full bg-primary/10 text-primary hover:bg-primary hover:text-white"
                  onClick={() => addToCart(item.id)}
                  data-testid={`button-add-${item.id}`}
                >
                  <Plus className="w-3 h-3 mr-1" /> Add
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}

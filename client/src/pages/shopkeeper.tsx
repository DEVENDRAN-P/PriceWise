import { useState } from "react";
import { useApp } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Plus, TrendingUp, Users, Package } from "lucide-react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

export default function ShopkeeperDashboard() {
  const { items, addPrice } = useApp();
  const [selectedItem, setSelectedItem] = useState("");
  const [price, setPrice] = useState("");

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedItem && price) {
      addPrice({
        itemId: selectedItem,
        shopId: "s1", // Mock current shop
        price: Number(price),
        isOffer: false,
        stockStatus: "available"
      });
      setPrice("");
      setSelectedItem("");
    }
  };

  const chartData = [
    { name: "Mon", visits: 120 },
    { name: "Tue", visits: 150 },
    { name: "Wed", visits: 180 },
    { name: "Thu", visits: 140 },
    { name: "Fri", visits: 210 },
    { name: "Sat", visits: 300 },
    { name: "Sun", visits: 280 },
  ];

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      <header className="bg-primary text-primary-foreground p-6 pb-12 rounded-b-[2rem] shadow-lg">
        <h1 className="text-2xl font-bold">My Shop Dashboard</h1>
        <p className="opacity-80">Manage inventory and prices</p>
      </header>

      <main className="p-4 -mt-8 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="shadow-lg border-none">
            <CardContent className="p-4 flex flex-col items-center justify-center text-center pt-6">
              <TrendingUp className="w-8 h-8 text-primary mb-2" />
              <div className="text-2xl font-bold">₹12.5k</div>
              <div className="text-xs text-muted-foreground">Today's Sales</div>
            </CardContent>
          </Card>
          <Card className="shadow-lg border-none">
            <CardContent className="p-4 flex flex-col items-center justify-center text-center pt-6">
              <Users className="w-8 h-8 text-secondary mb-2" />
              <div className="text-2xl font-bold">142</div>
              <div className="text-xs text-muted-foreground">Customer Visits</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="update" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="update">Update Prices</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="update">
            <Card className="border-none shadow-md">
              <CardHeader>
                <CardTitle>Update Daily Price</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleUpdate} className="space-y-4">
                  <div className="space-y-2">
                    <Label>Select Item</Label>
                    <Select value={selectedItem} onValueChange={setSelectedItem}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose item..." />
                      </SelectTrigger>
                      <SelectContent>
                        {items.map(item => (
                          <SelectItem key={item.id} value={item.id}>{item.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>New Price (₹)</Label>
                    <Input 
                      type="number" 
                      placeholder="0.00" 
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                    />
                  </div>

                  <Button type="submit" className="w-full">
                    <Plus className="w-4 h-4 mr-2" /> Update Price
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
             <Card className="border-none shadow-md">
               <CardHeader>
                 <CardTitle>Weekly Visits</CardTitle>
               </CardHeader>
               <CardContent className="h-[200px]">
                 <ResponsiveContainer width="100%" height="100%">
                   <BarChart data={chartData}>
                     <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                     <YAxis hide />
                     <Bar dataKey="visits" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                   </BarChart>
                 </ResponsiveContainer>
               </CardContent>
             </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

import { useApp } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { LogOut, Award, History, Settings, ChevronRight, Package, Gift, Bell, Shield, CircleHelp } from "lucide-react";
import { useLocation } from "wouter";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export default function ProfilePage() {
  const { user, logout } = useApp();
  const [, setLocation] = useLocation();

  const handleLogout = () => {
    logout();
    setLocation("/auth");
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      <div className="bg-primary h-32 relative">
        <div className="absolute -bottom-12 left-1/2 -translate-x-1/2">
          <Avatar className="w-24 h-24 border-4 border-white shadow-lg">
            <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} />
            <AvatarFallback>{user.name[0]}</AvatarFallback>
          </Avatar>
        </div>
      </div>

      <div className="pt-16 text-center px-4 mb-6">
        <h1 className="text-2xl font-bold">{user.name}</h1>
        <p className="text-muted-foreground capitalize">{user.role}</p>
      </div>

      <main className="px-4 space-y-4">
        {/* Gamification Stats */}
        <Card className="border-none shadow-md bg-gradient-to-br from-slate-900 to-slate-800 text-white">
          <CardContent className="p-6 flex justify-around text-center">
            <div>
              <div className="text-3xl font-bold text-secondary mb-1">{user.points}</div>
              <div className="text-xs text-slate-400 uppercase tracking-wider">Points</div>
            </div>
            <div className="w-px bg-slate-700 mx-4" />
            <div>
              <div className="text-3xl font-bold text-primary mb-1">{user.streaks}</div>
              <div className="text-xs text-slate-400 uppercase tracking-wider">Day Streak</div>
            </div>
          </CardContent>
        </Card>

        {/* Menu */}
        <div className="space-y-2">
          
          {/* Order History Sheet */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="w-full justify-between h-14 px-4 bg-white border-none shadow-sm hover:bg-slate-50">
                <span className="flex items-center gap-3">
                  <History className="w-5 h-5 text-slate-400" /> Order History
                </span>
                <ChevronRight className="w-4 h-4 text-slate-300" />
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-[80vh] rounded-t-[20px]">
              <SheetHeader className="mb-4">
                <SheetTitle>Recent Activity</SheetTitle>
                <SheetDescription>Your past uploads and contributions</SheetDescription>
              </SheetHeader>
              <ScrollArea className="h-[60vh] pr-4">
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-start gap-4 pb-4 border-b border-slate-100 last:border-0">
                      <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                        <Package className="w-5 h-5 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold">Bill Upload - Fresh Mart</h4>
                        <p className="text-xs text-muted-foreground">Verified 3 items • Earned 10 pts</p>
                        <div className="mt-2 flex gap-2">
                          <span className="text-xs bg-slate-100 px-2 py-1 rounded">Tomato (1kg)</span>
                          <span className="text-xs bg-slate-100 px-2 py-1 rounded">Onion (1kg)</span>
                        </div>
                      </div>
                      <span className="text-xs font-medium text-slate-400">2d ago</span>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </SheetContent>
          </Sheet>
          
          {/* Rewards Sheet */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="w-full justify-between h-14 px-4 bg-white border-none shadow-sm hover:bg-slate-50">
                <span className="flex items-center gap-3">
                  <Award className="w-5 h-5 text-slate-400" /> Rewards
                </span>
                <ChevronRight className="w-4 h-4 text-slate-300" />
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-[80vh] rounded-t-[20px]">
              <SheetHeader className="mb-6">
                <div className="flex items-center justify-between">
                  <SheetTitle>My Rewards</SheetTitle>
                  <Badge className="bg-secondary text-white border-none">{user.points} pts available</Badge>
                </div>
                <SheetDescription>Redeem your points for exclusive coupons</SheetDescription>
              </SheetHeader>
              <ScrollArea className="h-[60vh] pr-4">
                <div className="space-y-4">
                   <Card className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white border-none">
                     <CardContent className="p-4 flex items-center gap-4">
                       <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                         <Gift className="w-6 h-6 text-white" />
                       </div>
                       <div className="flex-1">
                         <h4 className="font-bold">₹50 Off Coupon</h4>
                         <p className="text-xs text-white/80">Valid at Fresh Mart</p>
                       </div>
                       <Button size="sm" className="bg-white text-purple-600 hover:bg-white/90">Claim</Button>
                     </CardContent>
                   </Card>
                   <Card className="border border-slate-200 shadow-sm opacity-75">
                     <CardContent className="p-4 flex items-center gap-4">
                       <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center">
                         <Gift className="w-6 h-6 text-slate-400" />
                       </div>
                       <div className="flex-1">
                         <h4 className="font-bold text-slate-700">₹100 Off Coupon</h4>
                         <p className="text-xs text-muted-foreground">Requires 500 pts</p>
                       </div>
                       <Button size="sm" disabled variant="secondary">Locked</Button>
                     </CardContent>
                   </Card>
                </div>
              </ScrollArea>
            </SheetContent>
          </Sheet>

          {/* Settings Sheet */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="w-full justify-between h-14 px-4 bg-white border-none shadow-sm hover:bg-slate-50">
                <span className="flex items-center gap-3">
                  <Settings className="w-5 h-5 text-slate-400" /> Settings
                </span>
                <ChevronRight className="w-4 h-4 text-slate-300" />
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-[60vh] rounded-t-[20px]">
              <SheetHeader className="mb-6">
                <SheetTitle>Settings</SheetTitle>
              </SheetHeader>
              <div className="space-y-6">
                <div className="space-y-4">
                  <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Notifications</h4>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                       <Bell className="w-4 h-4 text-slate-600" />
                       <Label htmlFor="price-alerts">Price Drop Alerts</Label>
                    </div>
                    <Switch id="price-alerts" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                       <Package className="w-4 h-4 text-slate-600" />
                       <Label htmlFor="stock-alerts">Stock Updates</Label>
                    </div>
                    <Switch id="stock-alerts" />
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Support</h4>
                  <Button variant="ghost" className="w-full justify-start px-0 h-auto font-normal">
                    <Shield className="w-4 h-4 mr-2" /> Privacy Policy
                  </Button>
                  <Button variant="ghost" className="w-full justify-start px-0 h-auto font-normal">
                    <CircleHelp className="w-4 h-4 mr-2" /> Help & Support
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        <Button 
          variant="destructive" 
          className="w-full mt-8" 
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4 mr-2" /> Log Out
        </Button>
      </main>
    </div>
  );
}

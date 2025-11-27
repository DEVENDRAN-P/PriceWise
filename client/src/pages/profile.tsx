import { useApp } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut, Award, History, Settings, ChevronRight } from "lucide-react";
import { useLocation } from "wouter";

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
          <Button variant="outline" className="w-full justify-between h-14 px-4 bg-white border-none shadow-sm hover:bg-slate-50">
            <span className="flex items-center gap-3">
              <History className="w-5 h-5 text-slate-400" /> Order History
            </span>
            <ChevronRight className="w-4 h-4 text-slate-300" />
          </Button>
          
          <Button variant="outline" className="w-full justify-between h-14 px-4 bg-white border-none shadow-sm hover:bg-slate-50">
            <span className="flex items-center gap-3">
              <Award className="w-5 h-5 text-slate-400" /> Rewards
            </span>
            <ChevronRight className="w-4 h-4 text-slate-300" />
          </Button>

          <Button variant="outline" className="w-full justify-between h-14 px-4 bg-white border-none shadow-sm hover:bg-slate-50">
            <span className="flex items-center gap-3">
              <Settings className="w-5 h-5 text-slate-400" /> Settings
            </span>
            <ChevronRight className="w-4 h-4 text-slate-300" />
          </Button>
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

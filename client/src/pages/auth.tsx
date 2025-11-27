import { useState } from "react";
import { useApp } from "@/lib/store";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ShoppingBag, Store } from "lucide-react";
import { motion } from "framer-motion";

export default function AuthPage() {
  const { login } = useApp();
  const [, setLocation] = useLocation();
  const [role, setRole] = useState<"customer" | "shopkeeper">("customer");
  const [email, setEmail] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    login(email, role);
    setLocation("/");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-[-10%] right-[-10%] w-64 h-64 bg-secondary/10 rounded-full blur-3xl" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md z-10"
      >
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary mb-2 tracking-tight">PriceWise</h1>
          <p className="text-muted-foreground">Hyperlocal Market Transparency</p>
        </div>

        <Card className="border-none shadow-xl bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Welcome Back</CardTitle>
            <CardDescription>Enter your details to continue</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="customer" onValueChange={(v) => setRole(v as any)} className="mb-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="customer" className="flex gap-2">
                  <ShoppingBag className="w-4 h-4" /> Customer
                </TabsTrigger>
                <TabsTrigger value="shopkeeper" className="flex gap-2">
                  <Store className="w-4 h-4" /> Shopkeeper
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email or Phone</Label>
                <Input 
                  id="email" 
                  placeholder="user@example.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required 
                  className="bg-white"
                />
              </div>
              
              <Button type="submit" className="w-full text-base py-5 shadow-lg shadow-primary/20">
                {role === "customer" ? "Start Saving" : "Manage Shop"}
              </Button>
            </form>
            
            <div className="mt-6 text-center text-sm text-muted-foreground">
              <p>By continuing, you agree to our Terms & Conditions.</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

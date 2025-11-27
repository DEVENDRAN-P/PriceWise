import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { AppProvider, useApp } from "@/lib/store";
import { MobileNav } from "@/components/layout/mobile-nav";

import NotFound from "@/pages/not-found";
import AuthPage from "@/pages/auth";
import Home from "@/pages/home";
import ComparePage from "@/pages/compare";
import ShopkeeperDashboard from "@/pages/shopkeeper";
import UploadPage from "@/pages/upload";
import ShopsPage from "@/pages/shops";
import MapPage from "@/pages/map";
import ProfilePage from "@/pages/profile";
import CategoryPage from "@/pages/category";
import { useEffect } from "react";

function PrivateRoute({ component: Component, ...rest }: any) {
  const { user } = useApp();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!user) {
      setLocation("/auth");
    }
  }, [user, setLocation]);

  if (!user) return null;
  return <Component {...rest} />;
}

function Router() {
  return (
    <Switch>
      <Route path="/auth" component={AuthPage} />
      
      {/* Protected Routes */}
      <Route path="/">
        {() => <PrivateRoute component={Home} />}
      </Route>
      <Route path="/compare">
        {() => <PrivateRoute component={ComparePage} />}
      </Route>
      <Route path="/shopkeeper">
        {() => <PrivateRoute component={ShopkeeperDashboard} />}
      </Route>
      <Route path="/upload">
        {() => <PrivateRoute component={UploadPage} />}
      </Route>
      <Route path="/shops">
        {() => <PrivateRoute component={ShopsPage} />}
      </Route>
      <Route path="/map">
        {() => <PrivateRoute component={MapPage} />}
      </Route>
      <Route path="/profile">
        {() => <PrivateRoute component={ProfilePage} />}
      </Route>
      <Route path="/category">
        {() => <PrivateRoute component={CategoryPage} />}
      </Route>
      
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppProvider>
        <div className="font-sans bg-background min-h-screen text-foreground">
          <Router />
          <MobileNav />
          <Toaster />
        </div>
      </AppProvider>
    </QueryClientProvider>
  );
}

export default App;

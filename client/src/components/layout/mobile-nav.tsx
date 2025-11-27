import { Link, useLocation } from "wouter";
import { Home, Search, ScanLine, Store, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useApp } from "@/lib/store";

export function MobileNav() {
  const [location] = useLocation();
  const { user } = useApp();

  if (!user) return null;

  const links = [
    { href: "/", icon: Home, label: "Home" },
    { href: "/compare", icon: Search, label: "Compare" },
    { href: "/upload", icon: ScanLine, label: "Scan Bill", primary: true },
    ...(user.role === "shopkeeper" 
      ? [{ href: "/shopkeeper", icon: Store, label: "My Shop" }]
      : [{ href: "/shops", icon: Store, label: "Shops" }]
    ),
    { href: "/profile", icon: User, label: "Profile" },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 py-2 px-4 pb-safe z-50 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
      <div className="flex justify-around items-end max-w-md mx-auto">
        {links.map((link) => {
          const isActive = location === link.href;
          const Icon = link.icon;
          
          if (link.primary) {
            return (
              <Link key={link.href} href={link.href}>
                <div className={cn(
                  "relative -top-5 bg-primary text-primary-foreground p-4 rounded-full shadow-lg transform transition-transform active:scale-95 border-4 border-white",
                  isActive && "bg-primary ring-2 ring-primary ring-offset-2"
                )}>
                  <Icon className="w-6 h-6" />
                </div>
              </Link>
            );
          }

          return (
            <Link key={link.href} href={link.href}>
              <div className={cn(
                "flex flex-col items-center gap-1 p-2 transition-colors",
                isActive ? "text-primary" : "text-muted-foreground"
              )}>
                <Icon className={cn("w-6 h-6", isActive && "fill-current")} strokeWidth={isActive ? 2.5 : 2} />
                <span className="text-[10px] font-medium">{link.label}</span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

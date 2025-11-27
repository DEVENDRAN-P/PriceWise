import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Camera, Upload, CheckCircle2, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function UploadPage() {
  const [scanning, setScanning] = useState(false);
  const [scanned, setScanned] = useState(false);
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const handleScan = () => {
    setScanning(true);
    // Simulate OCR delay
    setTimeout(() => {
      setScanning(false);
      setScanned(true);
    }, 2000);
  };

  const handleConfirm = () => {
    toast({
      title: "Points Earned!",
      description: "You earned 10 points for contributing price data.",
    });
    setLocation("/");
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 text-white relative">
      {!scanned ? (
        <>
          <div className="w-full max-w-sm aspect-[3/4] border-2 border-white/30 rounded-3xl relative overflow-hidden bg-gray-900">
            {scanning && (
              <div className="absolute inset-0 bg-primary/20 animate-pulse flex items-center justify-center">
                <Loader2 className="w-12 h-12 animate-spin text-primary" />
              </div>
            )}
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-white/50 text-sm">Align bill within frame</p>
            </div>
            {/* Camera Corners */}
            <div className="absolute top-4 left-4 w-8 h-8 border-t-4 border-l-4 border-primary rounded-tl-xl" />
            <div className="absolute top-4 right-4 w-8 h-8 border-t-4 border-r-4 border-primary rounded-tr-xl" />
            <div className="absolute bottom-4 left-4 w-8 h-8 border-b-4 border-l-4 border-primary rounded-bl-xl" />
            <div className="absolute bottom-4 right-4 w-8 h-8 border-b-4 border-r-4 border-primary rounded-br-xl" />
          </div>

          <div className="mt-8 flex gap-6">
             <Button size="lg" variant="secondary" className="rounded-full h-16 w-16 p-0" onClick={handleScan}>
               <Camera className="w-8 h-8" />
             </Button>
          </div>
        </>
      ) : (
        <Card className="w-full max-w-md bg-white text-slate-900 animate-in fade-in slide-in-from-bottom-10 duration-500">
          <CardContent className="p-6 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-xl font-bold mb-2">Bill Scanned!</h2>
            <p className="text-muted-foreground mb-6">We found 3 items from "Fresh Mart".</p>
            
            <div className="bg-slate-50 rounded-lg p-4 text-left mb-6 space-y-2">
              <div className="flex justify-between text-sm">
                <span>Tomato (1kg)</span>
                <span className="font-bold">₹40</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Onion (1kg)</span>
                <span className="font-bold">₹30</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Milk (1L)</span>
                <span className="font-bold">₹60</span>
              </div>
            </div>

            <Button className="w-full" onClick={handleConfirm}>
              Verify & Earn Points
            </Button>
          </CardContent>
        </Card>
      )}
      
      <Button variant="ghost" className="absolute top-4 right-4 text-white hover:bg-white/10" onClick={() => setLocation("/")}>
        Cancel
      </Button>
    </div>
  );
}

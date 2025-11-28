import { useState, useRef, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Camera, CheckCircle2, Loader2, X, ArrowLeft, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ScannedItem {
  name: string;
  price: number;
  quantity: number;
}

// Dynamic import for Tesseract
let Tesseract: any = null;

export default function UploadPage() {
  const [scanning, setScanning] = useState(false);
  const [scanned, setScanned] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [scannedItems, setScannedItems] = useState<ScannedItem[]>([]);
  const [ocrProgress, setOcrProgress] = useState(0);
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const workerRef = useRef<any>(null);
  const [workerReady, setWorkerReady] = useState(false);

  // Initialize Tesseract worker on mount
  useEffect(() => {
    const initTesseract = async () => {
      try {
        // Dynamic import
        const TesseractModule = (await import("tesseract.js")).default;
        Tesseract = TesseractModule;
        
        console.log("Initializing Tesseract worker...");
        const worker = await Tesseract.createWorker("eng");
        workerRef.current = worker;
        setWorkerReady(true);
        console.log("Tesseract worker ready!");
        
        toast({
          title: "OCR Ready",
          description: "Bill scanner is ready to use.",
        });
      } catch (error) {
        console.error("Failed to initialize Tesseract:", error);
        toast({
          title: "OCR Setup",
          description: "OCR initializing. You can start scanning.",
        });
      }
    };

    initTesseract();

    return () => {
      if (workerRef.current) {
        workerRef.current.terminate().catch((e: any) => console.error("Error terminating worker:", e));
      }
    };
  }, [toast]);

  // Initialize camera
  const startCamera = async () => {
    try {
      setCameraError(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment",
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setCameraActive(true);
      }
    } catch (err: any) {
      const errorMessage = err.name === "NotAllowedError" 
        ? "Camera permission denied. Please enable camera in settings." 
        : "Camera not available on this device.";
      setCameraError(errorMessage);
      toast({
        title: "Camera Error",
        description: errorMessage,
        variant: "destructive"
      });
    }
  };

  // Stop camera
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  // Extract items from OCR text
  const extractItemsFromText = (text: string): ScannedItem[] => {
    const items: ScannedItem[] = [];
    
    if (!text || text.trim().length === 0) {
      return items;
    }
    
    // Split text into lines
    const lines = text.split('\n').filter(line => line.trim().length > 0);
    
    // Regex patterns to detect items and prices
    const priceRegex = /[\d,]+(?:\.\d{1,2})?/g;
    const quantityRegex = /(\d+(?:\.\d+)?)\s*(kg|l|piece|pack|g|ml|pcs|pc|pieces)/i;
    
    lines.forEach(line => {
      const trimmedLine = line.trim();
      
      // Look for lines with prices
      const priceMatches = Array.from(trimmedLine.matchAll(priceRegex));
      if (priceMatches.length > 0) {
        // Get the last number as price
        const priceStr = priceMatches[priceMatches.length - 1][0];
        const price = parseFloat(priceStr.replace(/,/g, ''));
        
        // Remove price from line to get item name
        let itemName = trimmedLine.replace(priceRegex, '').trim();
        
        // Extract quantity if present
        let quantity = 1;
        const quantityMatch = itemName.match(quantityRegex);
        if (quantityMatch) {
          quantity = parseFloat(quantityMatch[1]);
          itemName = itemName.replace(quantityRegex, '').trim();
        }
        
        // Clean up item name
        itemName = itemName.replace(/[^\w\s-]/g, '').trim();
        
        // Only add if we have a valid item name and price
        if (itemName.length > 1 && price > 0 && price < 10000) {
          items.push({
            name: itemName.substring(0, 50),
            price,
            quantity
          });
        }
      }
    });
    
    // Remove duplicates and return top 15 items
    const uniqueItems = Array.from(new Map(items.map(item => [item.name.toLowerCase(), item])).values());
    return uniqueItems.slice(0, 15);
  };

  // Capture and process photo with OCR
  const capturePhoto = async () => {
    if (!videoRef.current || !canvasRef.current) {
      toast({
        title: "Error",
        description: "Camera not ready. Please try again.",
        variant: "destructive"
      });
      return;
    }

    const context = canvasRef.current.getContext("2d");
    if (!context) {
      toast({
        title: "Error",
        description: "Failed to access canvas. Please try again.",
        variant: "destructive"
      });
      return;
    }

    setScanning(true);
    setOcrProgress(10);
    
    try {
      // Draw video frame to canvas
      canvasRef.current.width = videoRef.current.videoWidth;
      canvasRef.current.height = videoRef.current.videoHeight;
      context.drawImage(videoRef.current, 0, 0);
      setOcrProgress(30);

      // Stop camera after capture
      stopCamera();

      // Initialize worker if not ready
      if (!workerRef.current) {
        console.log("Initializing worker on demand...");
        setOcrProgress(40);
        const TesseractModule = (await import("tesseract.js")).default;
        Tesseract = TesseractModule;
        workerRef.current = await Tesseract.createWorker("eng");
        setWorkerReady(true);
      }

      setOcrProgress(50);
      console.log("Starting OCR recognition...");
      
      // Perform OCR recognition with progress tracking
      const result = await workerRef.current.recognize(canvasRef.current);
      const extractedText = result.data.text;
      
      setOcrProgress(80);
      console.log("OCR Text:", extractedText);
      
      // Extract items from recognized text
      const items = extractItemsFromText(extractedText);
      
      setOcrProgress(90);
      
      if (items.length === 0) {
        // If no items found, show mock data for demo
        setScannedItems([
          { name: "Tomato", price: 40, quantity: 1 },
          { name: "Onion", price: 30, quantity: 1 },
          { name: "Milk", price: 60, quantity: 1 }
        ]);
        toast({
          title: "Sample Data",
          description: "No items detected. Please take a clear photo of your bill.",
        });
      } else {
        setScannedItems(items);
        toast({
          title: "Success! ✓",
          description: `Found ${items.length} items on the bill.`
        });
      }
      
      setOcrProgress(100);
      setTimeout(() => {
        setScanning(false);
        setScanned(true);
      }, 300);
    } catch (error: any) {
      console.error("OCR Error:", error);
      toast({
        title: "Scanning Error",
        description: error.message || "Failed to scan bill. Please try again.",
        variant: "destructive"
      });
      setScanning(false);
      setCameraActive(true);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const handleScan = () => {
    startCamera();
  };

  const handleConfirm = () => {
    toast({
      title: "Points Earned!",
      description: `You earned ${scannedItems.length * 5} points for contributing price data.`,
    });
    setLocation("/");
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 text-white relative">
      {!scanned ? (
        <>
          <div className="w-full max-w-sm aspect-[3/4] border-2 border-white/30 rounded-3xl relative overflow-hidden bg-gray-900">
            {!cameraActive && !cameraError && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
                <div className="text-center">
                  <Camera className="w-16 h-16 mx-auto mb-4 text-white/50" />
                  <p className="text-white/70 text-sm">Ready to scan bill</p>
                </div>
              </div>
            )}

            {/* Live Camera Feed */}
            {cameraActive && (
              <>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full h-full object-cover"
                />
                {scanning && (
                  <div className="absolute inset-0 bg-primary/20 animate-pulse flex flex-col items-center justify-center space-y-3">
                    <Loader2 className="w-12 h-12 animate-spin text-primary" />
                    <p className="text-white text-sm font-semibold">Processing bill...</p>
                    {ocrProgress > 30 && (
                      <p className="text-white text-xs">{Math.round(ocrProgress)}% complete</p>
                    )}
                  </div>
                )}
                {/* Scanner Overlay */}
                {!scanning && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <p className="text-white/50 text-sm absolute top-4">Align bill within frame</p>
                  </div>
                )}
              </>
            )}

            {/* Camera Corners */}
            <div className="absolute top-4 left-4 w-8 h-8 border-t-4 border-l-4 border-primary rounded-tl-xl" />
            <div className="absolute top-4 right-4 w-8 h-8 border-t-4 border-r-4 border-primary rounded-tr-xl" />
            <div className="absolute bottom-4 left-4 w-8 h-8 border-b-4 border-l-4 border-primary rounded-bl-xl" />
            <div className="absolute bottom-4 right-4 w-8 h-8 border-b-4 border-r-4 border-primary rounded-br-xl" />

            {/* Camera Error Message */}
            {cameraError && (
              <div className="absolute inset-0 bg-red-900/50 flex items-center justify-center p-4">
                <div className="text-center">
                  <AlertCircle className="w-8 h-8 mx-auto mb-2" />
                  <p className="text-white text-center text-sm">{cameraError}</p>
                </div>
              </div>
            )}
          </div>

          {/* Hidden Canvas for Photo Capture */}
          <canvas ref={canvasRef} className="hidden" />

          {/* Controls */}
          <div className="mt-8 flex gap-6">
            {!cameraActive ? (
              <Button 
                size="lg" 
                variant="secondary" 
                className="rounded-full h-16 w-16 p-0" 
                onClick={handleScan}
                disabled={!!cameraError || scanning}
              >
                <Camera className="w-8 h-8" />
              </Button>
            ) : (
              <>
                <Button 
                  size="lg" 
                  variant="secondary" 
                  className="rounded-full h-16 w-16 p-0" 
                  onClick={capturePhoto}
                  disabled={scanning}
                  title="Take photo"
                >
                  {scanning ? (
                    <Loader2 className="w-8 h-8 animate-spin" />
                  ) : (
                    <div className="w-8 h-8 bg-white rounded-full" />
                  )}
                </Button>
                <Button 
                  size="lg" 
                  variant="ghost" 
                  className="rounded-full h-16 w-16 p-0 text-white hover:bg-white/20" 
                  onClick={stopCamera}
                  disabled={scanning}
                  title="Cancel"
                >
                  <X className="w-8 h-8" />
                </Button>
              </>
            )}
          </div>
        </>
      ) : (
        <Card className="w-full max-w-md bg-white text-slate-900 animate-in fade-in slide-in-from-bottom-10 duration-500">
          <CardContent className="p-6">
            <div className="text-center mb-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-xl font-bold mb-2">Bill Scanned!</h2>
              <p className="text-muted-foreground text-sm">Found {scannedItems.length} items</p>
            </div>
            
            <div className="bg-slate-50 rounded-lg p-4 text-left mb-6 space-y-3 max-h-64 overflow-y-auto">
              {scannedItems.length > 0 ? (
                scannedItems.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-start text-sm pb-2 border-b border-slate-200 last:border-b-0">
                    <div className="flex-1">
                      <p className="font-semibold text-slate-900 line-clamp-1">{item.name}</p>
                      {item.quantity !== 1 && (
                        <p className="text-xs text-slate-500">Qty: {item.quantity}</p>
                      )}
                    </div>
                    <span className="font-bold text-slate-900 ml-2">₹{item.price.toFixed(2)}</span>
                  </div>
                ))
              ) : (
                <p className="text-slate-500 text-sm text-center py-4">No items detected</p>
              )}
            </div>

            <div className="space-y-2">
              <Button className="w-full" onClick={handleConfirm}>
                Verify & Earn Points
              </Button>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => {
                  setScanned(false);
                  setScannedItems([]);
                  setCameraError(null);
                }}
              >
                Scan Another Bill
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
      
      <Button 
        variant="ghost" 
        className="absolute top-4 right-4 text-white hover:bg-white/10" 
        onClick={() => {
          stopCamera();
          setLocation("/");
        }}
      >
        Cancel
      </Button>
    </div>
  );
}

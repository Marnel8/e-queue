"use client";

import { useEffect, useRef, useState } from "react";
import QrScanner from "qr-scanner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Camera, X, RotateCcw } from "lucide-react";

interface QRScannerProps {
  onScanResult: (result: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export function QRScannerComponent({ onScanResult, isOpen, onClose }: QRScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [qrScanner, setQrScanner] = useState<QrScanner | null>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [error, setError] = useState<string>("");
  const [cameras, setCameras] = useState<QrScanner.Camera[]>([]);
  const [currentCameraIndex, setCurrentCameraIndex] = useState(0);
  const [isScanning, setIsScanning] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);

  // Initialize scanner when dialog opens
  useEffect(() => {
    if (isOpen) {
      // Small delay to ensure video element is properly mounted
      const timer = setTimeout(() => {
        if (videoRef.current) {
          initializeScanner();
        }
      }, 100);

      return () => clearTimeout(timer);
    } else if (!isOpen && qrScanner) {
      cleanupScanner();
    }

    return () => {
      cleanupScanner();
    };
  }, [isOpen]);

  const initializeScanner = async () => {
    if (!videoRef.current) return;

    try {
      setError("");
      setIsScanning(false);
      setIsLoading(true);

      // First, request camera permissions explicitly
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment', // Use back camera by default
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      });

      // Stop the test stream
      stream.getTracks().forEach(track => track.stop());

      // Get available cameras
      const availableCameras = await QrScanner.listCameras(true);
      setCameras(availableCameras);
      
      // Auto-detect orientation based on camera type
      const currentCamera = availableCameras[currentCameraIndex];
      if (currentCamera) {
        // Front cameras often need flipping, back cameras usually don't
        const needsFlip = currentCamera.label.toLowerCase().includes('front') || 
                         currentCamera.label.toLowerCase().includes('user');
        setIsFlipped(needsFlip);
      }

      // Create scanner instance
      const scanner = new QrScanner(
        videoRef.current,
        (result) => {
          onScanResult(result.data);
          onClose();
        },
        {
          highlightScanRegion: true,
          highlightCodeOutline: true,
          maxScansPerSecond: 5,
          preferredCamera: availableCameras[currentCameraIndex]?.id || "environment",
          // Ensure proper video orientation
          returnDetailedScanResult: true,
        }
      );

      setQrScanner(scanner);

      // Start scanning
      await scanner.start();
      setHasPermission(true);
      setIsScanning(true);
      setIsLoading(false);
      
      // Debug: Log video element properties
      if (videoRef.current) {
        console.log('Video element properties:', {
          videoWidth: videoRef.current.videoWidth,
          videoHeight: videoRef.current.videoHeight,
          style: videoRef.current.style.cssText,
          transform: getComputedStyle(videoRef.current).transform
        });
      }
    } catch (err) {
      console.error("QR Scanner error:", err);
      if (err instanceof Error && err.name === 'NotAllowedError') {
        setError("Camera access denied. Please allow camera permissions and try again.");
      } else if (err instanceof Error && err.name === 'NotFoundError') {
        setError("No camera found on this device.");
      } else if (err instanceof Error && err.name === 'NotSupportedError') {
        setError("Camera not supported on this device or browser.");
      } else {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to initialize camera. Please ensure camera permissions are granted."
        );
      }
      setHasPermission(false);
      setIsScanning(false);
    }
  };

  const cleanupScanner = () => {
    if (qrScanner) {
      qrScanner.stop();
      qrScanner.destroy();
      setQrScanner(null);
    }
    setIsScanning(false);
  };

  const switchCamera = async () => {
    if (!qrScanner || cameras.length <= 1) return;

    const nextIndex = (currentCameraIndex + 1) % cameras.length;
    setCurrentCameraIndex(nextIndex);

    try {
      await qrScanner.setCamera(cameras[nextIndex].id);
      
      // Update orientation for new camera
      const newCamera = cameras[nextIndex];
      if (newCamera) {
        const needsFlip = newCamera.label.toLowerCase().includes('front') || 
                         newCamera.label.toLowerCase().includes('user');
        setIsFlipped(needsFlip);
      }
    } catch (err) {
      console.error("Failed to switch camera:", err);
      setError("Failed to switch camera");
    }
  };

  const retryScanner = () => {
    cleanupScanner();
    setTimeout(initializeScanner, 100);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md w-full mx-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-[#071952]">
            <Camera className="w-5 h-5" />
            Scan QR Code
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {error ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Camera className="w-8 h-8 text-red-600" />
              </div>
              <p className="text-red-600 font-medium mb-4">{error}</p>
              <Button onClick={retryScanner} className="gradient-primary text-white">
                <RotateCcw className="w-4 h-4 mr-2" />
                Try Again
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Camera View */}
              <div className="relative bg-black rounded-lg overflow-hidden">
                <video
                  ref={videoRef}
                  className="w-full h-64 object-cover"
                  playsInline
                  muted
                  autoPlay
                  style={{ 
                    transform: isFlipped ? 'scaleX(-1)' : 'none',
                    filter: 'none'
                  }}
                />
                
                {/* Scanning overlay */}
                {isScanning && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-48 h-48 border-2 border-white rounded-lg relative">
                      <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-[#37B7C3] rounded-tl-lg"></div>
                      <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-[#37B7C3] rounded-tr-lg"></div>
                      <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-[#37B7C3] rounded-bl-lg"></div>
                      <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-[#37B7C3] rounded-br-lg"></div>
                      
                      {/* Scanning line animation */}
                      <div className="absolute inset-x-0 top-1/2 h-0.5 bg-[#37B7C3] animate-pulse"></div>
                    </div>
                  </div>
                )}

                {/* Camera controls */}
                <div className="absolute top-4 right-4 flex gap-2">
                  {/* Flip orientation button */}
                  <Button
                    onClick={() => setIsFlipped(!isFlipped)}
                    size="sm"
                    className="bg-black/50 hover:bg-black/70 text-white border-white"
                    variant="outline"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </Button>
                  
                  {/* Camera switch button */}
                  {cameras.length > 1 && isScanning && (
                    <Button
                      onClick={switchCamera}
                      size="sm"
                      className="bg-black/50 hover:bg-black/70 text-white border-white"
                      variant="outline"
                    >
                      <Camera className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>

              {/* Instructions */}
              <div className="text-center text-sm text-gray-600">
                <p className="font-medium mb-2">Position the QR code within the frame</p>
                <p>The scanner will automatically detect and process the code</p>
              </div>

              {/* Controls */}
              <div className="flex gap-3">
                <Button
                  onClick={onClose}
                  variant="outline"
                  className="flex-1 border-2 border-gray-300"
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

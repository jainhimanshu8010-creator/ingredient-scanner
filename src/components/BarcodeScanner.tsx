import { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { Camera, X, AlertCircle, RefreshCw } from 'lucide-react';

interface BarcodeScannerProps {
  onScanSuccess: (barcode: string) => void;
}

export function BarcodeScanner({ onScanSuccess }: BarcodeScannerProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errorType, setErrorType] = useState<'permission' | 'notfound' | 'generic' | null>(null);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const [manualBarcode, setManualBarcode] = useState('');

  const checkCameraPermission = async (): Promise<boolean> => {
    try {
      const permission = await navigator.permissions.query({ name: 'camera' as PermissionName });
      return permission.state === 'granted' || permission.state === 'prompt';
    } catch {
      return true;
    }
  };

  const startScanning = async () => {
    setError(null);
    setErrorType(null);

    try {
      const hasPermission = await checkCameraPermission();
      if (!hasPermission) {
        setError('Camera permission denied. Please allow camera access in your browser settings and reload the page.');
        setErrorType('permission');
        return;
      }

      let devices;
      try {
        devices = await Html5Qrcode.getCameras();
      } catch (deviceError) {
        console.error('Device enumeration error:', deviceError);
        setError('Camera not found or not accessible. Make sure you\'re using HTTPS or localhost, and camera permissions are allowed.');
        setErrorType('notfound');
        return;
      }

      if (!devices || devices.length === 0) {
        setError('No camera detected on this device. Please use manual entry below.');
        setErrorType('notfound');
        return;
      }

      const scanner = new Html5Qrcode('reader');
      scannerRef.current = scanner;

      const backCamera = devices.find(device =>
        device.label.toLowerCase().includes('back') ||
        device.label.toLowerCase().includes('rear') ||
        device.label.toLowerCase().includes('environment')
      );
      const cameraId = backCamera?.id || devices[0].id;

      let bestCameraId = devices[0].id;
      const backCam = devices.find(d =>
        d.label.toLowerCase().includes('back') ||
        d.label.toLowerCase().includes('rear') ||
        d.label.toLowerCase().includes('environment')
      );
      if (backCam) bestCameraId = backCam.id;

      const config = {
        fps: 10,
        qrbox: { width: 300, height: 120 },
        aspectRatio: 1.777778,
      };

      try {
        await scanner.start(
          cameraId,
          config,
          (decodedText) => {
            stopScanning();
            onScanSuccess(decodedText);
          },
          (errorMessage) => {
            console.log('Scan error:', errorMessage);
          }
        );

        setIsScanning(true);
      } catch (startError: any) {
        console.error('Start error:', startError);

        if (startError.name === 'NotAllowedError') {
          setError('Camera permission denied. Please click the camera icon in your browser\'s address bar and allow access, then try again.');
          setErrorType('permission');
        } else if (startError.name === 'NotFoundError') {
          setError('No camera found. Please connect a camera or use manual entry.');
          setErrorType('notfound');
        } else if (startError.name === 'NotReadableError') {
          setError('Camera is already in use by another application. Please close other apps using the camera and try again.');
          setErrorType('generic');
        } else if (startError.name === 'OverconstrainedError') {
          setError('Camera constraints cannot be satisfied. Try using manual entry.');
          setErrorType('generic');
        } else if (startError.name === 'TypeError' || startError.name === 'SecurityError') {
          setError('Camera access requires HTTPS. Please ensure you\'re using https:// or localhost.');
          setErrorType('permission');
        } else {
          setError('Failed to start camera: ' + (startError.message || 'Unknown error. Please try manual entry.'));
          setErrorType('generic');
        }

        try {
          await scanner.clear();
        } catch (e) {}
        scannerRef.current = null;
      }
    } catch (err: any) {
      console.error('Error initializing scanner:', err);
      setError('Failed to access camera. ' + (err.message || 'Please check permissions or use manual entry.'));
      setErrorType('generic');
    }
  };

  const stopScanning = async () => {
    if (scannerRef.current) {
      try {
        const state = scannerRef.current.getState();
        if (state === 2) {
          await scannerRef.current.stop();
        }
        await scannerRef.current.clear();
      } catch (err) {
        console.error('Error stopping scanner:', err);
      }
      scannerRef.current = null;
    }
    setIsScanning(false);
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setErrorType(null);
    if (manualBarcode.trim()) {
      onScanSuccess(manualBarcode.trim());
      setManualBarcode('');
    }
  };

  const handleRetry = () => {
    setError(null);
    setErrorType(null);
    startScanning();
  };

  useEffect(() => {
    return () => {
      if (scannerRef.current) {
        try {
          const state = scannerRef.current.getState();
          if (state === 2) {
            scannerRef.current.stop().catch(console.error);
          }
        } catch (e) {}
      }
    };
  }, []);

  const getErrorTitle = () => {
    switch (errorType) {
      case 'permission':
        return 'Permission Required';
      case 'notfound':
        return 'Camera Not Found';
      default:
        return 'Camera Error';
    }
  };

  const getErrorSolution = () => {
    switch (errorType) {
      case 'permission':
        return 'Click the lock/camera icon in your browser address bar, allow camera access, then reload the page.';
      case 'notfound':
        return 'Please connect a camera or use the manual barcode entry below.';
      default:
        return 'Try refreshing the page or use manual barcode entry below.';
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-gradient-to-b from-slate-800/80 to-slate-900/80 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden border border-slate-700/50">
        <div className="bg-gradient-to-br from-emerald-600 to-emerald-700 px-6 py-8">
          <h2 className="text-2xl font-bold text-white text-center">
            Scan To Decode
          </h2>
          <p className="text-emerald-100 text-center mt-2 text-sm">
            Point your camera at a barcode
          </p>
        </div>

        <div className="p-8">
          {error && (
            <div className="mb-5 bg-red-500/15 border border-red-500/30 rounded-xl p-5">
              <div className="flex items-start gap-3 mb-3">
                <AlertCircle size={22} className="text-red-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-red-300 text-sm font-bold mb-1">{getErrorTitle()}</p>
                  <p className="text-xs text-slate-300 mb-3">{getErrorSolution()}</p>
                </div>
              </div>
              {errorType && (
                <button
                  onClick={handleRetry}
                  className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 transition duration-300"
                >
                  <RefreshCw size={16} />
                  Retry Camera Access
                </button>
              )}
            </div>
          )}

          {!isScanning ? (
            <div className="space-y-5">
              <button
                onClick={startScanning}
                className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold py-5 px-6 rounded-lg flex items-center justify-center gap-3 transition duration-300 transform hover:scale-105 active:scale-95 shadow-lg"
              >
                <Camera size={28} />
                <span className="text-lg">Open Camera</span>
              </button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-600"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-slate-900 text-slate-400 font-medium">Or enter manually</span>
                </div>
              </div>

              <form onSubmit={handleManualSubmit} className="space-y-3">
                <div>
                  <input
                    type="text"
                    value={manualBarcode}
                    onChange={(e) => setManualBarcode(e.target.value)}
                    placeholder="Enter barcode number"
                    className="w-full px-4 py-3.5 bg-slate-700/50 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-white placeholder-slate-400 transition duration-200"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3.5 px-6 rounded-lg transition duration-300 transform hover:scale-105 active:scale-95 shadow-lg"
                >
                  Decode Product
                </button>
              </form>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-blue-500/15 border border-blue-500/30 rounded-lg p-3">
                <p className="text-xs text-blue-300 text-center">
                  Hold your device steady so the barcode appears in the frame
                </p>
              </div>
              <div id="reader" className="w-full rounded-xl overflow-hidden shadow-lg border border-slate-600 bg-slate-800 min-h-[280px]"></div>
              <button
                onClick={stopScanning}
                className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition duration-300 transform hover:scale-105 active:scale-95 shadow-lg"
              >
                <X size={20} />
                Close Camera
              </button>
            </div>
          )}
        </div>
      </div>

      {!isScanning && (
        <div className="mt-4 text-center">
          <p className="text-xs text-slate-400">
            Camera requires HTTPS or localhost connection
          </p>
        </div>
      )}
    </div>
  );
}

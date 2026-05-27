import { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { Camera, X, AlertCircle } from 'lucide-react';

interface BarcodeScannerProps {
  onScanSuccess: (barcode: string) => void;
}

export function BarcodeScanner({ onScanSuccess }: BarcodeScannerProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const [manualBarcode, setManualBarcode] = useState('');

  const startScanning = async () => {
    setError(null);

    try {
      const scanner = new Html5Qrcode('reader');
      scannerRef.current = scanner;

      await scanner.start(
        { facingMode: 'environment' },
        {
          fps: 10,
          qrbox: { width: 250, height: 120 },
        },
        (decodedText) => {
          stopScanning();
          onScanSuccess(decodedText);
        },
        (errorMessage) => {
          console.log('Scan attempt:', errorMessage);
        }
      );

      setIsScanning(true);
    } catch (err: any) {
      console.error('Camera error:', err);
      let errorMsg = 'Unable to access camera. ';

      if (err.name === 'NotAllowedError') {
        errorMsg = 'Camera permission denied. Please allow camera access in your browser and retry.';
      } else if (err.name === 'NotFoundError') {
        errorMsg = 'No camera found on this device may need to connect a camera or use manual entry.';
      } else if (err.name === 'NotReadableError') {
        errorMsg = 'Camera is in use by another app. Close other apps and retry.';
      } else if (err.name === 'SecurityError' || err.name === 'TypeError') {
        errorMsg = 'Camera requires HTTPS. Please use https:// or localhost.';
      } else if (err.message) {
        errorMsg += err.message;
      } else {
        errorMsg += 'Please use manual barcode entry below.';
      }

      setError(errorMsg);
      setIsScanning(false);
    }
  };

  const stopScanning = async () => {
    if (scannerRef.current) {
      try {
        if (scannerRef.current.getState() === 2) {
          await scannerRef.current.stop();
        }
        scannerRef.current.clear();
      } catch (err) {
        console.error('Stop error:', err);
      }
      scannerRef.current = null;
    }
    setIsScanning(false);
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualBarcode.trim()) {
      onScanSuccess(manualBarcode.trim());
      setManualBarcode('');
    }
  };

  useEffect(() => {
    return () => {
      if (scannerRef.current && scannerRef.current.getState() === 2) {
        scannerRef.current.stop().catch(() => {});
      }
    };
  }, []);

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
            <div className="mb-5 bg-red-500/15 border border-red-500/30 rounded-xl p-4 flex gap-3">
              <AlertCircle size={20} className="text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-slate-300 flex-1">{error}</p>
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
                  Hold steady - scanning for barcode...
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
    </div>
  );
}

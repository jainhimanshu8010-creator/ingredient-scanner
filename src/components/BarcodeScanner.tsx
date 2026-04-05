import { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { Camera, X } from 'lucide-react';

interface BarcodeScannerProps {
  onScanSuccess: (barcode: string) => void;
}

export function BarcodeScanner({ onScanSuccess }: BarcodeScannerProps) {
  const [isScanning, setIsScanning] = useState(false);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const [manualBarcode, setManualBarcode] = useState('');

  const startScanning = async () => {
    try {
      const scanner = new Html5Qrcode('reader');
      scannerRef.current = scanner;

      await scanner.start(
        { facingMode: 'environment' },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        (decodedText) => {
          onScanSuccess(decodedText);
          stopScanning();
        },
        () => {
          // Error callback - ignore
        }
      );

      setIsScanning(true);
    } catch (err) {
      console.error('Error starting scanner:', err);
      alert('Unable to access camera. Please enter barcode manually.');
    }
  };

  const stopScanning = async () => {
    if (scannerRef.current) {
      try {
        await scannerRef.current.stop();
        scannerRef.current.clear();
        scannerRef.current = null;
      } catch (err) {
        console.error('Error stopping scanner:', err);
      }
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
      if (scannerRef.current) {
        scannerRef.current.stop().catch(console.error);
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
          {!isScanning ? (
            <div className="space-y-5">
              <button
                onClick={startScanning}
                className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold py-4 px-6 rounded-lg flex items-center justify-center gap-3 transition duration-300 transform hover:scale-105 active:scale-95 shadow-lg"
              >
                <Camera size={24} />
                Open Camera
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
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-white placeholder-slate-400 transition duration-200"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-300 transform hover:scale-105 active:scale-95 shadow-lg"
                >
                  Decode Product
                </button>
              </form>
            </div>
          ) : (
            <div className="space-y-4">
              <div id="reader" className="w-full rounded-xl overflow-hidden shadow-lg border border-slate-600"></div>
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

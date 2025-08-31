import React, { useState } from "react";
import BarcodeScanner, { BarcodeStringFormat } from "react-qr-barcode-scanner";

interface ScannerProps {
  value: string;
  onChange: (value: string) => void;
}


const Scanner: React.FC<ScannerProps> = ({ value, onChange }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [loading, setLoading] = useState(false);

  return (
    <div className="barcode-scanner">
      <input
        type="text"
        id="barcode"
        name="barcode"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Barcode"
        autoComplete="off"
        maxLength={200}
      />

      <button type="button" onClick={() => {
        setIsScanning(true);
        setLoading(true);
      }}>Scan</button>

      {isScanning && (
        <div className="barcode-scanner-overlay">
          <div className="barcode-scanner-camera">
            {loading && <div className="barcode-scanner-loading">Loading barcode scanner...</div>}
            <BarcodeScanner
              formats={[
                BarcodeStringFormat.UPC_A,
                BarcodeStringFormat.UPC_E,
                BarcodeStringFormat.EAN_8,
                BarcodeStringFormat.EAN_13]}
              onUpdate={(_err, result) => {
                if (loading) setLoading(false);
                console.log(result);
                if (result) {
                  const code = result.getText();
                  onChange(code); 
                  setIsScanning(false); 
                }
              }}
            />
            <button
              className="button"
              onClick={() => setIsScanning(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Scanner;

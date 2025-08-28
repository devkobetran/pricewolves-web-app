import React, { useState } from "react";
import BarcodeScanner from "react-qr-barcode-scanner";

interface ScannerProps {
  value: string;
  onChange: (value: string) => void;
}


const Scanner: React.FC<ScannerProps> = ({ value, onChange }) => {
  const [isScanning, setIsScanning] = useState(false);

  return (
    <div>
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

      <button onClick={() => setIsScanning(true)}>Scan</button>

      {isScanning && (
        <div>
          <BarcodeScanner
            onUpdate={(_err, result) => {
              console.log(result);
              if (result) {
                const code = result.getText();
                onChange(code); 
                setIsScanning(false); 
              }
            }}
          />
          <button onClick={() => setIsScanning(false)}>Cancel</button>
        </div>
      )}
    </div>
  );
};

export default Scanner;

import type { PriceHistory } from "./priceHistory";

export interface ItemInputs {
  id: string;
  barcode: string;
  itemName: string;
  itemImageUrl: string;
  itemPrice: number;
  units: string;
  category: string;
  description: string;
  storeName: string;
  storeId: string;
  isDiscount: boolean;
  discountedPrice: number;
  priceHistory?: PriceHistory[];
}
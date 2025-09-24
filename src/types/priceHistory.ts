export interface PriceHistory {
    id: string;
    itemId: string;
    itemName: string;
    price: number;
    discountedPrice?: number;
    changedAt: string;
}
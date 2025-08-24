export interface StoreLocation {
  streetName: string;
  optionalSecondaryStreetDetails?: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface Store {
  storeName: string;
  storeLocations: StoreLocation[];
  isBigChain: boolean;
  storeLogoUrl: string;
  id?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface StoreOption {
  label: string;
  value: Store;
}
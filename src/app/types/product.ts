interface InventoryStatus {
  label: string | any;
  value: string | any;
}

export interface Product {
  id?: string;
  code?: string;
  name?: string;
  description?: string;
  price?: number;
  quantity?: number;
  inventoryStatus?: InventoryStatus | any;
  category?: string;
  image?: string;
  rating?: number;
}

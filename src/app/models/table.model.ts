export interface Table {
  id?: number;
  name: string;
  capacity: number;
  location: string;
  description?: string;
  isAvailable: boolean;
  pricePerHour: number;
  createdAt?: string;
  updatedAt?: string;
}
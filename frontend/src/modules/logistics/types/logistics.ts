// frontend/src/modules/logistics/types/logistics.ts

export type LogisticsStatus = 'pending' | 'assigned' | 'in_transit' | 'delivered' | 'delayed';

export interface LogisticsAssignment {
  assignedVehicle: Vehicle | null;
  assignedDriver: Driver | null;
  status: LogisticsStatus;
  estimatedDelivery: string | null;
  actualDelivery: string | null;
  notes?: string;
}

export interface Project {
  id: number;
  name: string;
  client: string;
  status: string;
  deliveryAddress: string;
  items: Array<{
    id: number;
    name: string;
    quantity: number;
    weight: number;
  }>;
  logistics: LogisticsAssignment;
}

export interface Vehicle {
  id: number;
  registration: string;
  type: string;
  capacity: number;
  status: 'available' | 'assigned' | 'maintenance' | 'in_use';
  currentLocation: string;
  model: string;
  year: number;
  lastServiceDate?: string;
  insuranceExpiry?: string;
}

export interface ShipmentItem {
  id: number;
  name: string;
  quantity: number;
  weight: number;
}

export interface Shipment {
  id: number;
  trackingNumber: string;
  origin: string;
  destination: string;
  status: 'pending' | 'in_transit' | 'delivered' | 'delayed' | 'cancelled';
  departureTime: string;
  estimatedArrival: string;
  actualArrival: string | null;
  vehicleId: number;
  driverId: number;
  items: ShipmentItem[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export type { Vehicle as VehicleType };

export interface ExpiryItem {
  id: number;
  type: 'insurance' | 'inspection' | 'tracking' | 'license';
  documentNumber: string;
  vehicleId: number;
  vehicleRegistration: string;
  vehicleModel: string;
  issueDate: string;
  expiryDate: string;
  status: 'valid' | 'expiring_soon' | 'expired';
  notes?: string;
  documentUrl?: string;
  documentFile?: File;
  daysUntilExpiry?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Maintenance {
  id: number;
  vehicleId: number;
  vehicleRegistration: string;
  maintenanceType: 'scheduled' | 'repair' | 'inspection' | 'accident';
  description: string;
  startDate: string;
  endDate: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'delayed';
  cost: number;
  serviceProvider: string;
  notes?: string;
  odometerReading?: number;
  nextServiceDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Driver {
  id: number;
  name: string; // Using single name field to match mock data
  license: string;
  status: 'available' | 'assigned' | 'on_leave';
  contact: string;
  email?: string;
  hireDate?: string;
  licenseExpiry?: string;
  address?: string;
  licenseNumber?: string; // Add licenseNumber for backward compatibility
}

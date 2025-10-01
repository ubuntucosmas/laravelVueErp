// Logistics related types
export interface Shipment {
  id: number;
  trackingNumber: string;
  projectName: string;
  site: string; // venue
  loadingTime: string;
  departureTime?: string;
  vehicleAllocated: string;
  poIncharge: string; // P.O incharge
  remarks?: string;
  status: 'pending' | 'loading' | 'in_transit' | 'delivered' | 'delayed' | 'cancelled';
  origin: string;
  destination: string;
  estimatedDelivery: string;
  actualDelivery?: string;
  carrier: string;
  items: ShipmentItem[];
  assignedVehicle?: Vehicle;
  assignedDriver?: Driver;
  createdAt: string;
  updatedAt: string;
}

export interface ShipmentItem {
  id: number;
  name: string;
  quantity: number;
  weight?: number;
  dimensions?: string;
  value?: number;
}

export interface Vehicle {
  id: number;
  registrationNumber: string;
  type: string;
  capacity: string;
  status: 'available' | 'in_use' | 'maintenance' | 'out_of_service';
  lastMaintenanceDate?: string;
  nextMaintenanceDate?: string;
}

export interface Driver {
  id: number;
  name: string;
  licenseNumber: string;
  contactNumber: string;
  status: 'available' | 'on_delivery' | 'on_leave';
}

export interface Route {
  id: number;
  name: string;
  origin: string;
  destination: string;
  distance: number; // in kilometers
  estimatedTime: string; // e.g., "2 hours 30 minutes"
  waypoints: string[];
}

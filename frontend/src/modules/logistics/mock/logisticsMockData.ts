// frontend/src/modules/logistics/mock/logisticsMockData.ts
import type { Project, Vehicle, Driver, Shipment, Maintenance, ExpiryItem } from '../types/logistics';

export const mockVehicles: Vehicle[] = [
  {
    id: 1,
    registration: 'KAA 123A',
    type: 'Large Truck',
    capacity: 10000, // kg
    status: 'available',
    currentLocation: 'Nairobi Depot',
    model: 'Volvo FH16',
    year: 2021,
    lastServiceDate: '2023-11-15',
    insuranceExpiry: '2024-12-31'
  },
  {
    id: 2,
    registration: 'KBB 456B',
    type: 'Small Lorry',
    capacity: 5000, // kg
    status: 'in_use',
    currentLocation: 'Mombasa Depot',
    model: 'Isuzu NQR',
    year: 2022,
    lastServiceDate: '2023-12-01',
    insuranceExpiry: '2024-06-30'
  },
  {
    id: 3,
    registration: 'KCC 789C',
    type: 'Van',
    capacity: 1500, // kg
    status: 'available',
    currentLocation: 'Nairobi Depot',
    model: 'Toyota Hiace',
    year: 2023,
    lastServiceDate: '2024-01-10',
    insuranceExpiry: '2024-12-31'
  },
  {
    id: 4,
    registration: 'KDD 012D',
    type: 'Bike',
    capacity: 100, // kg
    status: 'maintenance',
    currentLocation: 'Nairobi Depot',
    model: 'Bajaj Boxer',
    year: 2023,
    lastServiceDate: '2024-01-20',
    insuranceExpiry: '2024-12-31'
  }
];

export const mockDrivers: Driver[] = [
  {
    id: 1,
    name: 'Boas Osore',
    license: 'DL-2023001',
    status: 'available',
    contact: '+254712345678',
    email: 'boas.osore@example.com',
    hireDate: '2022-01-15',
    licenseExpiry: '2025-12-31',
    address: '123 Mombasa Road, Nairobi'
  },
  {
    id: 2,
    name: 'Timothy Mwangi',
    license: 'DL-2023002',
    status: 'available',
    contact: '+254723456789',
    email: 'timothy.mwangi@example.com',
    hireDate: '2022-03-10',
    licenseExpiry: '2024-11-30',
    address: '456 Thika Road, Nairobi'
  },
  {
    id: 3,
    name: 'Njenga Kamau',
    license: 'DL-2023003',
    status: 'on_leave',
    contact: '+254734567890',
    email: 'njenga.kamau@example.com',
    hireDate: '2021-11-05',
    licenseExpiry: '2025-06-30',
    address: '789 Ngong Road, Nairobi'
  },
  {
    id: 4,
    name: 'Jason Omondi',
    license: 'DL-2023004',
    status: 'assigned',
    contact: '+254745678901',
    email: 'jason.omondi@example.com',
    hireDate: '2023-01-20',
    licenseExpiry: '2026-03-15',
    address: '321 Waiyaki Way, Nairobi'
  }
];

export const mockShipments: Shipment[] = [
  {
    id: 1,
    trackingNumber: 'SHIP-2023-001',
    origin: 'Nairobi Depot',
    destination: 'Westlands Office Park',
    status: 'in_transit',
    departureTime: '2023-06-15T08:00:00',
    estimatedArrival: '2023-06-15T10:30:00',
    actualArrival: null,
    vehicleId: 1,
    driverId: 1,
    items: [
      { id: 1, name: 'Office Chairs', quantity: 10, weight: 150 },
      { id: 2, name: 'Desks', quantity: 5, weight: 175 }
    ],
    notes: 'Fragile items included',
    createdAt: '2023-06-14T14:30:00',
    updatedAt: '2023-06-15T08:15:00'
  },
  {
    id: 2,
    trackingNumber: 'SHIP-2023-002',
    origin: 'Mombasa Depot',
    destination: 'Mombasa Port',
    status: 'pending',
    departureTime: '2023-06-16T09:00:00',
    estimatedArrival: '2023-06-16T10:00:00',
    actualArrival: null,
    vehicleId: 2,
    driverId: 2,
    items: [
      { id: 3, name: 'Electronics', quantity: 5, weight: 50 },
      { id: 4, name: 'Documents', quantity: 2, weight: 2 }
    ],
    notes: 'Requires temperature control',
    createdAt: '2023-06-14T16:45:00',
    updatedAt: '2023-06-14T16:45:00'
  },
  {
    id: 3,
    trackingNumber: 'SHIP-2023-003',
    origin: 'Nairobi Depot',
    destination: 'Karen Residence',
    status: 'delivered',
    departureTime: '2023-06-10T10:00:00',
    estimatedArrival: '2023-06-10T11:30:00',
    actualArrival: '2023-06-10T11:15:00',
    vehicleId: 3,
    driverId: 4,
    items: [
      { id: 5, name: 'Furniture', quantity: 3, weight: 200 },
      { id: 6, name: 'Appliances', quantity: 2, weight: 150 }
    ],
    notes: 'Customer requested morning delivery',
    createdAt: '2023-06-09T14:20:00',
    updatedAt: '2023-06-10T11:30:00'
  }
];

export const mockProjectsNeedingLogistics: Project[] = [
  {
    id: 1,
    name: 'Office Relocation',
    client: 'Acme Corp',
    status: 'in_progress',
    deliveryAddress: '123 Business St, City',
    items: [
      { id: 1, name: 'Office Chairs', quantity: 10, weight: 15 },
      { id: 2, name: 'Desks', quantity: 5, weight: 35 }
    ],
    logistics: {
      assignedVehicle: null,
      assignedDriver: null,
      status: 'pending',
      estimatedDelivery: null,
      actualDelivery: null
    }
  },
  // Add more mock projects...
];

export const mockExpiries: ExpiryItem[] = [
  {
    id: 1,
    type: 'insurance',
    documentNumber: 'INS-2023-001',
    vehicleId: 1,
    vehicleRegistration: 'KAA 123A',
    vehicleModel: 'Volvo FH16',
    issueDate: '2023-01-01',
    expiryDate: '2024-12-31',
    status: 'valid',
    notes: 'Comprehensive insurance coverage',
    documentUrl: '/documents/insurance/ins-2023-001.pdf',
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z',
    daysUntilExpiry: 456
  },
  {
    id: 2,
    type: 'inspection',
    documentNumber: 'INSP-2023-045',
    vehicleId: 2,
    vehicleRegistration: 'KBB 456B',
    vehicleModel: 'Isuzu NQR',
    issueDate: '2023-06-15',
    expiryDate: '2024-06-14',
    status: 'valid',
    notes: 'Annual inspection completed',
    documentUrl: '/documents/inspections/insp-2023-045.pdf',
    createdAt: '2023-06-15T00:00:00Z',
    updatedAt: '2023-06-15T00:00:00Z',
    daysUntilExpiry: 256
  },
  {
    id: 3,
    type: 'tracking',
    documentNumber: 'TRK-2023-078',
    vehicleId: 3,
    vehicleRegistration: 'KCC 789C',
    vehicleModel: 'Toyota Hiace',
    issueDate: '2023-03-10',
    expiryDate: '2024-03-09',
    status: 'expiring_soon',
    notes: 'GPS tracking subscription',
    documentUrl: '/documents/tracking/trk-2023-078.pdf',
    createdAt: '2023-03-10T00:00:00Z',
    updatedAt: '2023-03-10T00:00:00Z',
    daysUntilExpiry: 29
  },
  {
    id: 4,
    type: 'license',
    documentNumber: 'LIC-2023-112',
    vehicleId: 4,
    vehicleRegistration: 'KDD 012D',
    vehicleModel: 'Bajaj Boxer',
    issueDate: '2023-01-20',
    expiryDate: '2023-12-31',
    status: 'expired',
    notes: 'Vehicle license renewal',
    documentUrl: '/documents/licenses/lic-2023-112.pdf',
    createdAt: '2023-01-20T00:00:00Z',
    updatedAt: '2023-01-20T00:00:00Z',
    daysUntilExpiry: -5
  }
];

export const mockMaintenance: Maintenance[] = [
  {
    id: 1,
    vehicleId: 1,
    vehicleRegistration: 'KAA 123A',
    maintenanceType: 'scheduled',
    description: 'Routine service - 50,000 km',
    startDate: '2023-12-15',
    endDate: '2023-12-15',
    status: 'completed',
    cost: 25000,
    serviceProvider: 'DT Dobie Nairobi',
    odometerReading: 50234,
    nextServiceDate: '2024-06-15',
    notes: 'Oil change, filter replacement, and general inspection',
    createdAt: '2023-11-20T09:00:00Z',
    updatedAt: '2023-12-15T16:30:00Z'
  },
  {
    id: 2,
    vehicleId: 4,
    vehicleRegistration: 'KDD 012D',
    maintenanceType: 'repair',
    description: 'Engine overheating issue',
    startDate: '2024-01-20',
    endDate: '2024-01-22',
    status: 'in_progress',
    cost: 0,
    serviceProvider: 'Bikers Hub',
    odometerReading: 12345,
    notes: 'Diagnosing engine overheating - possible radiator issue',
    createdAt: '2024-01-19T14:30:00Z',
    updatedAt: '2024-01-20T10:15:00Z'
  },
  {
    id: 3,
    vehicleId: 2,
    vehicleRegistration: 'KBB 456B',
    maintenanceType: 'inspection',
    description: 'Annual inspection and certification',
    startDate: '2024-02-10',
    endDate: '2024-02-10',
    status: 'scheduled',
    cost: 5000,
    serviceProvider: 'NTSA Inspection Center',
    odometerReading: 35678,
    notes: 'Scheduled for 9:00 AM',
    createdAt: '2024-01-05T11:20:00Z',
    updatedAt: '2024-01-05T11:20:00Z'
  },
  {
    id: 4,
    vehicleId: 3,
    vehicleRegistration: 'KCC 789C',
    maintenanceType: 'scheduled',
    description: 'Tire rotation and alignment',
    startDate: '2024-01-25',
    endDate: '2024-01-25',
    status: 'scheduled',
    cost: 8000,
    serviceProvider: 'AutoXpress Tyres',
    odometerReading: 18900,
    notes: 'Front tires showing uneven wear',
    createdAt: '2024-01-10T08:45:00Z',
    updatedAt: '2024-01-10T08:45:00Z'
  }
];


import type { LoadingSheet } from '../types/loadingSheet';

export const mockLoadingSheets: LoadingSheet[] = [
  {
    id: 'LS-001',
    loadingSheetNumber: 'LS-001',
    type: 'outbound',
    status: 'completed',
    projectId: 'PRJ-001',
    projectName: 'Nairobi Mall Construction',
    date: '2025-10-01',
    time: '09:30',
    items: [
      { id: '1', name: 'Cement Bags', quantity: 50, unit: 'bags', loaded: true },
      { id: '2', name: 'Steel Bars', quantity: 100, unit: 'pieces', loaded: true },
    ],
    driver: 'John Doe',
    vehicle: 'KAA 123A',
    notes: 'All items loaded and verified',
    createdAt: '2025-10-01T09:30:00Z',
    updatedAt: '2025-10-01T09:45:00Z',
  },
  {
    id: 'LS-002',
    loadingSheetNumber: 'LS-002',
    type: 'return',
    status: 'pending',
    projectId: 'PRJ-001',
    projectName: 'Nairobi Mall Construction',
    date: '2025-10-02',
    time: '14:00',
    items: [
      { id: '3', name: 'Wooden Planks', quantity: 200, unit: 'pieces', loaded: false },
      { id: '4', name: 'Nails', quantity: 50, unit: 'kg', loaded: false },
    ],
    driver: 'Jane Smith',
    vehicle: 'KBB 456B',
    notes: 'Scheduled for tomorrow',
    createdAt: '2025-10-01T16:20:00Z',
    updatedAt: '2025-10-01T16:20:00Z',
  },
];

import { InventoryItem, Complaint, Feedback, CafeConfig } from '@/types/cafe';

export const mockInventory: InventoryItem[] = [
  {
    id: '1',
    name: 'Coffee Beans - Arabica',
    category: 'Coffee',
    currentStock: 45,
    maxStock: 100,
    unit: 'kg',
    lowStockThreshold: 20,
    icon: 'Coffee'
  },
  {
    id: '2',
    name: 'Milk',
    category: 'Dairy',
    currentStock: 80,
    maxStock: 120,
    unit: 'L',
    lowStockThreshold: 30,
    icon: 'Milk'
  },
  {
    id: '3',
    name: 'Sugar',
    category: 'Supplies',
    currentStock: 15,
    maxStock: 50,
    unit: 'kg',
    lowStockThreshold: 10,
    icon: 'Package'
  },
  {
    id: '4',
    name: 'Paper Cups',
    category: 'Supplies',
    currentStock: 300,
    maxStock: 500,
    unit: 'pcs',
    lowStockThreshold: 100,
    icon: 'Coffee'
  },
  {
    id: '5',
    name: 'Tea Leaves',
    category: 'Tea',
    currentStock: 25,
    maxStock: 40,
    unit: 'kg',
    lowStockThreshold: 15,
    icon: 'Leaf'
  }
];

export const mockComplaints: Complaint[] = [
  {
    id: '1',
    customerName: 'John Smith',
    email: 'john@example.com',
    subject: 'Cold Coffee',
    description: 'My latte was served cold and had to wait 15 minutes.',
    status: 'pending',
    priority: 'high',
    createdAt: '2024-01-15T10:30:00Z'
  },
  {
    id: '2',
    customerName: 'Sarah Johnson',
    email: 'sarah@example.com',
    subject: 'Wrong Order',
    description: 'Ordered cappuccino but received americano.',
    status: 'in-progress',
    priority: 'medium',
    createdAt: '2024-01-15T09:45:00Z'
  },
  {
    id: '3',
    customerName: 'Mike Wilson',
    email: 'mike@example.com',
    subject: 'Billing Issue',
    description: 'Was charged twice for the same order.',
    status: 'resolved',
    priority: 'high',
    createdAt: '2024-01-14T16:20:00Z',
    resolvedAt: '2024-01-15T08:15:00Z'
  }
];

export const mockFeedback: Feedback[] = [
  {
    id: '1',
    customerName: 'Emily Davis',
    email: 'emily@example.com',
    rating: 5,
    comment: 'Amazing coffee and great atmosphere! Will definitely come back.',
    category: 'Service',
    createdAt: '2024-01-15T14:30:00Z'
  },
  {
    id: '2',
    customerName: 'Robert Brown',
    email: 'robert@example.com',
    rating: 4,
    comment: 'Good coffee but the place gets quite noisy during peak hours.',
    category: 'Environment',
    createdAt: '2024-01-15T11:15:00Z'
  },
  {
    id: '3',
    customerName: 'Lisa Anderson',
    email: 'lisa@example.com',
    rating: 5,
    comment: 'Love the new pastry selection! The croissants are fantastic.',
    category: 'Food',
    createdAt: '2024-01-14T13:45:00Z'
  }
];

export const defaultCafeConfig: CafeConfig = {
  theme: {
    primaryColor: 'hsl(25, 45%, 25%)',
    accentColor: 'hsl(25, 75%, 60%)',
    name: 'Brew & Bean Cafe'
  },
  inventory: mockInventory,
  features: {
    showInventoryChart: true,
    enableCustomerCare: true,
    autoRefreshInterval: 30000
  }
};
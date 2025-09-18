export interface User {
  id: string;
  email: string;
  role: 'cafe' | 'admin';
  name: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  currentStock: number;
  maxStock: number;
  unit: string;
  lowStockThreshold: number;
  icon: string;
}

export interface Complaint {
  id: string;
  customerName: string;
  email: string;
  subject: string;
  description: string;
  status: 'pending' | 'in-progress' | 'resolved';
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  resolvedAt?: string;
}

export interface Feedback {
  id: string;
  customerName: string;
  email: string;
  rating: number;
  comment: string;
  category: string;
  createdAt: string;
}

export interface CafeConfig {
  theme: {
    primaryColor: string;
    accentColor: string;
    name: string;
  };
  inventory: InventoryItem[];
  features: {
    showInventoryChart: boolean;
    enableCustomerCare: boolean;
    autoRefreshInterval: number;
  };
}
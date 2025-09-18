import React from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import { Routes, Route } from 'react-router-dom';
import DashboardHeader from '@/components/DashboardHeader';
import InventoryPage from '@/components/InventoryPage';
import CustomerCarePage from '@/components/CustomerCarePage';
import OverviewPage from '@/components/OverviewPage';

const Dashboard = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <DashboardHeader />
          <main className="flex-1 p-6">
            <Routes>
              <Route path="/" element={<OverviewPage />} />
              <Route path="/inventory" element={<InventoryPage />} />
              <Route path="/customer-care" element={<CustomerCarePage />} />
            </Routes>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;
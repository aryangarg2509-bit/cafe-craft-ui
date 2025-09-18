import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Coffee, Package, MessageSquare, TrendingUp, AlertTriangle, Users } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { mockInventory, mockComplaints, mockFeedback } from '@/data/mockData';

const OverviewPage = () => {
  const lowStockItems = mockInventory.filter(item => 
    (item.currentStock / item.maxStock) * 100 < 30
  );

  const pendingComplaints = mockComplaints.filter(complaint => 
    complaint.status === 'pending'
  ).length;

  const averageRating = mockFeedback.reduce((acc, feedback) => 
    acc + feedback.rating, 0
  ) / mockFeedback.length;

  const stats = [
    {
      title: 'Total Inventory Items',
      value: mockInventory.length,
      icon: Package,
      description: `${lowStockItems.length} items low in stock`,
      color: 'text-blue-600'
    },
    {
      title: 'Pending Complaints',
      value: pendingComplaints,
      icon: MessageSquare,
      description: 'Require immediate attention',
      color: 'text-red-600'
    },
    {
      title: 'Customer Rating',
      value: averageRating.toFixed(1),
      icon: Users,
      description: `Based on ${mockFeedback.length} reviews`,
      color: 'text-green-600'
    },
    {
      title: 'Revenue Today',
      value: '$1,245',
      icon: TrendingUp,
      description: '+12% from yesterday',
      color: 'text-cafe-orange'
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Overview</h2>
        <p className="text-muted-foreground">
          Welcome back! Here's what's happening at your cafe today.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={index} className="border-0 shadow-soft">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-0 shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              Low Stock Alert
            </CardTitle>
            <CardDescription>
              Items that need restocking
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {lowStockItems.length === 0 ? (
              <p className="text-muted-foreground">All items are well stocked!</p>
            ) : (
              lowStockItems.map((item) => {
                const percentage = (item.currentStock / item.maxStock) * 100;
                return (
                  <div key={item.id} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">{item.name}</span>
                      <span className="text-muted-foreground">
                        {item.currentStock}/{item.maxStock} {item.unit}
                      </span>
                    </div>
                    <Progress 
                      value={percentage} 
                      variant={percentage < 20 ? "danger" : "warning"}
                    />
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>

        <Card className="border-0 shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-blue-500" />
              Recent Feedback
            </CardTitle>
            <CardDescription>
              Latest customer reviews
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {mockFeedback.slice(0, 3).map((feedback) => (
              <div key={feedback.id} className="border-l-4 border-primary pl-4 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-sm">{feedback.customerName}</span>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <span 
                        key={i} 
                        className={`text-sm ${i < feedback.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {feedback.comment}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OverviewPage;
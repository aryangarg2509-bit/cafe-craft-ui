import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MessageSquare, Star, Clock, CheckCircle, AlertCircle, Users } from 'lucide-react';
import { mockComplaints, mockFeedback } from '@/data/mockData';
import { Complaint, Feedback } from '@/types/cafe';

const CustomerCarePage = () => {
  const [complaints] = useState<Complaint[]>(mockComplaints);
  const [feedback] = useState<Feedback[]>(mockFeedback);

  const getStatusColor = (status: Complaint['status']) => {
    switch (status) {
      case 'pending':
        return 'destructive';
      case 'in-progress':
        return 'secondary';
      case 'resolved':
        return 'default';
      default:
        return 'outline';
    }
  };

  const getPriorityColor = (priority: Complaint['priority']) => {
    switch (priority) {
      case 'high':
        return 'destructive';
      case 'medium':
        return 'secondary';
      case 'low':
        return 'outline';
      default:
        return 'outline';
    }
  };

  const StatusIcon = ({ status }: { status: Complaint['status'] }) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'in-progress':
        return <AlertCircle className="h-4 w-4" />;
      case 'resolved':
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const averageRating = feedback.reduce((acc, f) => acc + f.rating, 0) / feedback.length;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Customer Care</h2>
        <p className="text-muted-foreground">
          Manage complaints and view customer feedback
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-0 shadow-soft">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Complaints</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{complaints.length}</div>
            <p className="text-xs text-muted-foreground">
              {complaints.filter(c => c.status === 'pending').length} pending
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-soft">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
            <Star className="h-4 w-4 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageRating.toFixed(1)}</div>
            <p className="text-xs text-muted-foreground">
              Based on {feedback.length} reviews
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-soft">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolution Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {((complaints.filter(c => c.status === 'resolved').length / complaints.length) * 100).toFixed(0)}%
            </div>
            <p className="text-xs text-muted-foreground">
              {complaints.filter(c => c.status === 'resolved').length} resolved
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-soft">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Response Time</CardTitle>
            <Clock className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.4h</div>
            <p className="text-xs text-muted-foreground">
              Average response time
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="complaints" className="space-y-4">
        <TabsList>
          <TabsTrigger value="complaints" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            Complaints
          </TabsTrigger>
          <TabsTrigger value="feedback" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            Feedback
          </TabsTrigger>
        </TabsList>

        <TabsContent value="complaints" className="space-y-4">
          <div className="grid gap-4">
            {complaints.map((complaint) => (
              <Card key={complaint.id} className="border-0 shadow-soft">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <StatusIcon status={complaint.status} />
                        {complaint.subject}
                      </CardTitle>
                      <CardDescription>
                        From {complaint.customerName} • {complaint.email}
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Badge variant={getPriorityColor(complaint.priority)} className="capitalize">
                        {complaint.priority} Priority
                      </Badge>
                      <Badge variant={getStatusColor(complaint.status)} className="capitalize">
                        {complaint.status}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{complaint.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                      Created: {new Date(complaint.createdAt).toLocaleDateString()}
                      {complaint.resolvedAt && (
                        <span className="ml-4">
                          Resolved: {new Date(complaint.resolvedAt).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                    <div className="flex gap-2">
                      {complaint.status === 'pending' && (
                        <Button size="sm" variant="outline">
                          Start Progress
                        </Button>
                      )}
                      {complaint.status === 'in-progress' && (
                        <Button size="sm" className="bg-primary hover:bg-primary/90">
                          Mark Resolved
                        </Button>
                      )}
                      <Button size="sm" variant="outline">
                        View Details
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="feedback" className="space-y-4">
          <div className="grid gap-4">
            {feedback.map((review) => (
              <Card key={review.id} className="border-0 shadow-soft">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Users className="h-5 w-5 text-primary" />
                        {review.customerName}
                      </CardTitle>
                      <CardDescription>{review.email}</CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`h-4 w-4 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                          />
                        ))}
                      </div>
                      <Badge variant="outline" className="capitalize">
                        {review.category}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{review.comment}</p>
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </div>
                    <Button size="sm" variant="outline">
                      Respond
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CustomerCarePage;
import React, { useState } from 'react';
import { Coffee, User, Lock, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<'cafe' | 'admin'>('cafe');
  const { login, isLoading } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const success = await login(email, password, activeTab);
    
    if (success) {
      toast({
        title: "Login Successful",
        description: `Welcome to the ${activeTab} dashboard!`,
      });
    } else {
      toast({
        title: "Login Failed",
        description: "Invalid credentials. Please try again.",
        variant: "destructive",
      });
    }
  };

  const fillDemoCredentials = () => {
    if (activeTab === 'cafe') {
      setEmail('cafe@demo.com');
      setPassword('cafe123');
    } else {
      setEmail('admin@demo.com');
      setPassword('admin123');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-warm flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Coffee className="h-12 w-12 text-primary mr-2" />
            <h1 className="text-3xl font-bold text-primary">Brew & Bean</h1>
          </div>
          <p className="text-muted-foreground">Cafe Management System</p>
        </div>

        <Card className="shadow-warm border-0">
          <CardHeader>
            <CardTitle className="text-center text-2xl">Welcome Back</CardTitle>
            <CardDescription className="text-center">
              Sign in to access your dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'cafe' | 'admin')}>
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="cafe" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  Cafe Login
                </TabsTrigger>
                <TabsTrigger value="admin" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  Admin Login
                </TabsTrigger>
              </TabsList>

              <TabsContent value="cafe" className="space-y-4">
                <div className="text-center text-sm text-muted-foreground mb-4">
                  <p>Demo: cafe@demo.com / cafe123</p>
                  <Button variant="outline" size="sm" onClick={fillDemoCredentials} className="mt-2">
                    Fill Demo Credentials
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="admin" className="space-y-4">
                <div className="text-center text-sm text-muted-foreground mb-4">
                  <p>Demo: admin@demo.com / admin123</p>
                  <Button variant="outline" size="sm" onClick={fillDemoCredentials} className="mt-2">
                    Fill Demo Credentials
                  </Button>
                </div>
              </TabsContent>
            </Tabs>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    placeholder="Enter your password"
                    required
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                disabled={isLoading}
              >
                {isLoading ? (
                  "Signing in..."
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
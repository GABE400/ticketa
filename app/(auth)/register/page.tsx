'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Mail, Lock, User, ArrowRight, Globe, Briefcase, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authClient } from '@/lib/auth-client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'buyer' | 'organizer'>('buyer');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    const { data, error } = await authClient.signUp.email({
      email,
      password,
      name,
      role,
      callbackURL: '/dashboard',
    });

    if (error) {
      toast.error(error.message || 'Registration failed');
      setIsLoading(false);
    } else {
      toast.success('Account created! Welcome to Ticketa.');
      router.push(role === 'organizer' ? '/dashboard' : '/events');
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-1/4 -right-1/4 w-96 h-96 bg-purple-600/20 blur-[120px] rounded-full"></div>
      <div className="absolute bottom-1/4 -left-1/4 w-96 h-96 bg-red-600/20 blur-[120px] rounded-full"></div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg z-10"
      >
        <div className="text-center mb-6">
          <Link href="/" className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-red-500 flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-white tracking-tighter">Ticketa</span>
          </Link>
          <h1 className="text-3xl font-bold text-white">Join the Revolution</h1>
          <p className="text-gray-400 mt-2">Secure ticketing, seamless experiences.</p>
        </div>

        <Card className="border-white/10 bg-slate-900/50 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-xl text-white">Create Account</CardTitle>
            <CardDescription className="text-gray-400">
              Join thousands of people using Ticketa for their events.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleRegister} className="space-y-4">
              {/* Role Selection */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <button
                  type="button"
                  onClick={() => setRole('buyer')}
                  className={cn(
                    "flex flex-col items-center gap-3 p-4 rounded-xl border transition-all duration-300",
                    role === 'buyer' 
                      ? "border-purple-500 bg-purple-500/10 text-white" 
                      : "border-white/10 bg-black/40 text-gray-400 hover:border-white/20"
                  )}
                >
                  <ShoppingBag className={cn("w-6 h-6", role === 'buyer' ? "text-purple-400" : "text-gray-500")} />
                  <div className="text-center">
                    <p className="font-bold text-sm">Buyer</p>
                    <p className="text-[10px] opacity-60">I want to buy tickets</p>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => setRole('organizer')}
                  className={cn(
                    "flex flex-col items-center gap-3 p-4 rounded-xl border transition-all duration-300",
                    role === 'organizer' 
                      ? "border-red-500 bg-red-500/10 text-white" 
                      : "border-white/10 bg-black/40 text-gray-400 hover:border-white/20"
                  )}
                >
                  <Briefcase className={cn("w-6 h-6", role === 'organizer' ? "text-red-400" : "text-gray-500")} />
                  <div className="text-center">
                    <p className="font-bold text-sm">Organizer</p>
                    <p className="text-[10px] opacity-60">I want to sell tickets</p>
                  </div>
                </button>
              </div>

              <div className="space-y-2">
                <Label htmlFor="name" className="text-gray-300">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
                  <Input
                    id="name"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-10 bg-black/40 border-white/10 text-white placeholder:text-gray-600 focus:border-purple-500/50 transition-colors"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-300">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 bg-black/40 border-white/10 text-white placeholder:text-gray-600 focus:border-purple-500/50 transition-colors"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-300">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 bg-black/40 border-white/10 text-white placeholder:text-gray-600 focus:border-purple-500/50 transition-colors"
                    required
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                className={cn(
                  "w-full font-bold h-11 transition-all duration-300 shadow-lg mt-4",
                  role === 'organizer' 
                    ? "bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 shadow-red-500/20" 
                    : "bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 shadow-purple-500/20"
                )}
                disabled={isLoading}
              >
                {isLoading ? 'Creating Account...' : 'Get Started'}
                {!isLoading && <ArrowRight className="ml-2 w-4 h-4" />}
              </Button>
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-[#0a0a0a] px-2 text-gray-500 font-medium">Or join with</span>
              </div>
            </div>

            <Button 
              variant="outline" 
              className="w-full border-white/10 bg-white/5 hover:bg-white/10 text-white h-11"
              onClick={() => authClient.signIn.social({ provider: 'github' })}
            >
              <Globe className="mr-2 w-4 h-4 text-purple-400" />
              GitHub
            </Button>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <p className="text-center text-sm text-gray-400">
              Already have an account?{' '}
              <Link href="/login" className="text-purple-400 font-bold hover:text-purple-300 underline-offset-4 hover:underline">
                Log in here
              </Link>
            </p>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Mail, Lock, ArrowRight, Loader2, Wand2, CheckCircle2, User } from 'lucide-react';
import { authClient } from '@/lib/auth-client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface AuthModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  defaultTab?: 'login' | 'signup';
  defaultRole?: 'buyer' | 'organizer';
}

export default function AuthModal({ 
  isOpen, 
  onOpenChange, 
  defaultTab = 'login',
  defaultRole = 'buyer'
}: AuthModalProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<'buyer' | 'organizer'>(defaultRole);
  const [isLoading, setIsLoading] = useState(false);
  const [isMagicLinkSent, setIsMagicLinkSent] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (isOpen) {
      setRole(defaultRole);
    }
  }, [isOpen, defaultRole]);

  const handleSocialLogin = async (provider: 'google') => {
    setIsLoading(true);
    try {
      await authClient.signIn.social({
        provider,
        callbackURL: '/dashboard',
      });
    } catch (error: any) {
      toast.error(error.message || 'Social login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreedToTerms) {
      toast.error('Please agree to the terms and conditions');
      return;
    }
    setIsLoading(true);
    try {
      const { error } = await authClient.signIn.magicLink({
        email,
        callbackURL: '/dashboard',
      });
      if (error) throw error;
      setIsMagicLinkSent(true);
      toast.success('Magic link sent to your email!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to send magic link');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { error } = await authClient.signIn.email({
        email,
        password,
        callbackURL: '/dashboard',
      });
      if (error) throw error;
      onOpenChange(false);
      router.push('/dashboard');
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreedToTerms) {
      toast.error('Please agree to the terms and conditions');
      return;
    }
    setIsLoading(true);
    try {
      const { error } = await authClient.signUp.email({
        email,
        password,
        name,
        role,
        callbackURL: '/dashboard',
      });
      if (error) throw error;
      toast.success('Account created! Welcome to Ticketa.');
      onOpenChange(false);
      router.push('/dashboard');
    } catch (error: any) {
      toast.error(error.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[460px] bg-slate-950 border-white/10 p-0 overflow-hidden backdrop-blur-2xl">
        <div className="relative p-8 pt-10">
          {/* Brand/Header */}
          <div className="flex items-center gap-2 mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-red-500 flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <DialogTitle className="text-2xl font-black text-white tracking-tighter">Ticketa</DialogTitle>
              <DialogDescription className="text-gray-500">Secure entry to premium events.</DialogDescription>
            </div>
          </div>

          <Tabs defaultValue={defaultTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-white/5 border border-white/10 p-1 mb-8">
              <TabsTrigger value="login" className="data-[state=active]:bg-white/10 data-[state=active]:text-white text-gray-400">Login</TabsTrigger>
              <TabsTrigger value="signup" className="data-[state=active]:bg-white/10 data-[state=active]:text-white text-gray-400">Join</TabsTrigger>
            </TabsList>

            <TabsContent value="login" className="space-y-6">
              <AnimatePresence mode="wait">
                {isMagicLinkSent ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-8 space-y-4"
                  >
                    <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto">
                      <CheckCircle2 className="w-8 h-8 text-green-500" />
                    </div>
                    <h3 className="text-xl font-bold text-white">Check your email</h3>
                    <p className="text-gray-400 text-sm">We've sent a magic link to <span className="text-white">{email}</span>. Click it to log in instantly.</p>
                    <Button variant="ghost" className="text-purple-400 hover:text-purple-300" onClick={() => setIsMagicLinkSent(false)}>
                      Try another way
                    </Button>
                  </motion.div>
                ) : (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-6"
                  >
                    {/* Social Buttons */}
                    <div className="grid grid-cols-1">
                      <Button 
                        variant="outline" 
                        onClick={() => handleSocialLogin('google')}
                        disabled={isLoading}
                        className="bg-white/5 border-white/10 hover:bg-white/10 text-white"
                      >
                        <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-1 .67-2.28 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                        </svg>
                        Continue with Google
                      </Button>
                    </div>

                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-white/10"></div>
                      </div>
                      <div className="relative flex justify-center text-[10px] uppercase">
                        <span className="bg-slate-950 px-3 text-gray-500 font-bold tracking-widest">Or login with</span>
                      </div>
                    </div>

                    <form onSubmit={handleEmailLogin} className="space-y-4">
                      <div className="space-y-2">
                        <Label className="text-gray-400 text-xs">Email Address</Label>
                        <Input 
                          type="email" 
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="name@example.com"
                          className="bg-black/40 border-white/10 text-white placeholder:text-gray-700 focus:border-purple-500/50"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label className="text-gray-400 text-xs">Password</Label>
                          <button type="button" onClick={handleMagicLink} className="text-[10px] font-bold text-purple-400 hover:text-purple-300">
                             Send Magic Link?
                          </button>
                        </div>
                        <Input 
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="••••••••" 
                          className="bg-black/40 border-white/10 text-white placeholder:text-gray-700 focus:border-purple-500/50"
                          required
                        />
                      </div>
                      <Button 
                        type="submit" 
                        disabled={isLoading}
                        className="w-full bg-gradient-to-r from-purple-600 to-red-600 hover:from-purple-500 hover:to-red-500 font-bold h-11"
                      >
                        {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Log In'}
                      </Button>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>
            </TabsContent>

            <TabsContent value="signup" className="space-y-6">
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-gray-400 text-xs">Full Name</Label>
                  <Input 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe" 
                    className="bg-black/40 border-white/10 text-white placeholder:text-gray-700 focus:border-purple-500/50"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-400 text-xs">Email Address</Label>
                  <Input 
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)} 
                    placeholder="name@example.com" 
                    className="bg-black/40 border-white/10 text-white placeholder:text-gray-700 focus:border-purple-500/50"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-400 text-xs">Password</Label>
                  <Input 
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)} 
                    placeholder="Minimum 8 characters" 
                    className="bg-black/40 border-white/10 text-white placeholder:text-gray-700 focus:border-purple-500/50"
                    required
                  />
                </div>

                <div className="flex items-center space-x-2 pt-2">
                  <Checkbox 
                    id="terms" 
                    checked={agreedToTerms}
                    onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
                    className="border-white/20 data-[state=checked]:bg-purple-500 data-[state=checked]:border-purple-500" 
                  />
                  <label htmlFor="terms" className="text-[11px] text-gray-500 font-medium">
                    I agree to the <Link href="/terms" className="text-purple-400 hover:underline">Terms of Service</Link>
                  </label>
                </div>

                <div className="space-y-4 pt-4 border-t border-white/5">
                  <Label className="text-gray-400 text-xs">I am signing up as a:</Label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setRole('buyer')}
                      className={cn(
                        "flex flex-col items-center gap-2 p-3 rounded-xl border transition-all",
                        role === 'buyer' 
                          ? "bg-purple-500/10 border-purple-500 text-white" 
                          : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10"
                      )}
                    >
                      <User className="w-5 h-5" />
                      <span className="text-xs font-bold">Buyer</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setRole('organizer')}
                      className={cn(
                        "flex flex-col items-center gap-2 p-3 rounded-xl border transition-all",
                        role === 'organizer' 
                          ? "bg-red-500/10 border-red-500 text-white" 
                          : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10"
                      )}
                    >
                      <Shield className="w-5 h-5" />
                      <span className="text-xs font-bold">Organizer</span>
                    </button>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-purple-600 to-red-600 hover:from-purple-500 hover:to-red-500 font-bold h-11 mt-4"
                >
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Create Account'}
                </Button>
              </form>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10"></div>
                </div>
                <div className="relative flex justify-center text-[10px] uppercase">
                  <span className="bg-slate-950 px-3 text-gray-500 font-bold tracking-widest">Or join with</span>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3">
                <Button 
                  variant="outline"
                  onClick={() => handleSocialLogin('google')}
                  disabled={isLoading}
                  className="bg-white/5 border-white/10 hover:bg-white/10 text-white"
                >
                  <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-1 .67-2.28 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  Continue with Google
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
        
        {/* Footer Glow */}
        <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-purple-500/50 to-transparent"></div>
      </DialogContent>
    </Dialog>
  );
}

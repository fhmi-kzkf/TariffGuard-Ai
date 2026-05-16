"use client";

import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      toast.success("Welcome back!");
      router.push("/dashboard");
    }, 1000);
  };

  return (
    <div className="w-full min-h-[calc(100vh-64px)] flex items-center justify-center relative overflow-hidden px-4">
      <div className="absolute inset-0 glow-blue -z-10 pointer-events-none opacity-30" />
      
      <Card level={1} className="w-full max-w-[400px] p-8 shadow-2xl relative z-10 border-hairline-strong">
        <div className="flex justify-center mb-6">
          <div className="w-8 h-8 rounded-full bg-accent-green shadow-[0_0_15px_rgba(17,255,153,0.4)]" />
        </div>
        
        <h1 className="font-playfair text-[32px] text-ink text-center mb-2">Welcome Back</h1>
        <p className="text-[14px] text-charcoal text-center mb-8">Sign in to your TariffGuard workspace</p>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-[14px] text-ink font-medium mb-2">Email address</label>
            <Input type="email" placeholder="you@company.com" required disabled={isLoading} />
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-[14px] text-ink font-medium">Password</label>
              <Link href="#" className="text-[12px] text-accent-blue hover:underline">Forgot password?</Link>
            </div>
            <Input type="password" placeholder="••••••••" required disabled={isLoading} />
          </div>

          <Button type="submit" variant="primary" className="w-full mt-4" disabled={isLoading}>
            {isLoading ? "Signing in..." : "Sign in"}
          </Button>
        </form>

        <div className="mt-8 pt-6 border-t border-hairline text-center">
          <p className="text-[14px] text-charcoal">
            Don't have an account? <Link href="#" className="text-accent-blue hover:underline">Request access</Link>
          </p>
        </div>
      </Card>
    </div>
  );
}

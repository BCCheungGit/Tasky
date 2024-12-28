'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { signUp } from '@/lib/actions/user.actions';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';


export default function SignUpPage() {
  const [pending, setPending] = React.useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const formAction = async (formData: FormData) => {
    setPending(true);
    const response = await signUp(formData);
    if (response.error) {
      toast({
        title: 'Error',
        description: response.error,
        variant: 'destructive',
      })
      setPending(false);
    } else if (response.success) {
      toast({
        title: 'Success',
        description: 'Account created successfully with username: ' + formData.get('username'),
      }) 
      setPending(false);
      try {
        await signIn('credentials', {
          username: formData.get('username') as string,
          password: formData.get('password') as string,
          redirect: false,
        })
        router.push('/dashboard');
      } catch {
        toast({
          title: 'Error',
          description: 'An error occurred. Please try again.',
          variant: 'destructive',
        }) 
      }
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
<motion.div
        variants={{
          hidden: { x: -100, opacity: 0 },
          show: {
            x: 0,
            opacity: 1,
            transition: {
              type: "tween",
              duration: 1.5,
              delay: 0.5,
              ease: "easeInOut",
            },
          },
        }}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.25 }}
      >

      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Create an account</CardTitle>
          <CardDescription className="text-center">
            Enter your details below to create your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  name="username"
                  placeholder="Enter your username"
                  required
                  type="text"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  placeholder="Enter your password"
                  required
                  type="password"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  placeholder="Confirm your password"
                  required
                  type="password" 
                />
              </div>
              <Button className="w-full" type="submit" disabled={pending}>
                {pending ? 'Signing up...' : 'Sign Up'}
              </Button>
            </div>
          </form>
          <div className='flex flex-col items-center justify-center'>
            <p className="text-center mt-4">
              Already have an account?{' '}
              <Link href="/sign-in" className="text-primary hover:text-slate-600">
                Sign in
              </Link>
            </p>
            <Link href="/" className="text-primary hover:text-slate-600">
             Back to home 
            </Link>
          </div>
        </CardContent>
      </Card>
      </motion.div>
    </div>
  );
}
"use client";

import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";

export default function SignUpPage() {
  const { toast } = useToast();
  const [pending, setPending] = React.useState(false);
  const router = useRouter();
  const formAction = async (formData: FormData) => {
    setPending(true);
    try {
      const res = await signIn("credentials", {
        username: formData.get("username") as string,
        password: formData.get("password") as string,
        redirect: false,
      });
      if (res?.error) {
        toast({
          title: "Error",
          description: res.error,
          variant: "destructive",
        })
      }
      if (res?.ok) {
        toast({
          title: "Success",
          description: "Successfully signed in with username: " + formData.get("username"),
        })
        router.push("/dashboard");
      }
      setPending(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred. Please try again.",
        variant: "destructive",
      })
      setPending(false);
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
            <CardTitle className="text-2xl font-bold text-center">
              Sign In
            </CardTitle>
            <CardDescription className="text-center">
              Enter your details below sign in to your account
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
                <Button className="w-full" type="submit" disabled={pending}>
                  {pending ? "Signing In..." : "Sign In"}
                </Button>
              </div>
            </form>
            <div className="flex flex-col items-center justify-center">
              <p className="text-center mt-4">
                Don&apos;t have an account?{" "}
                <a href="/sign-up" className="text-primary">
                  Sign up
                </a>
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

"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Mail, CheckCircle, Loader2 } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { forgotPasswordClient } from "@/app/actions/client-auth"
import { useToast } from "@/hooks/use-toast"

// Zod schema for form validation
const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { toast } = useToast()

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  // Hydration handling
  useEffect(() => {
    setMounted(true);
  }, []);

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsLoading(true);

    try {
      const result = await forgotPasswordClient(data.email);

      if (result.success) {
        setIsSubmitted(true);
        toast({
          title: "Success",
          description: result.message,
        });
      } else {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      let errorMessage = "An unexpected error occurred. Please try again.";
      
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      } else if (error && typeof error === 'object' && 'message' in error) {
        errorMessage = String(error.message);
      }

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4" suppressHydrationWarning>
        <div className="w-full max-w-md">
          <Card className="border-0 shadow-2xl">
            <CardHeader className="text-center pb-8">
              {mounted ? (
                <>
                  <div className="flex justify-center mb-6">
                    <div className="w-16 h-16 gradient-accent rounded-full flex items-center justify-center">
                      <CheckCircle className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  <CardTitle className="text-2xl font-bold text-primary">Check Your Email</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    We've sent password reset instructions to your email address
                  </CardDescription>
                </>
              ) : (
                <>
                  <div className="w-16 h-16 bg-muted rounded-full animate-pulse mx-auto mb-6" />
                  <div className="h-8 w-48 bg-muted animate-pulse mx-auto mb-2" />
                  <div className="h-4 w-64 bg-muted animate-pulse mx-auto" />
                </>
              )}
            </CardHeader>

            <CardContent className="text-center space-y-6">
              {mounted ? (
                <>
                  <p className="text-muted-foreground">
                    If you don't see the email in your inbox, please check your spam folder.
                  </p>

                  <div className="space-y-4">
                    <Button onClick={() => setIsSubmitted(false)} variant="outline" className="w-full h-12">
                      Try Different Email
                    </Button>
                    <Link href="/login">
                      <Button className="w-full h-12 gradient-primary text-white">Back to Login</Button>
                    </Link>
                  </div>
                </>
              ) : (
                <div className="space-y-4">
                  <div className="h-4 w-64 bg-muted animate-pulse mx-auto" />
                  <div className="h-12 w-full rounded-md bg-muted animate-pulse" />
                  <div className="h-12 w-full rounded-md bg-muted animate-pulse" />
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4" suppressHydrationWarning>
      <div className="w-full max-w-md">
        {/* Back to Login */}
        {mounted ? (
          <Link
            href="/login"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Login
          </Link>
        ) : (
          <div className="h-6 w-32 bg-muted animate-pulse mb-8" />
        )}

        <Card className="border-0 shadow-2xl">
          <CardHeader className="text-center pb-8">
            {mounted ? (
              <>
                <div className="flex justify-center mb-6">
                  <Image src="/images/logo.png" alt="E-Queue Logo" width={64} height={64} className="rounded-full" />
                </div>
                <CardTitle className="text-2xl font-bold text-primary">Reset Password</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Enter your email address and we'll send you instructions to reset your password
                </CardDescription>
              </>
            ) : (
              <>
                <div className="w-16 h-16 bg-muted rounded-full animate-pulse mx-auto mb-6" />
                <div className="h-8 w-48 bg-muted animate-pulse mx-auto mb-2" />
                <div className="h-4 w-64 bg-muted animate-pulse mx-auto" />
              </>
            )}
          </CardHeader>

          <CardContent>
            {mounted ? (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" suppressHydrationWarning>
                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email address"
                      {...register("email")}
                      disabled={isLoading}
                      className={`h-12 pl-10 bg-white dark:bg-neutral-900 border ${errors.email ? "border-red-500" : "border-gray-300 dark:border-gray-700"} text-foreground placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-primary`}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-sm text-red-500">{errors.email.message}</p>
                  )}
                </div>

                {/* Submit Button */}
                <Button 
                  type="submit" 
                  className="w-full h-12 gradient-primary text-white text-lg font-medium"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    "Send Reset Instructions"
                  )}
                </Button>
              </form>
            ) : (
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="h-4 w-24 bg-muted animate-pulse" />
                  <div className="h-12 w-full rounded-md bg-muted animate-pulse" />
                </div>
                <div className="h-12 w-full rounded-md bg-muted animate-pulse" />
              </div>
            )}

            {/* Back to Login */}
            {mounted ? (
              <div className="mt-8 text-center">
                <p className="text-muted-foreground">
                  Remember your password?{" "}
                  <Link href="/login" className="text-primary hover:text-primary/80 font-medium transition-colors">
                    Sign In
                  </Link>
                </p>
              </div>
            ) : (
              <div className="mt-8 text-center">
                <div className="h-4 w-48 bg-muted animate-pulse mx-auto" />
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

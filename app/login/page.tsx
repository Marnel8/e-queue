"use client";

import type React from "react";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, ArrowLeft, AlertTriangle, Shield, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { signInClient } from "@/app/actions/client-auth";
import { useToast } from "@/hooks/use-toast";

// Zod schema for form validation
const loginSchema = z.object({
	email: z.string().email("Please enter a valid email address"),
	password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

// Role-based redirection mapping
const getRedirectPath = (role: string) => {
	switch (role) {
		case "system-admin":
			return "/admin";
		case "Office Admin":
			return "/office-admin";
		case "staff":
			return "/staff";
		case "customer":
			return "/customer";
		default:
			return "/";
	}
};

export default function LoginPage() {
	const [showPassword, setShowPassword] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const router = useRouter();
	const { toast } = useToast();

	// Login attempt tracking
	const [loginAttempts, setLoginAttempts] = useState(0);
	const [isLocked, setIsLocked] = useState(false);
	const [lockoutTime, setLockoutTime] = useState<Date | null>(null);
	const [showSecurityAlert, setShowSecurityAlert] = useState(false);

	// Field-specific errors
	const [fieldErrors, setFieldErrors] = useState<{
		email?: string;
		password?: string;
	}>({});

	// Hydration handling
	const [mounted, setMounted] = useState(false);

	// React Hook Form setup
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<LoginFormData>({
		resolver: zodResolver(loginSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});

	// Check for existing lockout on component mount
	useEffect(() => {
		setMounted(true);

		if (typeof window !== "undefined") {
			const storedAttempts = localStorage.getItem("login_attempts");
			const storedLockout = localStorage.getItem("login_lockout");

			if (storedAttempts) {
				setLoginAttempts(parseInt(storedAttempts));
			}

			if (storedLockout) {
				const lockoutDate = new Date(storedLockout);
				const now = new Date();
				const timeDiff = now.getTime() - lockoutDate.getTime();

				// Lockout for 15 minutes
				if (timeDiff < 15 * 60 * 1000) {
					setIsLocked(true);
					setLockoutTime(lockoutDate);
				} else {
					// Clear expired lockout
					localStorage.removeItem("login_lockout");
					localStorage.removeItem("login_attempts");
					setLoginAttempts(0);
					setIsLocked(false);
				}
			}
		}
	}, []);

	const onSubmit = async (data: LoginFormData) => {
		if (isLocked) {
			return;
		}

		setIsLoading(true);
		// Clear previous field errors
		setFieldErrors({});

		try {
			// Attempt Firebase authentication
			const result = await signInClient({
				email: data.email,
				password: data.password,
			});

			if (result.success && result.userData) {
				// Successful login - reset attempts
				localStorage.removeItem("login_attempts");
				localStorage.removeItem("login_lockout");
				setLoginAttempts(0);
				setIsLocked(false);

				// Show success message
				toast({
					title: "Success",
					description: result.message,
				});

				// Redirect based on user role
				const redirectPath = getRedirectPath(result.userData.role);
				router.push(redirectPath);
			} else {
				// Failed login - increment attempts
				const newAttempts = loginAttempts + 1;
				setLoginAttempts(newAttempts);
				localStorage.setItem("login_attempts", newAttempts.toString());

				// Set field-specific errors based on error message
				if (result.message.toLowerCase().includes('email') || result.message.toLowerCase().includes('user')) {
					setFieldErrors({ email: result.message });
				} else if (result.message.toLowerCase().includes('password') || result.message.toLowerCase().includes('invalid')) {
					setFieldErrors({ password: result.message });
				} else {
					// General error - show in toast
					toast({
						title: "Login Failed",
						description: result.message,
						variant: "destructive",
					});
				}

				// Check if account should be locked
				if (newAttempts >= 3) {
					const lockoutDate = new Date();
					localStorage.setItem("login_lockout", lockoutDate.toISOString());
					setIsLocked(true);
					setLockoutTime(lockoutDate);

					// Log violation
					const violations = JSON.parse(
						localStorage.getItem("equeue_violations") || "[]"
					);
					violations.push({
						id: Date.now(),
						type: "login_attempts_exceeded",
						when: lockoutDate.toISOString(),
						detail: `Account locked due to ${newAttempts} consecutive failed login attempts for ${data.email}`,
						email: data.email,
						role: result.userData?.role || "unknown",
					});
					localStorage.setItem("equeue_violations", JSON.stringify(violations));

					setShowSecurityAlert(true);
				}
			}
		} catch (error) {
			// Extract error message for user display
			let errorMessage = "An unexpected error occurred. Please try again.";
			
			if (error instanceof Error) {
				errorMessage = error.message;
			} else if (typeof error === 'string') {
				errorMessage = error;
			} else if (error && typeof error === 'object' && 'message' in error) {
				errorMessage = String(error.message);
			}
			
			// Set field-specific errors based on error message
			if (errorMessage.toLowerCase().includes('email') || errorMessage.toLowerCase().includes('user')) {
				setFieldErrors({ email: errorMessage });
			} else if (errorMessage.toLowerCase().includes('password') || errorMessage.toLowerCase().includes('invalid')) {
				setFieldErrors({ password: errorMessage });
			} else {
				// General error - show in toast
				toast({
					title: "Error",
					description: errorMessage,
					variant: "destructive",
				});
			}
		} finally {
			setIsLoading(false);
		}
	};

	const getRemainingLockoutTime = () => {
		if (!lockoutTime) return 0;

		const now = new Date();
		const timeDiff = now.getTime() - lockoutTime.getTime();
		const remainingMs = 15 * 60 * 1000 - timeDiff;

		if (remainingMs <= 0) {
			setIsLocked(false);
			localStorage.removeItem("login_lockout");
			localStorage.removeItem("login_attempts");
			setLoginAttempts(0);
			return 0;
		}

		return Math.ceil(remainingMs / 1000 / 60); // Return minutes
	};

	// Auto-unlock countdown
	useEffect(() => {
		if (isLocked && lockoutTime) {
			const interval = setInterval(() => {
				const remaining = getRemainingLockoutTime();
				if (remaining <= 0) {
					clearInterval(interval);
				}
			}, 1000);

			return () => clearInterval(interval);
		}
	}, [isLocked, lockoutTime]);

	if (isLocked) {
		const remainingMinutes = getRemainingLockoutTime();

		return (
			<div
				className="min-h-screen bg-background flex items-center justify-center p-4"
				suppressHydrationWarning
			>
				<Card className="w-full max-w-md">
					<CardHeader className="text-center">
						{mounted ? (
							<>
								<div
									key="lockout-icon"
									className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4"
								>
									<Shield className="w-8 h-8 text-red-600" />
								</div>
								<CardTitle className="text-2xl text-red-600">
									Account Temporarily Locked
								</CardTitle>
								<CardDescription>
									Too many failed login attempts detected
								</CardDescription>
							</>
						) : (
							<>
								<div className="w-16 h-16 bg-muted rounded-full animate-pulse mx-auto mb-4" />
								<div className="h-8 w-48 bg-muted animate-pulse mx-auto mb-2" />
								<div className="h-4 w-64 bg-muted animate-pulse mx-auto" />
							</>
						)}
					</CardHeader>
					<CardContent className="space-y-4">
						{mounted ? (
							<>
								<div className="text-center space-y-2">
									<p className="text-sm text-muted-foreground">
										Your account has been locked due to multiple failed login
										attempts.
									</p>
									<p className="text-sm font-medium">
										Time remaining:{" "}
										<span className="text-red-600">
											{remainingMinutes} minutes
										</span>
									</p>
									<p className="text-xs text-muted-foreground">
										This is a security measure to protect your account.
									</p>
								</div>

								{showSecurityAlert && (
									<div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
										<div className="flex items-center gap-2 text-yellow-800">
											<AlertTriangle
												key="security-alert-icon"
												className="w-4 h-4"
											/>
											<span className="text-sm font-medium">
												Security Alert
											</span>
										</div>
										<p className="text-xs text-yellow-700 mt-1">
											This incident has been logged for security review.
										</p>
									</div>
								)}

								<div className="text-center">
									<Button
										key="try-again-button"
										onClick={() => window.location.reload()}
										variant="outline"
										disabled={remainingMinutes > 0}
									>
										Try Again
									</Button>
								</div>
							</>
						) : (
							<div className="space-y-4">
								<div className="h-9 w-full rounded-md bg-muted animate-pulse" />
								<div className="h-9 w-full rounded-md bg-muted animate-pulse" />
								<div className="h-9 w-full rounded-md bg-muted animate-pulse" />
								<div className="h-9 w-full rounded-md bg-muted animate-pulse" />
							</div>
						)}
					</CardContent>
				</Card>
			</div>
		);
	}

	return (
		<div
			className="min-h-screen bg-background flex items-center justify-center p-4"
			suppressHydrationWarning
		>
			<div className="w-full max-w-md space-y-6">
				{/* Logo */}
				<div className="text-center">
					{mounted ? (
						<>
							<Image
								key="logo-image"
								src="/images/logo.png"
								alt="E-QUEUE Logo"
								width={120}
								height={120}
								className="mx-auto mb-4"
							/>
							<h1 className="text-2xl font-bold text-[#071952]">
								Welcome Back
							</h1>
							<p className="text-muted-foreground">
								Sign in to your E-QUEUE account
							</p>
						</>
					) : (
						<>
							<div className="w-30 h-30 bg-muted rounded-full animate-pulse mx-auto mb-4" />
							<div className="h-8 w-48 bg-muted animate-pulse mx-auto mb-2" />
							<div className="h-4 w-64 bg-muted animate-pulse mx-auto" />
						</>
					)}
				</div>

				{/* Login Form */}
				{mounted ? (
					<Card>
						<CardContent className="p-6">
							<form
								onSubmit={handleSubmit(onSubmit)}
								className="space-y-4"
								suppressHydrationWarning
							>

								{/* Email */}
								<div className="space-y-2">
									<Label htmlFor="email">Email Address</Label>
									<Input
										id="email"
										type="email"
										placeholder="Enter your email"
										{...register("email")}
										disabled={isLocked || isLoading}
										className={`bg-white dark:bg-neutral-900 border ${errors.email || fieldErrors.email ? "border-red-500" : "border-gray-300 dark:border-gray-700"} text-foreground placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-primary`}
									/>
									{errors.email && (
										<p className="text-sm text-red-500">{errors.email.message}</p>
									)}
									{fieldErrors.email && (
										<p className="text-sm text-red-500">{fieldErrors.email}</p>
									)}
								</div>

								{/* Password */}
								<div className="space-y-2">
									<Label htmlFor="password">Password</Label>
									<div className="relative">
										<Input
											id="password"
											type={mounted && showPassword ? "text" : "password"}
											placeholder="Enter your password"
											{...register("password")}
											disabled={isLocked || isLoading}
											className={`bg-white dark:bg-neutral-900 border ${errors.password || fieldErrors.password ? "border-red-500" : "border-gray-300 dark:border-gray-700"} text-foreground placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-primary`}
										/>
										{mounted && (
											<Button
												key="password-toggle-button"
												type="button"
												variant="ghost"
												size="sm"
												className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
												onClick={() => setShowPassword(!showPassword)}
												disabled={isLocked || isLoading}
											>
												{showPassword ? (
													<EyeOff key="eye-off-icon" className="h-4 w-4" />
												) : (
													<Eye key="eye-icon" className="h-4 w-4" />
												)}
											</Button>
										)}
									</div>
									{errors.password && (
										<p className="text-sm text-red-500">{errors.password.message}</p>
									)}
									{fieldErrors.password && (
										<p className="text-sm text-red-500">{fieldErrors.password}</p>
									)}
								</div>

								{/* Remember Me removed */}

								{/* Login Attempts Warning */}
								{loginAttempts > 0 && (
									<div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
										<div className="flex items-center gap-2 text-yellow-800">
											<AlertTriangle
												key="login-attempts-icon"
												className="w-4 h-4"
											/>
											<span className="text-sm font-medium">
												Login Attempts
											</span>
										</div>
										<p className="text-xs text-yellow-700 mt-1">
											Failed attempts: {loginAttempts}/3. Account will be locked
											after 3 failed attempts.
										</p>
									</div>
								)}

								{/* Submit Button */}
								{mounted ? (
									<Button
										key="sign-in-button"
										type="submit"
										className="w-full gradient-primary text-white"
										disabled={isLocked || isLoading}
									>
										{isLoading ? (
											<>
												<Loader2 className="mr-2 h-4 w-4 animate-spin" />
												Signing In...
											</>
										) : (
											"Sign In"
										)}
									</Button>
								) : (
									<div className="h-9 w-full rounded-md bg-muted animate-pulse" />
								)}
							</form>
						</CardContent>
					</Card>
				) : (
					<Card>
						<CardContent className="p-6">
							<div className="space-y-4">
								<div className="h-9 w-full rounded-md bg-muted animate-pulse" />
								<div className="h-9 w-full rounded-md bg-muted animate-pulse" />
								<div className="h-9 w-full rounded-md bg-muted animate-pulse" />
								<div className="h-9 w-full rounded-md bg-muted animate-pulse" />
							</div>
						</CardContent>
					</Card>
				)}

				{/* Links */}
				{mounted ? (
					<>
						<div className="text-center space-y-2">
							<Link
								href="/forgot-password"
								className="text-sm text-primary hover:underline"
							>
								Forgot your password?
							</Link>
							<div className="text-sm text-muted-foreground">
								Don't have an account?{" "}
								<Link href="/register" className="text-primary hover:underline">
									Sign up
								</Link>
							</div>
							{/* <div className="text-sm text-muted-foreground">
								Need admin access?{" "}
								<Link href="/admin-signup" className="text-primary hover:underline font-medium">
									Admin Sign Up
								</Link>
							</div> */}
						</div>

						{/* Back to Home */}
						<div className="text-center">
							<Link
								href="/"
								className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
							>
								<ArrowLeft key="back-arrow" className="w-4 h-4" />
								Back to Home
							</Link>
						</div>
					</>
				) : (
					<div className="space-y-4">
						<div className="h-4 w-32 bg-muted animate-pulse mx-auto" />
						<div className="h-4 w-48 bg-muted animate-pulse mx-auto" />
						<div className="h-4 w-32 bg-muted animate-pulse mx-auto" />
					</div>
				)}
			</div>
		</div>
	);
}

"use client";

import type React from "react";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff, ArrowLeft, AlertTriangle, Shield } from "lucide-react";

export default function LoginPage() {
	const [showPassword, setShowPassword] = useState(false);
	const [userRole, setUserRole] = useState("");
	const [formData, setFormData] = useState({
		email: "",
		password: "",
		rememberMe: false,
	});

	// Login attempt tracking
	const [loginAttempts, setLoginAttempts] = useState(0);
	const [isLocked, setIsLocked] = useState(false);
	const [lockoutTime, setLockoutTime] = useState<Date | null>(null);
	const [showSecurityAlert, setShowSecurityAlert] = useState(false);

	// Check for existing lockout on component mount
	useEffect(() => {
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

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		if (isLocked) {
			return;
		}

		// Simulate login attempt
		const isSuccessful = Math.random() > 0.7; // 30% success rate for demo

		if (isSuccessful) {
			// Successful login - reset attempts
			localStorage.removeItem("login_attempts");
			localStorage.removeItem("login_lockout");
			setLoginAttempts(0);
			setIsLocked(false);
			console.log("Login successful:", { ...formData, role: userRole });
		} else {
			// Failed login - increment attempts
			const newAttempts = loginAttempts + 1;
			setLoginAttempts(newAttempts);
			localStorage.setItem("login_attempts", newAttempts.toString());

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
					detail: `Account locked due to ${newAttempts} consecutive failed login attempts for ${formData.email}`,
					email: formData.email,
					role: userRole,
				});
				localStorage.setItem("equeue_violations", JSON.stringify(violations));

				setShowSecurityAlert(true);
			}

			console.log("Login failed:", {
				...formData,
				role: userRole,
				attempts: newAttempts,
			});
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
			<div className="min-h-screen bg-background flex items-center justify-center p-4">
				<Card className="w-full max-w-md">
					<CardHeader className="text-center">
						<div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
							<Shield className="w-8 h-8 text-red-600" />
						</div>
						<CardTitle className="text-2xl text-red-600">
							Account Temporarily Locked
						</CardTitle>
						<CardDescription>
							Too many failed login attempts detected
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="text-center space-y-2">
							<p className="text-sm text-muted-foreground">
								Your account has been locked due to multiple failed login
								attempts.
							</p>
							<p className="text-sm font-medium">
								Time remaining:{" "}
								<span className="text-red-600">{remainingMinutes} minutes</span>
							</p>
							<p className="text-xs text-muted-foreground">
								This is a security measure to protect your account.
							</p>
						</div>

						{showSecurityAlert && (
							<div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
								<div className="flex items-center gap-2 text-yellow-800">
									<AlertTriangle className="w-4 h-4" />
									<span className="text-sm font-medium">Security Alert</span>
								</div>
								<p className="text-xs text-yellow-700 mt-1">
									This incident has been logged for security review.
								</p>
							</div>
						)}

						<div className="text-center">
							<Button
								onClick={() => window.location.reload()}
								variant="outline"
								disabled={remainingMinutes > 0}
							>
								Try Again
							</Button>
						</div>
					</CardContent>
				</Card>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-background flex items-center justify-center p-4">
			<div className="w-full max-w-md space-y-6">
				{/* Logo */}
				<div className="text-center">
					<Image
						src="/images/logo.png"
						alt="E-QUEUE Logo"
						width={120}
						height={120}
						className="mx-auto mb-4"
					/>
					<h1 className="text-2xl font-bold text-[#071952]">Welcome Back</h1>
					<p className="text-muted-foreground">
						Sign in to your E-QUEUE account
					</p>
				</div>

				{/* Login Form */}
				<Card>
					<CardContent className="p-6">
						<form onSubmit={handleSubmit} className="space-y-4">
							{/* Role Selection */}
							<div className="space-y-2">
								<Label htmlFor="role">Select Role</Label>
								<Select value={userRole} onValueChange={setUserRole} required>
									<SelectTrigger>
										<SelectValue placeholder="Choose your role" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="customer">Customer / Student</SelectItem>
										<SelectItem value="staff">Office Staff</SelectItem>
										<SelectItem value="office-admin">Office Admin</SelectItem>
										<SelectItem value="system-admin">System Admin</SelectItem>
									</SelectContent>
								</Select>
							</div>

							{/* Email */}
							<div className="space-y-2">
								<Label htmlFor="email">Email Address</Label>
								<Input
									id="email"
									type="email"
									value={formData.email}
									onChange={(e) =>
										setFormData({ ...formData, email: e.target.value })
									}
									required
									disabled={isLocked}
								/>
							</div>

							{/* Password */}
							<div className="space-y-2">
								<Label htmlFor="password">Password</Label>
								<div className="relative">
									<Input
										id="password"
										type={showPassword ? "text" : "password"}
										value={formData.password}
										onChange={(e) =>
											setFormData({ ...formData, password: e.target.value })
										}
										required
										disabled={isLocked}
									/>
									<Button
										type="button"
										variant="ghost"
										size="sm"
										className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
										onClick={() => setShowPassword(!showPassword)}
										disabled={isLocked}
									>
										{showPassword ? (
											<EyeOff className="h-4 w-4" />
										) : (
											<Eye className="h-4 w-4" />
										)}
									</Button>
								</div>
							</div>

							{/* Remember Me */}
							<div className="flex items-center space-x-2">
								<Checkbox
									id="remember"
									checked={formData.rememberMe}
									onCheckedChange={(checked) =>
										setFormData({ ...formData, rememberMe: checked as boolean })
									}
									disabled={isLocked}
								/>
								<Label htmlFor="remember" className="text-sm font-normal">
									Remember me
								</Label>
							</div>

							{/* Login Attempts Warning */}
							{loginAttempts > 0 && (
								<div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
									<div className="flex items-center gap-2 text-yellow-800">
										<AlertTriangle className="w-4 h-4" />
										<span className="text-sm font-medium">Login Attempts</span>
									</div>
									<p className="text-xs text-yellow-700 mt-1">
										Failed attempts: {loginAttempts}/3. Account will be locked
										after 3 failed attempts.
									</p>
								</div>
							)}

							{/* Submit Button */}
							<Button
								type="submit"
								className="w-full gradient-primary text-white"
								disabled={isLocked || !userRole}
							>
								Sign In
							</Button>
						</form>
					</CardContent>
				</Card>

				{/* Links */}
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
				</div>

				{/* Back to Home */}
				<div className="text-center">
					<Link
						href="/"
						className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
					>
						<ArrowLeft className="w-4 h-4" />
						Back to Home
					</Link>
				</div>
			</div>
		</div>
	);
}

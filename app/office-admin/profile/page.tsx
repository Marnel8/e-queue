"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/contexts/auth-context";
import { useToast } from "@/hooks/use-toast";
import { changePasswordClient } from "@/app/actions/client-auth";
import { logUserAction } from "@/app/actions/activity-log";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { User, Mail, Phone, Shield, Key, Save } from "lucide-react";

const ProfileSchema = z.object({
	name: z.string().min(1, "Name is required"),
	email: z.string().email("Invalid email address"),
	phone: z.string().optional().or(z.literal("")),
	address: z.string().optional().or(z.literal("")),
	department: z.string().optional().or(z.literal("")),
	position: z.string().optional().or(z.literal("")),
	workStart: z.string().optional().or(z.literal("")),
	workEnd: z.string().optional().or(z.literal("")),
	bio: z.string().optional().or(z.literal("")),
});

const PasswordSchema = z
	.object({
		currentPassword: z.string().min(1, "Current password is required"),
		newPassword: z.string().min(6, "Password must be at least 6 characters"),
		confirmPassword: z.string().min(6, "Confirm your new password"),
	})
	.refine((data) => data.newPassword === data.confirmPassword, {
		path: ["confirmPassword"],
		message: "Passwords do not match",
	});

type ProfileForm = z.infer<typeof ProfileSchema>;
type PasswordForm = z.infer<typeof PasswordSchema>;

export default function ProfilePage() {
	const { user, userData } = useAuth();
	const { toast } = useToast();
	const [activeTab, setActiveTab] = useState("profile");
	const [mounted, setMounted] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isChangingPassword, setIsChangingPassword] = useState(false);
	const [isEditing, setIsEditing] = useState(false);
	const [activityLog, setActivityLog] = useState<any[]>([]);

	const form = useForm<ProfileForm>({
		resolver: zodResolver(ProfileSchema),
		defaultValues: {
			name: "",
			email: "",
			phone: "",
			address: "",
			department: "",
			position: "",
			workStart: "",
			workEnd: "",
			bio: "",
		},
	});

	const passwordForm = useForm<PasswordForm>({
		resolver: zodResolver(PasswordSchema),
		defaultValues: {
			currentPassword: "",
			newPassword: "",
			confirmPassword: "",
		},
	});

	// Role-based permission definitions (matching admin system)
	const rolePermissions = {
		"system-admin": [
			"Manage Users",
			"Manage Offices", 
			"View System Reports",
			"Manage System Settings",
			"Manage Violations",
			"Full System Access"
		],
		"office-admin": [
			"Manage Staff",
			"Manage Services", 
			"Manage Queue Lanes",
			"View Office Reports",
			"Handle Feedback",
			"Create Announcements",
			"Manage Logbook",
			"Manage Evaluations",
			"Manage Violations"
		],
		"staff": [
			"Manage Queue",
			"Register Walk-ins",
			"View Archives",
			"Basic Operations"
		],
		"customer": [
			"View Queue",
			"Book Tickets", 
			"Manage Tickets",
			"Submit Feedback",
			"View Violations"
		]
	};

	// Get permissions for a specific role
	const getPermissionsForRole = (role: string) => {
		return rolePermissions[role as keyof typeof rolePermissions] || [];
	};

	// Get user's permissions based on their role
	const permissions = userData?.role ? getPermissionsForRole(userData.role) : [];

	// Load user data into form when available
	useEffect(() => {
		if (!userData) return;
		form.reset({
			name: userData.name || "",
			email: userData.email || "",
			phone: (userData as any).phone || "",
			address: (userData as any).address || "",
			department: (userData as any).department || "",
			position: (userData as any).position || "",
			workStart: (userData as any).workStart || "",
			workEnd: (userData as any).workEnd || "",
			bio: (userData as any).bio || "",
		});
	}, [userData, form]);

	// Load activity log from server
	useEffect(() => {
		const loadActivityLog = async () => {
			if (!user?.uid) return;
			try {
				const response = await fetch(`/api/users/${user.uid}/activity`);
				if (response.ok) {
					const data = await response.json();
					setActivityLog(data.activities || []);
				}
			} catch (error) {
				// Fallback to mock data if API not available
				setActivityLog([
					{
						id: 1,
						action: "Updated service requirements",
						service: "Transcript Request",
						timestamp: "2024-01-20 14:30",
						type: "update",
					},
					{
						id: 2,
						action: "Added new staff member",
						service: "Staff Management",
						timestamp: "2024-01-20 10:15",
						type: "create",
					},
					{
						id: 3,
						action: "Published announcement",
						service: "System Maintenance Notice",
						timestamp: "2024-01-19 16:45",
						type: "publish",
					},
					{
						id: 4,
						action: "Generated monthly report",
						service: "Performance Analytics",
						timestamp: "2024-01-19 09:20",
						type: "report",
					},
				]);
			}
		};
		loadActivityLog();
	}, [user?.uid]);

	const onSubmit = async (values: ProfileForm) => {
		if (!user?.uid) return;
		setIsSubmitting(true);
		try {
			const res = await fetch("/api/users", {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ 
					uid: user.uid, 
					updates: {
						name: values.name,
						email: values.email,
						phone: values.phone || null,
						address: values.address || null,
						department: values.department || null,
						position: values.position || null,
						workStart: values.workStart || null,
						workEnd: values.workEnd || null,
						bio: values.bio || null,
					} 
				}),
			});
			const json = await res.json();
			if (json?.success) {
				// Log the activity
				await logUserAction(
					user.uid,
					"Updated profile information",
					"Profile Management",
					"update"
				);
				
				toast({ 
					title: "Profile updated", 
					description: "Your information has been saved." 
				});
				
				setIsEditing(false);
				
				// Refresh activity log
				const response = await fetch(`/api/users/${user.uid}/activity`);
				if (response.ok) {
					const data = await response.json();
					setActivityLog(data.activities || []);
				}
			} else {
				toast({ 
					title: "Update failed", 
					description: json?.message ?? "Please try again.", 
					variant: "destructive" 
				});
			}
		} catch (e) {
			toast({ 
				title: "Update failed", 
				description: "Network error.", 
				variant: "destructive" 
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleEdit = () => {
		setIsEditing(true);
	};

	const handleCancel = () => {
		setIsEditing(false);
		// Reset form to original values
		if (userData) {
			form.reset({
				name: userData.name || "",
				email: userData.email || "",
				phone: (userData as any).phone || "",
				address: (userData as any).address || "",
				department: (userData as any).department || "",
				position: (userData as any).position || "",
				workStart: (userData as any).workStart || "",
				workEnd: (userData as any).workEnd || "",
				bio: (userData as any).bio || "",
			});
		}
	};

	const onChangePassword = async (values: PasswordForm) => {
		setIsChangingPassword(true);
		try {
			const result = await changePasswordClient(values.currentPassword, values.newPassword);
			if (result.success) {
				// Log the activity
				await logUserAction(
					user!.uid,
					"Changed account password",
					"Security Management",
					"update"
				);
				
				toast({ 
					title: "Password updated", 
					description: "Your password has been changed." 
				});
				passwordForm.reset();
				
				// Refresh activity log
				const response = await fetch(`/api/users/${user!.uid}/activity`);
				if (response.ok) {
					const data = await response.json();
					setActivityLog(data.activities || []);
				}
			} else {
				toast({ 
					title: "Update failed", 
					description: result.message, 
					variant: "destructive" 
				});
			}
		} catch (e) {
			toast({ 
				title: "Update failed", 
				description: "Network error.", 
				variant: "destructive" 
			});
		} finally {
			setIsChangingPassword(false);
		}
	};

	const getActivityIcon = (type: string) => {
		switch (type) {
			case "update":
				return "📝";
			case "create":
				return "➕";
			case "publish":
				return "📢";
			case "report":
				return "📊";
			default:
				return "📋";
		}
	};

	// Get permission icon and description
	const getPermissionInfo = (permission: string) => {
		const permissionInfo: Record<string, { icon: string; description: string }> = {
			"Manage Users": { icon: "👥", description: "Add, edit, and manage user accounts" },
			"Manage Offices": { icon: "🏢", description: "Create and configure office locations" },
			"View System Reports": { icon: "📊", description: "Access comprehensive system analytics" },
			"Manage System Settings": { icon: "⚙️", description: "Configure global system parameters" },
			"Manage Violations": { icon: "⚠️", description: "Handle and track policy violations" },
			"Full System Access": { icon: "🔑", description: "Complete administrative control" },
			"Manage Staff": { icon: "👨‍💼", description: "Add and manage staff members" },
			"Manage Services": { icon: "🛠️", description: "Configure available services" },
			"Manage Queue Lanes": { icon: "🚶‍♂️", description: "Set up and manage queue lanes" },
			"View Office Reports": { icon: "📈", description: "Access office-specific analytics" },
			"Handle Feedback": { icon: "💬", description: "Review and respond to feedback" },
			"Create Announcements": { icon: "📢", description: "Publish office announcements" },
			"Manage Logbook": { icon: "📝", description: "Maintain daily activity logs" },
			"Manage Evaluations": { icon: "⭐", description: "Conduct staff evaluations" },
			"Manage Queue": { icon: "🎫", description: "Process and manage queue tickets" },
			"Register Walk-ins": { icon: "🚶‍♀️", description: "Register walk-in customers" },
			"View Archives": { icon: "📁", description: "Access historical records" },
			"Basic Operations": { icon: "🔧", description: "Essential operational tasks" },
			"View Queue": { icon: "👀", description: "View current queue status" },
			"Book Tickets": { icon: "🎫", description: "Book service appointments" },
			"Manage Tickets": { icon: "🎫", description: "Manage your service tickets" },
			"Submit Feedback": { icon: "💭", description: "Provide service feedback" },
			"View Violations": { icon: "👁️", description: "View your violation records" }
		};
		return permissionInfo[permission] || { icon: "🔐", description: "System permission" };
	};

	useEffect(() => {
		setMounted(true);
	}, []);

	return (
		<div className="space-y-6">
			{/* Page Header */}
			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
				<div>
					<h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>
					<p className="text-gray-600">
						Manage your account information and preferences
					</p>
				</div>
			</div>

			{/* Profile Overview Card */}
			<Card>
				<CardContent className="p-6">
					<div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
						<Avatar className="w-20 h-20">
							<AvatarImage src="/placeholder.svg?height=80&width=80" />
							<AvatarFallback className="bg-[#088395] text-white text-xl">
								{userData?.name ? userData.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'OA'}
							</AvatarFallback>
						</Avatar>
						<div className="flex-1 space-y-2">
							<div className="flex items-center gap-3">
								<h2 className="text-xl font-semibold text-gray-900">
									{userData?.name || 'Loading...'}
								</h2>
								<Badge className="bg-[#088395] text-white">
									{(userData as any)?.position || 'Office Administrator'}
								</Badge>
							</div>
							<p className="text-gray-600">{(userData as any)?.department || 'Department'}</p>
							<div className="flex items-center gap-4 text-sm text-gray-500">
								<div className="flex items-center gap-1">
									<Mail className="w-4 h-4" />
									{userData?.email || 'Loading...'}
								</div>
								<div className="flex items-center gap-1">
									<Phone className="w-4 h-4" />
									{(userData as any)?.phone || 'Not provided'}
								</div>
							</div>
						</div>
						<Button 
							className="gradient-primary"
							onClick={() => setActiveTab("profile")}
						>
							<User className="w-4 h-4 mr-2" />
							View Profile
						</Button>
					</div>
				</CardContent>
			</Card>

			{/* Main Content */}
			<Tabs value={activeTab} onValueChange={setActiveTab}>
				<TabsList className="grid w-full grid-cols-4 lg:w-auto">
					<TabsTrigger value="profile">Profile</TabsTrigger>
					<TabsTrigger value="security">Security</TabsTrigger>
					<TabsTrigger value="permissions">Permissions</TabsTrigger>
					<TabsTrigger value="activity">Activity</TabsTrigger>
				</TabsList>

				<TabsContent value="profile" className="space-y-6">
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
						<Card>
							<CardHeader>
								<CardTitle>Personal Information</CardTitle>
								<CardDescription>Update your personal details</CardDescription>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="space-y-2">
									<Label htmlFor="name">Full Name</Label>
									<Input 
										id="name" 
										placeholder="Enter your full name"
										disabled={!isEditing}
										{...form.register("name")} 
									/>
									{form.formState.errors.name && (
										<p className="text-sm text-red-600">{form.formState.errors.name.message}</p>
									)}
								</div>

								<div className="space-y-2">
									<Label htmlFor="email">Email Address</Label>
									<Input
										id="email"
										type="email"
										disabled
										{...form.register("email")}
									/>
									{form.formState.errors.email && (
										<p className="text-sm text-red-600">{form.formState.errors.email.message}</p>
									)}
								</div>

								<div className="space-y-2">
									<Label htmlFor="phone">Phone Number</Label>
									<Input 
										id="phone" 
										placeholder="09xx xxx xxxx"
										disabled={!isEditing}
										{...form.register("phone")} 
									/>
									{form.formState.errors.phone && (
										<p className="text-sm text-red-600">{form.formState.errors.phone.message}</p>
									)}
								</div>

								<div className="space-y-2">
									<Label htmlFor="address">Address</Label>
									<Input 
										id="address" 
										placeholder="City, Province"
										disabled={!isEditing}
										{...form.register("address")} 
									/>
									{form.formState.errors.address && (
										<p className="text-sm text-red-600">{form.formState.errors.address.message}</p>
									)}
								</div>

								<div className="space-y-2">
									<Label htmlFor="bio">Bio</Label>
									<Textarea
										id="bio"
										placeholder="Tell us about yourself"
										className="min-h-20"
										disabled={!isEditing}
										{...form.register("bio")}
									/>
									{form.formState.errors.bio && (
										<p className="text-sm text-red-600">{form.formState.errors.bio.message}</p>
									)}
								</div>

								<div className="flex justify-end gap-2">
									{!isEditing ? (
										<Button 
											className="gradient-primary"
											onClick={handleEdit}
										>
											<User className="w-4 h-4 mr-2" />
											Edit Profile
										</Button>
									) : (
										<>
											<Button 
												variant="outline"
												onClick={handleCancel}
												disabled={isSubmitting}
											>
												Cancel
											</Button>
											<Button 
												className="gradient-primary"
												onClick={form.handleSubmit(onSubmit)}
												disabled={isSubmitting}
											>
												<Save className="w-4 h-4 mr-2" />
												{isSubmitting ? "Saving..." : "Save Changes"}
											</Button>
										</>
									)}
								</div>
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<CardTitle>Work Information</CardTitle>
								<CardDescription>Your employment details</CardDescription>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="space-y-2">
									<Label htmlFor="employeeId">Employee ID</Label>
									<Input
										id="employeeId"
										value={(userData as any)?.employeeId || 'Not assigned'}
										disabled
									/>
								</div>

								<div className="space-y-2">
									<Label htmlFor="position">Position</Label>
									<Input 
										id="position" 
										placeholder="Your position"
										disabled={!isEditing}
										{...form.register("position")} 
									/>
									{form.formState.errors.position && (
										<p className="text-sm text-red-600">{form.formState.errors.position.message}</p>
									)}
								</div>

								<div className="space-y-2">
									<Label htmlFor="department">Department</Label>
									<Input 
										id="department" 
										placeholder="Your department"
										disabled={!isEditing}
										{...form.register("department")} 
									/>
									{form.formState.errors.department && (
										<p className="text-sm text-red-600">{form.formState.errors.department.message}</p>
									)}
								</div>

								<div className="space-y-2">
									<Label htmlFor="dateJoined">Date Joined</Label>
									<Input
										id="dateJoined"
										value={
											mounted && (userData as any)?.createdAt
												? new Date((userData as any).createdAt).toLocaleDateString()
												: 'Not available'
										}
										disabled
									/>
								</div>

								<div className="space-y-2">
									<Label>Work Schedule</Label>
									<div className="grid grid-cols-2 gap-2">
										<Input 
											type="time"
											placeholder="Start Time" 
											disabled={!isEditing}
											{...form.register("workStart")} 
										/>
										<Input 
											type="time"
											placeholder="End Time" 
											disabled={!isEditing}
											{...form.register("workEnd")} 
										/>
									</div>
								</div>
							</CardContent>
						</Card>
					</div>
				</TabsContent>

				<TabsContent value="security" className="space-y-6">
					<Card>
						<CardHeader>
							<CardTitle>Change Password</CardTitle>
							<CardDescription>Update your account password</CardDescription>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="space-y-2">
								<Label htmlFor="currentPassword">Current Password</Label>
								<Input 
									id="currentPassword" 
									type="password" 
									placeholder="••••••••"
									{...passwordForm.register("currentPassword")} 
								/>
								{passwordForm.formState.errors.currentPassword && (
									<p className="text-sm text-red-600">{passwordForm.formState.errors.currentPassword.message}</p>
								)}
							</div>

							<div className="space-y-2">
								<Label htmlFor="newPassword">New Password</Label>
								<Input 
									id="newPassword" 
									type="password" 
									placeholder="At least 6 characters"
									{...passwordForm.register("newPassword")} 
								/>
								{passwordForm.formState.errors.newPassword && (
									<p className="text-sm text-red-600">{passwordForm.formState.errors.newPassword.message}</p>
								)}
							</div>

							<div className="space-y-2">
								<Label htmlFor="confirmPassword">Confirm New Password</Label>
								<Input 
									id="confirmPassword" 
									type="password" 
									placeholder="Repeat new password"
									{...passwordForm.register("confirmPassword")} 
								/>
								{passwordForm.formState.errors.confirmPassword && (
									<p className="text-sm text-red-600">{passwordForm.formState.errors.confirmPassword.message}</p>
								)}
							</div>

							<Button 
								className="gradient-primary"
								onClick={passwordForm.handleSubmit(onChangePassword)}
								disabled={isChangingPassword}
							>
								<Key className="w-4 h-4 mr-2" />
								{isChangingPassword ? "Updating..." : "Update Password"}
							</Button>
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value="permissions" className="space-y-6">
					<Card>
						<CardHeader>
							<CardTitle>Access Permissions</CardTitle>
							<CardDescription>
								Your current system permissions based on your role: <strong>{(userData as any)?.role || 'office-admin'}</strong>
							</CardDescription>
						</CardHeader>
						<CardContent>
							{permissions.length > 0 ? (
								<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
									{permissions.map((permission, index) => {
										const permissionInfo = getPermissionInfo(permission);
										return (
											<div
												key={index}
												className="flex flex-col gap-2 p-4 border rounded-lg hover:shadow-md transition-shadow"
											>
												<div className="flex items-center gap-3">
													<span className="text-2xl">{permissionInfo.icon}</span>
													<span className="font-medium text-gray-900">{permission}</span>
												</div>
												<p className="text-sm text-gray-600 ml-11">
													{permissionInfo.description}
												</p>
											</div>
										);
									})}
								</div>
							) : (
								<div className="text-center py-8 text-gray-500">
									<Shield className="w-12 h-12 mx-auto mb-4 text-gray-300" />
									<p>No permissions assigned</p>
									<p className="text-sm">Contact your administrator for access</p>
								</div>
							)}
						</CardContent>
					</Card>

				</TabsContent>

				<TabsContent value="activity" className="space-y-6">
					<Card>
						<CardHeader>
							<CardTitle>Recent Activity</CardTitle>
							<CardDescription>
								Your recent actions in the system
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="space-y-4">
								{activityLog.length > 0 ? (
									activityLog.map((activity) => (
										<div
											key={activity.id}
											className="flex items-start gap-4 p-3 border rounded-lg"
										>
											<div className="text-2xl">
												{getActivityIcon(activity.type)}
											</div>
											<div className="flex-1">
												<p className="font-medium text-gray-900">
													{activity.action}
												</p>
												<p className="text-sm text-gray-600">
													{activity.service}
												</p>
												<p className="text-xs text-gray-500 mt-1">
													{mounted
														? new Date(activity.timestamp).toLocaleString()
														: activity.timestamp}
												</p>
											</div>
										</div>
									))
								) : (
									<div className="text-center py-8 text-gray-500">
										<p>No recent activity to display</p>
									</div>
								)}
							</div>
						</CardContent>
					</Card>
				</TabsContent>
			</Tabs>
		</div>
	);
}

"use client";

import { useState, useEffect } from "react";
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
import { User, Mail, Phone, Shield, Key, Bell, Save } from "lucide-react";

export default function ProfilePage() {
	const [activeTab, setActiveTab] = useState("profile");
	const [mounted, setMounted] = useState(false);

	const profileData = {
		name: "Maria Santos",
		email: "maria.santos@omsc.edu.ph",
		phone: "+63 912 345 6789",
		position: "Office Administrator",
		department: "Registrar Office",
		employeeId: "EMP-2024-001",
		dateJoined: "2023-06-15",
		address: "Mamburao, Occidental Mindoro",
		bio: "Experienced office administrator with over 5 years in student services and queue management systems.",
		permissions: [
			"Manage Staff",
			"View Reports",
			"Manage Services",
			"Handle Feedback",
			"Create Announcements",
		],
	};

	const activityLog = [
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
	];

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
								MS
							</AvatarFallback>
						</Avatar>
						<div className="flex-1 space-y-2">
							<div className="flex items-center gap-3">
								<h2 className="text-xl font-semibold text-gray-900">
									{profileData.name}
								</h2>
								<Badge className="bg-[#088395] text-white">
									{profileData.position}
								</Badge>
							</div>
							<p className="text-gray-600">{profileData.department}</p>
							<div className="flex items-center gap-4 text-sm text-gray-500">
								<div className="flex items-center gap-1">
									<Mail className="w-4 h-4" />
									{profileData.email}
								</div>
								<div className="flex items-center gap-1">
									<Phone className="w-4 h-4" />
									{profileData.phone}
								</div>
							</div>
						</div>
						<Button className="gradient-primary">
							<User className="w-4 h-4 mr-2" />
							Edit Profile
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
								<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
									<div className="space-y-2">
										<Label htmlFor="firstName">First Name</Label>
										<Input id="firstName" defaultValue="Maria" />
									</div>
									<div className="space-y-2">
										<Label htmlFor="lastName">Last Name</Label>
										<Input id="lastName" defaultValue="Santos" />
									</div>
								</div>

								<div className="space-y-2">
									<Label htmlFor="email">Email Address</Label>
									<Input
										id="email"
										type="email"
										defaultValue={profileData.email}
									/>
								</div>

								<div className="space-y-2">
									<Label htmlFor="phone">Phone Number</Label>
									<Input id="phone" defaultValue={profileData.phone} />
								</div>

								<div className="space-y-2">
									<Label htmlFor="address">Address</Label>
									<Input id="address" defaultValue={profileData.address} />
								</div>

								<div className="space-y-2">
									<Label htmlFor="bio">Bio</Label>
									<Textarea
										id="bio"
										defaultValue={profileData.bio}
										className="min-h-20"
									/>
								</div>

								<Button className="gradient-primary">
									<Save className="w-4 h-4 mr-2" />
									Save Changes
								</Button>
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
										defaultValue={profileData.employeeId}
										disabled
									/>
								</div>

								<div className="space-y-2">
									<Label htmlFor="position">Position</Label>
									<Input
										id="position"
										defaultValue={profileData.position}
										disabled
									/>
								</div>

								<div className="space-y-2">
									<Label htmlFor="department">Department</Label>
									<Select defaultValue="registrar">
										<SelectTrigger>
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="registrar">
												Registrar Office
											</SelectItem>
											<SelectItem value="cashier">Cashier Office</SelectItem>
											<SelectItem value="library">Library</SelectItem>
											<SelectItem value="guidance">Guidance Office</SelectItem>
										</SelectContent>
									</Select>
								</div>

								<div className="space-y-2">
									<Label htmlFor="dateJoined">Date Joined</Label>
									<Input
										id="dateJoined"
										defaultValue={
											mounted
												? new Date(profileData.dateJoined).toLocaleDateString()
												: profileData.dateJoined
										}
										disabled
									/>
								</div>

								<div className="space-y-2">
									<Label>Work Schedule</Label>
									<div className="grid grid-cols-2 gap-2">
										<Input defaultValue="8:00 AM" placeholder="Start Time" />
										<Input defaultValue="5:00 PM" placeholder="End Time" />
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
								<Input id="currentPassword" type="password" />
							</div>

							<div className="space-y-2">
								<Label htmlFor="newPassword">New Password</Label>
								<Input id="newPassword" type="password" />
							</div>

							<div className="space-y-2">
								<Label htmlFor="confirmPassword">Confirm New Password</Label>
								<Input id="confirmPassword" type="password" />
							</div>

							<Button className="gradient-primary">
								<Key className="w-4 h-4 mr-2" />
								Update Password
							</Button>
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value="permissions" className="space-y-6">
					<Card>
						<CardHeader>
							<CardTitle>Access Permissions</CardTitle>
							<CardDescription>Your current system permissions</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
								{profileData.permissions.map((permission, index) => (
									<div
										key={index}
										className="flex items-center gap-3 p-3 border rounded-lg"
									>
										<Shield className="w-5 h-5 text-[#088395]" />
										<span className="font-medium">{permission}</span>
									</div>
								))}
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle>Notification Preferences</CardTitle>
							<CardDescription>
								Choose what notifications you want to receive
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="flex items-center justify-between p-3 border rounded-lg">
								<div className="flex items-center gap-3">
									<Bell className="w-5 h-5 text-gray-500" />
									<div>
										<p className="font-medium">Queue Updates</p>
										<p className="text-sm text-gray-600">
											Notifications about queue status
										</p>
									</div>
								</div>
								<input type="checkbox" defaultChecked className="rounded" />
							</div>

							<div className="flex items-center justify-between p-3 border rounded-lg">
								<div className="flex items-center gap-3">
									<Bell className="w-5 h-5 text-gray-500" />
									<div>
										<p className="font-medium">Staff Updates</p>
										<p className="text-sm text-gray-600">
											Notifications about staff changes
										</p>
									</div>
								</div>
								<input type="checkbox" defaultChecked className="rounded" />
							</div>

							<div className="flex items-center justify-between p-3 border rounded-lg">
								<div className="flex items-center gap-3">
									<Bell className="w-5 h-5 text-gray-500" />
									<div>
										<p className="font-medium">System Alerts</p>
										<p className="text-sm text-gray-600">
											Important system notifications
										</p>
									</div>
								</div>
								<input type="checkbox" defaultChecked className="rounded" />
							</div>
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
								{activityLog.map((activity) => (
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
								))}
							</div>
						</CardContent>
					</Card>
				</TabsContent>
			</Tabs>
		</div>
	);
}

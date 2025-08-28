"use client";

import { useState } from "react";
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
import { Switch } from "@/components/ui/switch";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Save, RefreshCw, SettingsIcon, Users, Shield } from "lucide-react";

export default function SettingsPage() {
	const [settings, setSettings] = useState({
		// General Settings
		systemName: "E-QUEUE - OMSC Mamburao",
		systemDescription:
			"Queue Management System for Occidental Mindoro State College",
		maintenanceMode: false,
		allowRegistration: true,

		// Queue Settings
		maxQueueSize: 100,
		autoAdvanceQueue: true,
		voiceNotifications: true,
		notificationLanguage: "english",

		// Security Settings
		sessionTimeout: 30,
		passwordMinLength: 8,
		requireEmailVerification: true,
		maxLoginAttempts: 5,
	});

	const handleSettingChange = (key: string, value: any) => {
		setSettings((prev) => ({ ...prev, [key]: value }));
	};

	const handleSave = () => {
		// Save settings logic here
		console.log("Saving settings:", settings);
	};

	const handleReset = () => {
		// Reset to defaults logic here
		console.log("Resetting to defaults");
	};

	return (
		<div className="space-y-8">
			{/* Page Header */}
			<div className="border-b border-gray-200 pb-6">
				<h1 className="text-3xl font-bold text-gray-900">System Settings</h1>
				<p className="mt-2 text-gray-600">
					Configure essential system settings and preferences
				</p>
			</div>

			<div className="space-y-6">
				{/* Header */}
				<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
					<div className="flex gap-3">
						<Button variant="outline" onClick={handleReset}>
							<RefreshCw className="w-4 h-4 mr-2" />
							Reset to Defaults
						</Button>
						<Button
							onClick={handleSave}
							className="bg-primary hover:bg-primary/90"
						>
							<Save className="w-4 h-4 mr-2" />
							Save Changes
						</Button>
					</div>
				</div>

				<div className="space-y-6">
					{/* General Settings */}
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center">
								<SettingsIcon className="w-5 h-5 mr-2" />
								General Settings
							</CardTitle>
							<CardDescription>
								Basic system configuration and information
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-6">
							<div className="space-y-2">
								<Label htmlFor="systemName">System Name</Label>
								<Input
									id="systemName"
									value={settings.systemName}
									onChange={(e) =>
										handleSettingChange("systemName", e.target.value)
									}
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="systemDescription">System Description</Label>
								<Textarea
									id="systemDescription"
									value={settings.systemDescription}
									onChange={(e) =>
										handleSettingChange("systemDescription", e.target.value)
									}
									rows={3}
								/>
							</div>

							<div className="space-y-3">
								<div className="flex items-center justify-between">
									<div className="space-y-0.5">
										<Label>Maintenance Mode</Label>
										<p className="text-sm text-gray-600">
											Temporarily disable public access
										</p>
									</div>
									<Switch
										checked={settings.maintenanceMode}
										onCheckedChange={(checked) =>
											handleSettingChange("maintenanceMode", checked)
										}
									/>
								</div>
							</div>

							<div className="flex items-center justify-between">
								<div className="space-y-0.5">
									<Label>Allow New Registrations</Label>
									<p className="text-sm text-gray-600">
										Enable new user account creation
									</p>
								</div>
								<Switch
									checked={settings.allowRegistration}
									onCheckedChange={(checked) =>
										handleSettingChange("allowRegistration", checked)
									}
								/>
							</div>
						</CardContent>
					</Card>

					{/* Queue Settings */}
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center">
								<Users className="w-5 h-5 mr-2" />
								Queue Management Settings
							</CardTitle>
							<CardDescription>
								Configure queue behavior and notifications
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-6">
							<div className="space-y-2">
								<Label htmlFor="maxQueueSize">Maximum Queue Size</Label>
								<Input
									id="maxQueueSize"
									type="number"
									value={settings.maxQueueSize}
									onChange={(e) =>
										handleSettingChange(
											"maxQueueSize",
											Number.parseInt(e.target.value)
										)
									}
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="notificationLanguage">
									Voice Notification Language
								</Label>
								<Select
									value={settings.notificationLanguage}
									onValueChange={(value) =>
										handleSettingChange("notificationLanguage", value)
									}
								>
									<SelectTrigger>
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="english">English</SelectItem>
										<SelectItem value="tagalog">Tagalog</SelectItem>
										<SelectItem value="both">Both Languages</SelectItem>
									</SelectContent>
								</Select>
							</div>

							<div className="flex items-center justify-between">
								<div className="space-y-0.5">
									<Label>Auto-Advance Queue</Label>
									<p className="text-sm text-gray-600">
										Automatically move to next customer after completion
									</p>
								</div>
								<Switch
									checked={settings.autoAdvanceQueue}
									onCheckedChange={(checked) =>
										handleSettingChange("autoAdvanceQueue", checked)
									}
								/>
							</div>

							<div className="flex items-center justify-between">
								<div className="space-y-0.5">
									<Label>Voice Notifications</Label>
									<p className="text-sm text-gray-600">
										Enable voice announcements for queue updates
									</p>
								</div>
								<Switch
									checked={settings.voiceNotifications}
									onCheckedChange={(checked) =>
										handleSettingChange("voiceNotifications", checked)
									}
								/>
							</div>
						</CardContent>
					</Card>

					{/* Security Settings */}
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center">
								<Shield className="w-5 h-5 mr-2" />
								Security Settings
							</CardTitle>
							<CardDescription>
								Configure authentication and security policies
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-6">
							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								<div className="space-y-2">
									<Label htmlFor="sessionTimeout">
										Session Timeout (minutes)
									</Label>
									<Input
										id="sessionTimeout"
										type="number"
										value={settings.sessionTimeout}
										onChange={(e) =>
											handleSettingChange(
												"sessionTimeout",
												Number.parseInt(e.target.value)
											)
										}
									/>
								</div>
								<div className="space-y-2">
									<Label htmlFor="passwordMinLength">
										Minimum Password Length
									</Label>
									<Input
										id="passwordMinLength"
										type="number"
										value={settings.passwordMinLength}
										onChange={(e) =>
											handleSettingChange(
												"passwordMinLength",
												Number.parseInt(e.target.value)
											)
										}
									/>
								</div>
							</div>

							<div className="space-y-2">
								<Label htmlFor="maxLoginAttempts">Maximum Login Attempts</Label>
								<Input
									id="maxLoginAttempts"
									type="number"
									value={settings.maxLoginAttempts}
									onChange={(e) =>
										handleSettingChange(
											"maxLoginAttempts",
											Number.parseInt(e.target.value)
										)
									}
									className="w-full md:w-1/2"
								/>
							</div>

							<div className="flex items-center justify-between">
								<div className="space-y-0.5">
									<Label>Require Email Verification</Label>
									<p className="text-sm text-gray-600">
										Users must verify email before account activation
									</p>
								</div>
								<Switch
									checked={settings.requireEmailVerification}
									onCheckedChange={(checked) =>
										handleSettingChange("requireEmailVerification", checked)
									}
								/>
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}

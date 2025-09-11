"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
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
import { Save, RefreshCw, SettingsIcon, Users } from "lucide-react";

const SettingsSchema = z.object({
	systemName: z.string().min(1, "Required"),
	systemDescription: z.string().min(1, "Required"),
	maintenanceMode: z.boolean(),
	allowRegistration: z.boolean(),
	maxQueueSize: z.number().min(1).max(10000),
	voiceNotifications: z.boolean(),
	notificationLanguage: z.enum(["english", "tagalog", "both"]),
});

type SettingsForm = z.infer<typeof SettingsSchema>;

export default function SettingsPage() {
	const { toast } = useToast();
	const [loading, setLoading] = useState(true);
	const form = useForm<SettingsForm>({
		resolver: zodResolver(SettingsSchema),
		defaultValues: {
			systemName: "",
			systemDescription: "",
			maintenanceMode: false,
			allowRegistration: true,
			maxQueueSize: 100,
			voiceNotifications: true,
			notificationLanguage: "english",
		},
	});

	useEffect(() => {
		let isMounted = true;
		(async () => {
			try {
				const res = await fetch("/api/admin/settings", { cache: "no-store" });
				const json = await res.json();
				if (isMounted && json?.success && json.data) {
					form.reset({
						systemName: json.data.systemName,
						systemDescription: json.data.systemDescription,
						maintenanceMode: json.data.maintenanceMode,
						allowRegistration: json.data.allowRegistration,
						maxQueueSize: json.data.maxQueueSize,
						voiceNotifications: json.data.voiceNotifications,
						notificationLanguage: json.data.notificationLanguage,
					});
				}
			} catch (e) {
				console.error(e);
			} finally {
				if (isMounted) setLoading(false);
			}
		})();
		return () => {
			isMounted = false;
		};
	}, [form]);

	const onSubmit = async (values: SettingsForm) => {
		try {
			const res = await fetch("/api/admin/settings", {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(values),
			});
			const json = await res.json();
			if (json?.success) {
				toast({ title: "Settings saved", description: "Your changes have been saved." });
			} else {
				toast({ title: "Save failed", description: json?.message ?? "Please try again.", variant: "destructive" });
			}
		} catch (e) {
			toast({ title: "Save failed", description: "Network error.", variant: "destructive" });
		}
	};

	const onReset = async () => {
		try {
			const res = await fetch("/api/admin/settings", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ action: "reset" }),
			});
			const json = await res.json();
			if (json?.success && json.data) {
				form.reset({
					systemName: json.data.systemName,
					systemDescription: json.data.systemDescription,
					maintenanceMode: json.data.maintenanceMode,
					allowRegistration: json.data.allowRegistration,
					maxQueueSize: json.data.maxQueueSize,
					voiceNotifications: json.data.voiceNotifications,
					notificationLanguage: json.data.notificationLanguage,
				});
				toast({ title: "Settings reset", description: "Defaults restored." });
			} else {
				toast({ title: "Reset failed", description: json?.message ?? "Please try again.", variant: "destructive" });
			}
		} catch (e) {
			toast({ title: "Reset failed", description: "Network error.", variant: "destructive" });
		}
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
						<Button variant="outline" onClick={onReset} disabled={loading}>
							<RefreshCw className="w-4 h-4 mr-2" />
							Reset to Defaults
						</Button>
						<Button onClick={form.handleSubmit(onSubmit)} disabled={loading || form.formState.isSubmitting} className="bg-primary hover:bg-primary/90">
							{form.formState.isSubmitting ? (
								<>
									<RefreshCw className="w-4 h-4 mr-2 animate-spin" />
									Saving...
								</>
							) : (
								<>
									<Save className="w-4 h-4 mr-2" />
									Save Changes
								</>
							)}
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
									{...form.register("systemName")}
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="systemDescription">System Description</Label>
								<Textarea
									id="systemDescription"
									rows={3}
									{...form.register("systemDescription")}
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
										checked={form.watch("maintenanceMode")}
										onCheckedChange={(v) => form.setValue("maintenanceMode", v)}
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
									checked={form.watch("allowRegistration")}
									onCheckedChange={(v) => form.setValue("allowRegistration", v)}
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
									value={form.watch("maxQueueSize")}
									onChange={(e) => form.setValue("maxQueueSize", Number.parseInt(e.target.value || "0"))}
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="notificationLanguage">
									Voice Notification Language
								</Label>
								<Select
									value={form.watch("notificationLanguage")}
									onValueChange={(value) => form.setValue("notificationLanguage", value as any)}
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
									<Label>Voice Notifications</Label>
									<p className="text-sm text-gray-600">
										Enable voice announcements for queue updates
									</p>
								</div>
								<Switch
									checked={form.watch("voiceNotifications")}
									onCheckedChange={(v) => form.setValue("voiceNotifications", v)}
								/>
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}

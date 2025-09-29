"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
	LayoutDashboard,
	Users,
	LogOut,
	ChevronLeft,
	ChevronRight,
	Building2,
	ClipboardList,
	MessageSquare,
	Megaphone,
	User,
	BarChart3,
	BookOpen,
	AlertTriangle,
	FileText,
} from "lucide-react";
import { useAuth } from "@/contexts/auth-context";

const navigation = [
	{ name: "Dashboard", href: "/office-admin", icon: LayoutDashboard },
	{ name: "Staff Management", href: "/office-admin/staff", icon: Users },
	{
		name: "Service Management",
		href: "/office-admin/services",
		icon: ClipboardList,
	},
	{ name: "Queue Lanes", href: "/office-admin/queues", icon: BarChart3 },
	{ name: "Logbook", href: "/office-admin/logbook", icon: BookOpen },
	{
		name: "Evaluation Forms",
		href: "/office-admin/evaluation",
		icon: FileText,
	},
	{
		name: "Feedback Forms",
		href: "/office-admin/feedback",
		icon: MessageSquare,
	},
	{
		name: "Announcements",
		href: "/office-admin/announcements",
		icon: Megaphone,
	},
	{ name: "Violations", href: "/office-admin/violations", icon: AlertTriangle },
	{ name: "Profile", href: "/office-admin/profile", icon: User },
];

interface SidebarProps {
	collapsed: boolean;
	onToggle: () => void;
	mobile?: boolean;
}

export function OfficeAdminSidebar({
	collapsed,
	onToggle,
	mobile = false,
}: SidebarProps) {
	const pathname = usePathname();
	const { user, userData, signOut } = useAuth();

	const handleSignOut = async () => {
		await signOut();
	};

	return (
		<div
			className={cn(
				"bg-white border-r border-border flex flex-col transition-all duration-300 relative",
				collapsed ? "w-20" : "w-64",
				mobile ? "h-full" : "fixed left-0 top-0 h-screen z-30"
			)}
		>
			{/* Header */}
			<div className="p-4 border-b border-border">
				<div className="flex items-center justify-between">
					{!collapsed && (
						<div className="flex items-center gap-3">
							<Image
								src="/images/logo.png"
								alt="E-Queue Logo"
								width={32}
								height={32}
								className="rounded-full"
							/>
							<div>
								<h2 className="font-semibold text-[#071952]">Office Admin</h2>
								<p className="text-xs text-gray-500">Registrar Office</p>
							</div>
						</div>
					)}
					{collapsed && (
						<Image
							src="/images/logo.png"
							alt="E-Queue Logo"
							width={32}
							height={32}
							className="rounded-full mx-auto"
						/>
					)}
				</div>
			</div>

			{/* Navigation */}
			<nav className="flex-1 p-4">
				<ul className="space-y-2">
					{navigation.map((item) => {
						const isActive = pathname === item.href;
						return (
							<li key={item.name}>
								<Link
									href={item.href}
									className={cn(
										"flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
										collapsed && "justify-center px-2",
										isActive
											? "bg-[#071952] text-white"
											: "text-gray-600 hover:text-[#071952] hover:bg-gray-100"
									)}
								>
									<item.icon className="w-5 h-5 flex-shrink-0" />
									{!collapsed && <span>{item.name}</span>}
								</Link>
							</li>
						);
					})}
				</ul>
			</nav>

			{/* User Info & Logout */}
			<div className="p-4 border-t border-gray-200">
				{!collapsed && (
					<div className="flex items-center gap-3 mb-3">
						<div className="w-8 h-8 bg-[#088395] rounded-full flex items-center justify-center">
							<span className="text-sm font-semibold text-white">
								{userData?.name ? userData.name.charAt(0).toUpperCase() : "U"}
							</span>
						</div>
						<div className="flex-1 min-w-0">
							<p className="text-sm font-medium text-gray-900 truncate">
								{userData?.name || "User"}
							</p>
							<p className="text-xs text-gray-500 truncate">
								{userData?.email || user?.email || "No email"}
							</p>
						</div>
					</div>
				)}
				{collapsed && (
					<div className="flex items-center justify-center mb-3">
						<div className="w-8 h-8 bg-[#088395] rounded-full flex items-center justify-center">
							<span className="text-sm font-semibold text-white">
								{userData?.name ? userData.name.charAt(0).toUpperCase() : "U"}
							</span>
						</div>
					</div>
				)}
				<Button
					variant="ghost"
					size="sm"
					onClick={handleSignOut}
					className={cn(
						"w-full justify-start text-gray-600 hover:text-[#071952] hover:bg-gray-100",
						collapsed && "justify-center px-2"
					)}
				>
					<LogOut className="w-4 h-4" />
					{!collapsed && <span className="ml-2">Logout</span>}
				</Button>
			</div>

			{/* Toggle Button - only show on desktop, not mobile */}
			{!mobile && (
				<Button
					variant="ghost"
					size="sm"
					onClick={onToggle}
					className="absolute -right-3 top-20 w-6 h-6 rounded-full border bg-white shadow-md hover:bg-gray-100 z-10"
				>
					{collapsed ? (
						<ChevronRight className="w-3 h-3" />
					) : (
						<ChevronLeft className="w-3 h-3" />
					)}
				</Button>
			)}
		</div>
	);
}

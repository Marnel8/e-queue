"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
	LayoutDashboard,
	Users,
	Building2,
	BarChart3,
	Settings,
	LogOut,
	ChevronLeft,
	ChevronRight,
	Shield,
	AlertTriangle,
} from "lucide-react";
import { useAuth } from "@/contexts/auth-context";

const navigation = [
	{ name: "Dashboard", href: "/admin", icon: LayoutDashboard },
	{ name: "User Management", href: "/admin/users", icon: Users },
	{ name: "Office Management", href: "/admin/offices", icon: Building2 },
	{ name: "Reports & Analytics", href: "/admin/reports", icon: BarChart3 },
							
	{ name: "System Settings", href: "/admin/settings", icon: Settings },
	{ name: "Violations", href: "/admin/violations", icon: AlertTriangle },
];

interface SidebarProps {
	collapsed: boolean;
	onToggle: () => void;
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
	const pathname = usePathname();
	const { user, userData, signOut } = useAuth();

	const handleSignOut = async () => {
		await signOut();
	};

	return (
		<div
			className={cn(
				"bg-white border-r border-border flex flex-col transition-all duration-300 h-full",
				collapsed ? "w-20" : "w-64"
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
								<h2 className="font-semibold text-primary">E-Queue Admin</h2>
								<p className="text-xs text-muted-foreground">
									System Management
								</p>
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
			<nav className="flex-1 p-4 overflow-y-auto">
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
											? "bg-primary text-primary-foreground"
											: "text-muted-foreground hover:text-foreground hover:bg-muted"
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
			<div className="p-4 border-t border-border">
				{!collapsed && (
					<div className="flex items-center gap-3 mb-3">
						<div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
							<span className="text-sm font-semibold text-primary-foreground">
								{userData?.name ? userData.name.charAt(0).toUpperCase() : "U"}
							</span>
						</div>
						<div className="flex-1 min-w-0">
							<p className="text-sm font-medium text-foreground truncate">
								{userData?.name || "User"}
							</p>
							<p className="text-xs text-muted-foreground truncate">
								{userData?.email || user?.email || "No email"}
							</p>
						</div>
					</div>
				)}
				{collapsed && (
					<div className="flex items-center justify-center mb-3">
						<div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
							<span className="text-sm font-semibold text-primary-foreground">
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
						"w-full justify-start text-muted-foreground hover:text-foreground",
						collapsed && "justify-center px-2"
					)}
				>
					<LogOut className="w-4 h-4" />
					{!collapsed && <span className="ml-2">Logout</span>}
				</Button>
			</div>

			<Button
				variant="ghost"
				size="sm"
				onClick={onToggle}
				className="absolute -right-3 top-20 w-6 h-6 rounded-full border bg-white shadow-md hover:bg-muted z-40"
			>
				{collapsed ? (
					<ChevronRight className="w-3 h-3" />
				) : (
					<ChevronLeft className="w-3 h-3" />
				)}
			</Button>
		</div>
	);
}

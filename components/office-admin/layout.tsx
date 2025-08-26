"use client";

import type React from "react";

import { useState } from "react";
import { OfficeAdminSidebar } from "./sidebar";
import { Button } from "@/components/ui/button";
import { Bell, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface OfficeAdminLayoutProps {
	children: React.ReactNode;
	title: string;
	description?: string;
}

export function OfficeAdminLayout({
	children,
	title,
	description,
}: OfficeAdminLayoutProps) {
	const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

	return (
		<div className="min-h-screen bg-background flex">
			<div className="flex-1 flex flex-col">
				{/* Main Content */}
				<main className="flex-1 p-6">{children}</main>
			</div>
		</div>
	);
}

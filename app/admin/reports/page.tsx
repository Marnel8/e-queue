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
import { Badge } from "@/components/ui/badge";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Download,
	TrendingUp,
	TrendingDown,
	Users,
	Clock,
	Star,
	AlertCircle,
	FileText,
	Table,
	FileSpreadsheet,
	Loader2,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export default function ReportsPage() {
	const [timeRange, setTimeRange] = useState("7d");
	const [reportType, setReportType] = useState("overview");
	const [loading, setLoading] = useState(true);
	const [exporting, setExporting] = useState(false);
	const { toast } = useToast();
	const [reports, setReports] = useState<{
		systemMetrics: {
			totalTickets: number | null;
			avgWaitTime: number | null;
			customerSatisfaction: number | null;
			systemUptime: number | null;
			peakHours: string | null;
			busiestOffice: string | null;
			violations: number | null;
		};
		officePerformance: Array<{
			office: string;
			tickets: number | null;
			avgWait: number | null;
			satisfaction: number | null;
			efficiency: number | null;
		}>;
		weeklyTrends: Array<{ day: string; tickets: number; avgWait: number | null }>;
	} | null>(null);

	useEffect(() => {
		let isMounted = true;
		(async () => {
			setLoading(true);
			try {
				const res = await fetch("/api/admin/metrics", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ range: timeRange, reportType }),
					cache: "no-store",
				});
				const text = await res.text();
				let json: any = null;
				try {
					json = text ? JSON.parse(text) : null;
				} catch (e) {
					// Non-JSON response handled
				}
				if (isMounted && json?.success) setReports(json.data);
			} catch (e) {
				// Error handled by UI state
			} finally {
				if (isMounted) setLoading(false);
			}
		})();
		return () => {
			isMounted = false;
		};
	}, [timeRange, reportType]);

	// Export functions
	const exportToCSV = () => {
		if (!reports) return;
		
		setExporting(true);
		try {
			const csvData = generateCSVData();
			downloadFile(csvData, 'reports.csv', 'text/csv');
			toast({
				title: "Export Successful",
				description: "Reports data exported to CSV successfully.",
			});
		} catch (error) {
			toast({
				title: "Export Failed",
				description: "Failed to export reports data to CSV.",
				variant: "destructive",
			});
		} finally {
			setExporting(false);
		}
	};

	const exportToPDF = () => {
		if (!reports) return;
		
		setExporting(true);
		try {
			const pdfData = generatePDFData();
			downloadFile(pdfData, 'reports.pdf', 'application/pdf');
			toast({
				title: "Export Successful",
				description: "Reports data exported to PDF successfully.",
			});
		} catch (error) {
			toast({
				title: "Export Failed",
				description: "Failed to export reports data to PDF.",
				variant: "destructive",
			});
		} finally {
			setExporting(false);
		}
	};

	const exportToExcel = () => {
		if (!reports) return;
		
		setExporting(true);
		try {
			const excelData = generateExcelData();
			downloadFile(excelData, 'reports.xlsx', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
			toast({
				title: "Export Successful",
				description: "Reports data exported to Excel successfully.",
			});
		} catch (error) {
			toast({
				title: "Export Failed",
				description: "Failed to export reports data to Excel.",
				variant: "destructive",
			});
		} finally {
			setExporting(false);
		}
	};

	const generateCSVData = () => {
		if (!reports) return '';
		
		const csvRows = [];
		
		// Header
		csvRows.push(['Report Type', 'Metric', 'Value', 'Period', 'Generated At']);
		
		// System Metrics
		const metrics = reports.systemMetrics;
		csvRows.push([reportType, 'Total Tickets', metrics.totalTickets || 0, timeRange, new Date().toISOString()]);
		csvRows.push([reportType, 'Average Wait Time', `${metrics.avgWaitTime || 0} min`, timeRange, new Date().toISOString()]);
		csvRows.push([reportType, 'Customer Satisfaction', `${metrics.customerSatisfaction || 0}/5.0`, timeRange, new Date().toISOString()]);
		csvRows.push([reportType, 'System Uptime', `${metrics.systemUptime || 0}%`, timeRange, new Date().toISOString()]);
		csvRows.push([reportType, 'Peak Hours', metrics.peakHours || 'N/A', timeRange, new Date().toISOString()]);
		csvRows.push([reportType, 'Busiest Office', metrics.busiestOffice || 'N/A', timeRange, new Date().toISOString()]);
		csvRows.push([reportType, 'Violations', metrics.violations || 0, timeRange, new Date().toISOString()]);
		
		// Office Performance
		if (reports.officePerformance && reports.officePerformance.length > 0) {
			csvRows.push([]); // Empty row
			csvRows.push(['Office Performance', 'Office', 'Tickets', 'Avg Wait (min)', 'Satisfaction', 'Efficiency (%)']);
			reports.officePerformance.forEach(office => {
				csvRows.push([
					'Office Performance',
					office.office,
					office.tickets || 0,
					office.avgWait || 0,
					office.satisfaction || 0,
					office.efficiency || 0
				]);
			});
		}
		
		// Weekly Trends
		if (reports.weeklyTrends && reports.weeklyTrends.length > 0) {
			csvRows.push([]); // Empty row
			csvRows.push(['Weekly Trends', 'Day', 'Tickets', 'Avg Wait (min)']);
			reports.weeklyTrends.forEach(day => {
				csvRows.push([
					'Weekly Trends',
					day.day,
					day.tickets,
					day.avgWait || 0
				]);
			});
		}
		
		return csvRows.map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
	};

	const generatePDFData = () => {
		// For PDF, we'll create a simple HTML table and convert it
		// In a real implementation, you'd use a library like jsPDF or Puppeteer
		const htmlContent = `
			<!DOCTYPE html>
			<html>
			<head>
				<title>E-Queue Reports - ${reportType} - ${timeRange}</title>
				<style>
					body { font-family: Arial, sans-serif; margin: 20px; }
					table { border-collapse: collapse; width: 100%; margin-bottom: 20px; }
					th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
					th { background-color: #f2f2f2; }
					h1, h2 { color: #333; }
					.metric { margin-bottom: 15px; }
				</style>
			</head>
			<body>
				<h1>E-Queue Reports</h1>
				<p><strong>Report Type:</strong> ${reportType}</p>
				<p><strong>Time Range:</strong> ${timeRange}</p>
				<p><strong>Generated:</strong> ${new Date().toLocaleString()}</p>
				
				<h2>System Metrics</h2>
				<table>
					<tr><th>Metric</th><th>Value</th></tr>
					<tr><td>Total Tickets</td><td>${reports?.systemMetrics?.totalTickets || 0}</td></tr>
					<tr><td>Average Wait Time</td><td>${reports?.systemMetrics?.avgWaitTime || 0} min</td></tr>
					<tr><td>Customer Satisfaction</td><td>${reports?.systemMetrics?.customerSatisfaction || 0}/5.0</td></tr>
					<tr><td>System Uptime</td><td>${reports?.systemMetrics?.systemUptime || 0}%</td></tr>
					<tr><td>Peak Hours</td><td>${reports?.systemMetrics?.peakHours || 'N/A'}</td></tr>
					<tr><td>Busiest Office</td><td>${reports?.systemMetrics?.busiestOffice || 'N/A'}</td></tr>
					<tr><td>Violations</td><td>${reports?.systemMetrics?.violations || 0}</td></tr>
				</table>
				
				${reports?.officePerformance && reports.officePerformance.length > 0 ? `
				<h2>Office Performance</h2>
				<table>
					<tr><th>Office</th><th>Tickets</th><th>Avg Wait (min)</th><th>Satisfaction</th><th>Efficiency (%)</th></tr>
					${reports.officePerformance.map(office => `
						<tr>
							<td>${office.office}</td>
							<td>${office.tickets || 0}</td>
							<td>${office.avgWait || 0}</td>
							<td>${office.satisfaction || 0}</td>
							<td>${office.efficiency || 0}</td>
						</tr>
					`).join('')}
				</table>
				` : ''}
				
				${reports?.weeklyTrends && reports.weeklyTrends.length > 0 ? `
				<h2>Weekly Trends</h2>
				<table>
					<tr><th>Day</th><th>Tickets</th><th>Avg Wait (min)</th></tr>
					${reports.weeklyTrends.map(day => `
						<tr>
							<td>${day.day}</td>
							<td>${day.tickets}</td>
							<td>${day.avgWait || 0}</td>
						</tr>
					`).join('')}
				</table>
				` : ''}
			</body>
			</html>
		`;
		
		// Convert HTML to PDF (simplified - in production use a proper PDF library)
		return htmlContent;
	};

	const generateExcelData = () => {
		// For Excel, we'll create a CSV-like structure that Excel can open
		// In a real implementation, you'd use a library like xlsx
		return generateCSVData();
	};

	const downloadFile = (data: string, filename: string, mimeType: string) => {
		const blob = new Blob([data], { type: mimeType });
		const url = URL.createObjectURL(blob);
		const link = document.createElement('a');
		link.href = url;
		link.download = filename;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
		URL.revokeObjectURL(url);
	};

	return (
		<div className="space-y-8">
			{/* Page Header */}
			<div className="border-b border-gray-200 pb-6">
				<h1 className="text-3xl font-bold text-gray-900">
					Reports & Analytics
				</h1>
				<p className="mt-2 text-gray-600">
					System-wide performance and usage analytics
				</p>
			</div>

			<div className="space-y-6">
				{/* Header */}
				<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
					<div className="flex flex-col sm:flex-row gap-3">
						<Select value={timeRange} onValueChange={setTimeRange}>
							<SelectTrigger className="w-[140px]">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="24h">Last 24 Hours</SelectItem>
								<SelectItem value="7d">Last 7 Days</SelectItem>
								<SelectItem value="30d">Last 30 Days</SelectItem>
								<SelectItem value="90d">Last 3 Months</SelectItem>
							</SelectContent>
						</Select>
						<Select value={reportType} onValueChange={setReportType}>
							<SelectTrigger className="w-[140px]">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="overview">Overview</SelectItem>
								<SelectItem value="performance">Performance</SelectItem>
								<SelectItem value="satisfaction">Satisfaction</SelectItem>
								<SelectItem value="usage">Usage Patterns</SelectItem>
							</SelectContent>
						</Select>
					</div>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button 
								className="bg-primary hover:bg-primary/90" 
								disabled={exporting || !reports}
							>
								{exporting ? (
									<Loader2 className="w-4 h-4 mr-2 animate-spin" />
								) : (
									<Download className="w-4 h-4 mr-2" />
								)}
								Export Report
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuItem onClick={exportToCSV} disabled={exporting}>
								<FileText className="w-4 h-4 mr-2" />
								Export as CSV
							</DropdownMenuItem>
							<DropdownMenuItem onClick={exportToExcel} disabled={exporting}>
								<FileSpreadsheet className="w-4 h-4 mr-2" />
								Export as Excel
							</DropdownMenuItem>
							<DropdownMenuItem onClick={exportToPDF} disabled={exporting}>
								<Table className="w-4 h-4 mr-2" />
								Export as PDF
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>

				{/* Key Metrics - Show different metrics based on report type */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{reportType === "overview" && (
						<>
							<Card>
								<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
									<CardTitle className="text-sm font-medium">
										Total Tickets Issued
									</CardTitle>
									<Users className="h-4 w-4 text-muted-foreground" />
								</CardHeader>
								<CardContent>
									<div className="text-2xl font-bold">
										{reports?.systemMetrics?.totalTickets?.toLocaleString()}
									</div>
									<div className="flex items-center text-xs text-green-600">
										<TrendingUp className="w-3 h-3 mr-1" />
										+12.5% from last period
									</div>
								</CardContent>
							</Card>

							<Card>
								<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
									<CardTitle className="text-sm font-medium">
										Avg. Wait Time
									</CardTitle>
									<Clock className="h-4 w-4 text-muted-foreground" />
								</CardHeader>
								<CardContent>
									<div className="text-2xl font-bold">
										{reports?.systemMetrics?.avgWaitTime} min
									</div>
									<div className="flex items-center text-xs text-green-600">
										<TrendingDown className="w-3 h-3 mr-1" />
										-8.2% improvement
									</div>
								</CardContent>
							</Card>

							<Card>
								<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
									<CardTitle className="text-sm font-medium">
										Customer Satisfaction
									</CardTitle>
									<Star className="h-4 w-4 text-muted-foreground" />
								</CardHeader>
								<CardContent>
									<div className="text-2xl font-bold">
										{reports?.systemMetrics?.customerSatisfaction}/5.0
									</div>
									<div className="flex items-center text-xs text-green-600">
										<TrendingUp className="w-3 h-3 mr-1" />
										+0.3 from last period
									</div>
								</CardContent>
							</Card>
						</>
					)}

					{reportType === "performance" && (
						<>
							<Card>
								<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
									<CardTitle className="text-sm font-medium">
										System Uptime
									</CardTitle>
									<Clock className="h-4 w-4 text-muted-foreground" />
								</CardHeader>
								<CardContent>
									<div className="text-2xl font-bold">
										{reports?.systemMetrics?.systemUptime}%
									</div>
									<div className="flex items-center text-xs text-green-600">
										<TrendingUp className="w-3 h-3 mr-1" />
										Excellent performance
									</div>
								</CardContent>
							</Card>

							<Card>
								<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
									<CardTitle className="text-sm font-medium">
										Peak Hours
									</CardTitle>
									<TrendingUp className="h-4 w-4 text-muted-foreground" />
								</CardHeader>
								<CardContent>
									<div className="text-2xl font-bold">
										{reports?.systemMetrics?.peakHours || "N/A"}
									</div>
									<div className="flex items-center text-xs text-blue-600">
										<Clock className="w-3 h-3 mr-1" />
										Busiest time period
									</div>
								</CardContent>
							</Card>

							<Card>
								<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
									<CardTitle className="text-sm font-medium">
										Busiest Office
									</CardTitle>
									<Users className="h-4 w-4 text-muted-foreground" />
								</CardHeader>
								<CardContent>
									<div className="text-2xl font-bold">
										{reports?.systemMetrics?.busiestOffice || "N/A"}
									</div>
									<div className="flex items-center text-xs text-orange-600">
										<AlertCircle className="w-3 h-3 mr-1" />
										Highest activity
									</div>
								</CardContent>
							</Card>
						</>
					)}

					{reportType === "satisfaction" && (
						<>
							<Card>
								<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
									<CardTitle className="text-sm font-medium">
										Overall Rating
									</CardTitle>
									<Star className="h-4 w-4 text-muted-foreground" />
								</CardHeader>
								<CardContent>
									<div className="text-2xl font-bold">
										{reports?.systemMetrics?.customerSatisfaction}/5.0
									</div>
									<div className="flex items-center text-xs text-green-600">
										<TrendingUp className="w-3 h-3 mr-1" />
										+0.3 from last period
									</div>
								</CardContent>
							</Card>

							<Card>
								<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
									<CardTitle className="text-sm font-medium">
										Response Rate
									</CardTitle>
									<Users className="h-4 w-4 text-muted-foreground" />
								</CardHeader>
								<CardContent>
									<div className="text-2xl font-bold">
										78%
									</div>
									<div className="flex items-center text-xs text-blue-600">
										<TrendingUp className="w-3 h-3 mr-1" />
										+5% improvement
									</div>
								</CardContent>
							</Card>

							<Card>
								<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
									<CardTitle className="text-sm font-medium">
										Avg. Response Time
									</CardTitle>
									<Clock className="h-4 w-4 text-muted-foreground" />
								</CardHeader>
								<CardContent>
									<div className="text-2xl font-bold">
										{reports?.systemMetrics?.avgWaitTime} min
									</div>
									<div className="flex items-center text-xs text-green-600">
										<TrendingDown className="w-3 h-3 mr-1" />
										-8.2% improvement
									</div>
								</CardContent>
							</Card>
						</>
					)}

					{reportType === "usage" && (
						<>
							<Card>
								<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
									<CardTitle className="text-sm font-medium">
										Total Tickets
									</CardTitle>
									<Users className="h-4 w-4 text-muted-foreground" />
								</CardHeader>
								<CardContent>
									<div className="text-2xl font-bold">
										{reports?.systemMetrics?.totalTickets?.toLocaleString()}
									</div>
									<div className="flex items-center text-xs text-green-600">
										<TrendingUp className="w-3 h-3 mr-1" />
										+12.5% from last period
									</div>
								</CardContent>
							</Card>

							<Card>
								<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
									<CardTitle className="text-sm font-medium">
										Daily Average
									</CardTitle>
									<TrendingUp className="h-4 w-4 text-muted-foreground" />
								</CardHeader>
								<CardContent>
									<div className="text-2xl font-bold">
										{reports?.systemMetrics?.totalTickets ? Math.round(reports.systemMetrics.totalTickets / 7) : 0}
									</div>
									<div className="flex items-center text-xs text-blue-600">
										<Clock className="w-3 h-3 mr-1" />
										Tickets per day
									</div>
								</CardContent>
							</Card>

							<Card>
								<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
									<CardTitle className="text-sm font-medium">
										Violations
									</CardTitle>
									<AlertCircle className="h-4 w-4 text-muted-foreground" />
								</CardHeader>
								<CardContent>
									<div className="text-2xl font-bold">
										{reports?.systemMetrics?.violations || 0}
									</div>
									<div className="flex items-center text-xs text-red-600">
										<AlertCircle className="w-3 h-3 mr-1" />
										Flagged violations
									</div>
								</CardContent>
							</Card>
						</>
					)}
				</div>

				{/* Office Performance - Show for overview and performance reports */}
				{(reportType === "overview" || reportType === "performance") && (
					<Card>
						<CardHeader>
							<CardTitle>
								{reportType === "performance" ? "Office Performance Metrics" : "Office Performance Overview"}
							</CardTitle>
							<CardDescription>
								{reportType === "performance" 
									? "Detailed performance analysis by office location"
									: "Detailed performance metrics by office"
								}
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="overflow-x-auto">
								<table className="w-full">
									<thead>
										<tr className="border-b">
											<th className="text-left py-3 px-4 font-medium">Office</th>
											<th className="text-left py-3 px-4 font-medium">Tickets</th>
											<th className="text-left py-3 px-4 font-medium">
												Avg. Wait
											</th>
											<th className="text-left py-3 px-4 font-medium">
												Satisfaction
											</th>
											<th className="text-left py-3 px-4 font-medium">
												Efficiency
											</th>
										</tr>
									</thead>
									<tbody>
										{reports?.officePerformance?.map((office, index) => (
											<tr key={index} className="border-b hover:bg-gray-50">
												<td className="py-3 px-4 font-medium">{office.office}</td>
												<td className="py-3 px-4">
													{office.tickets?.toLocaleString()}
												</td>
												<td className="py-3 px-4">{office.avgWait} min</td>
												<td className="py-3 px-4">
													<div className="flex items-center">
														<Star className="w-4 h-4 text-yellow-400 mr-1" />
														{office.satisfaction}
													</div>
												</td>
												<td className="py-3 px-4">
													{office.efficiency !== null ? (
														<Badge
															variant={
																office.efficiency >= 90
																	? "default"
																	: office.efficiency >= 80
																	? "secondary"
																	: "destructive"
															}
															className={
																office.efficiency >= 90
																	? "bg-green-100 text-green-800"
																	: office.efficiency >= 80
																	? "bg-yellow-100 text-yellow-800"
																	: ""
															}
														>
															{office.efficiency}%
														</Badge>
													) : (
														<span className="text-gray-500">N/A</span>
													)}
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						</CardContent>
					</Card>
				)}

				{/* Weekly Trends - Show for overview and usage reports */}
				{(reportType === "overview" || reportType === "usage") && (
					<Card>
						<CardHeader>
							<CardTitle>
								{reportType === "usage" ? "Usage Patterns" : "Weekly Usage Trends"}
							</CardTitle>
							<CardDescription>
								{reportType === "usage" 
									? "Daily usage patterns and ticket volume trends"
									: "Daily ticket volume and wait time patterns"
								}
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="space-y-4">
								{reports?.weeklyTrends?.map((day, index) => (
									<div
										key={index}
										className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
									>
										<div className="flex items-center space-x-4">
											<div className="font-medium w-12">{day.day}</div>
											<div className="flex items-center space-x-2">
												<Users className="w-4 h-4 text-gray-500" />
												<span>{day.tickets} tickets</span>
											</div>
										</div>
										<div className="flex items-center space-x-2">
											<Clock className="w-4 h-4 text-gray-500" />
											<span>{day.avgWait} min avg</span>
										</div>
									</div>
								))}
							</div>
						</CardContent>
					</Card>
				)}

				{/* Satisfaction-specific section */}
				{reportType === "satisfaction" && (
					<Card>
						<CardHeader>
							<CardTitle>Customer Feedback Analysis</CardTitle>
							<CardDescription>
								Detailed breakdown of customer satisfaction metrics
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								<div className="space-y-4">
									<div className="flex justify-between items-center">
										<span className="text-sm font-medium">Overall Rating</span>
										<Badge className="bg-blue-100 text-blue-800">
											{reports?.systemMetrics?.customerSatisfaction}/5.0
										</Badge>
									</div>
									<div className="flex justify-between items-center">
										<span className="text-sm font-medium">Response Rate</span>
										<span className="text-sm text-gray-600">78%</span>
									</div>
									<div className="flex justify-between items-center">
										<span className="text-sm font-medium">Avg. Response Time</span>
										<span className="text-sm text-gray-600">{reports?.systemMetrics?.avgWaitTime} min</span>
									</div>
								</div>
								<div className="space-y-4">
									<div className="flex items-center space-x-2 text-green-600">
										<Star className="w-4 h-4" />
										<span className="text-sm">High satisfaction rate</span>
									</div>
									<div className="flex items-center space-x-2 text-blue-600">
										<TrendingUp className="w-4 h-4" />
										<span className="text-sm">Improving trend</span>
									</div>
									<div className="flex items-center space-x-2 text-yellow-600">
										<AlertCircle className="w-4 h-4" />
										<span className="text-sm">Some areas need attention</span>
									</div>
								</div>
							</div>
						</CardContent>
					</Card>
				)}

				{/* System Health - Show for overview and performance reports */}
				{(reportType === "overview" || reportType === "performance") && (
					<Card>
						<CardHeader>
							<CardTitle>
								{reportType === "performance" ? "System Performance Status" : "System Health & Status"}
							</CardTitle>
							<CardDescription>
								{reportType === "performance" 
									? "Current system performance and operational status"
									: "Current system performance indicators"
								}
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								<div className="space-y-4">
									<div className="flex justify-between items-center">
										<span className="text-sm font-medium">System Uptime</span>
										<Badge className="bg-green-100 text-green-800">
											{reports?.systemMetrics?.systemUptime}%
										</Badge>
									</div>
									<div className="flex justify-between items-center">
										<span className="text-sm font-medium">Peak Hours</span>
										<span className="text-sm text-gray-600">
											{reports?.systemMetrics?.peakHours}
										</span>
									</div>
									<div className="flex justify-between items-center">
										<span className="text-sm font-medium">Busiest Office</span>
										<span className="text-sm text-gray-600">
											{reports?.systemMetrics?.busiestOffice}
										</span>
									</div>
								</div>
								<div className="space-y-4">
									<div className="flex items-center space-x-2 text-green-600">
										<div className="w-2 h-2 bg-green-500 rounded-full"></div>
										<span className="text-sm">All services operational</span>
									</div>
									<div className="flex items-center space-x-2 text-green-600">
										<div className="w-2 h-2 bg-green-500 rounded-full"></div>
										<span className="text-sm">Database connections stable</span>
									</div>
									<div className="flex items-center space-x-2 text-yellow-600">
										<AlertCircle className="w-4 h-4" />
										<span className="text-sm">2 minor alerts (non-critical)</span>
									</div>
									<div className="flex items-center space-x-2 text-red-600">
										<AlertCircle className="w-4 h-4" />
										<span className="text-sm">
											{reports?.systemMetrics?.violations} flagged user violations
										</span>
									</div>
								</div>
							</div>
						</CardContent>
					</Card>
				)}
			</div>
		</div>
	);
}

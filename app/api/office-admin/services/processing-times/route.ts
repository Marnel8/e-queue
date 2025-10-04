import { NextRequest, NextResponse } from "next/server";
import { getProcessingTimeStats, getProcessingTimesByOffice } from "@/app/actions/tickets";

export async function GET(request: NextRequest) {
	try {
		const { searchParams } = new URL(request.url);
		const office = searchParams.get('office');

		if (!office) {
			return NextResponse.json(
				{ success: false, message: "Office parameter is required" },
				{ status: 400 }
			);
		}

		// Get processing time statistics
		const statsResult = await getProcessingTimeStats(office);
		
		if (!statsResult.success || !statsResult.stats) {
			return NextResponse.json({
				success: true,
				processingTimes: [],
				overallStats: {
					office,
					averageProcessingTimeMinutes: 0,
					totalCompletions: 0,
					lastUpdated: new Date().toISOString()
				}
			});
		}

		// Get detailed processing times
		const processingTimesResult = await getProcessingTimesByOffice(office);
		
		if (!processingTimesResult.success || !processingTimesResult.processingTimes) {
			return NextResponse.json({
				success: true,
				processingTimes: [],
				overallStats: statsResult.stats
			});
		}

		// Group processing times by service
		const serviceGroups = processingTimesResult.processingTimes.reduce((groups, pt) => {
			if (!groups[pt.service]) {
				groups[pt.service] = [];
			}
			groups[pt.service].push(pt);
			return groups;
		}, {} as Record<string, any[]>);

		// Format processing times for each service
		const processingTimes = Object.entries(serviceGroups).map(([service, times]) => {
			const avgTime = times.reduce((sum, pt) => sum + pt.processingTimeMinutes, 0) / times.length;
			const recentCompletions = times.slice(0, 5).map(pt => ({
				ticketNumber: pt.ticketNumber,
				processingTimeMinutes: pt.processingTimeMinutes,
				completedAt: pt.processingEndTime
			}));

			return {
				serviceId: service.toLowerCase().replace(/\s+/g, '-'),
				serviceName: service,
				office,
				avgProcessingTimeMinutes: Math.round(avgTime * 10) / 10,
				totalCompletions: times.length,
				lastUpdated: new Date().toISOString(),
				recentCompletions
			};
		});

		return NextResponse.json({
			success: true,
			processingTimes,
			overallStats: statsResult.stats
		});

	} catch (error: any) {
		console.error("Error fetching processing times:", error);
		return NextResponse.json(
			{ success: false, message: "Failed to fetch processing times" },
			{ status: 500 }
		);
	}
}

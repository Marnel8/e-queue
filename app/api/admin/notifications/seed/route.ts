import { NextRequest, NextResponse } from "next/server"
import { createSystemNotification, createUserNotification, createOfficeNotification } from "@/app/actions/notifications"

export async function POST(request: NextRequest) {
  try {
    // Create sample notifications
    const sampleNotifications = [
      {
        title: "New User Registration",
        message: "Maria Santos has registered as a new customer",
        type: "info" as const,
        priority: "medium" as const
      },
      {
        title: "System Maintenance Scheduled",
        message: "Scheduled maintenance will occur on Sunday 2:00 AM - 4:00 AM",
        type: "warning" as const,
        priority: "high" as const
      },
      {
        title: "Security Alert",
        message: "Multiple failed login attempts detected for user juan.delacruz@student.omsc.edu.ph",
        type: "error" as const,
        priority: "urgent" as const
      },
      {
        title: "Office Performance Report",
        message: "Monthly performance report for Main Office is now available",
        type: "success" as const,
        priority: "low" as const
      },
      {
        title: "Queue Status Update",
        message: "Queue wait times have decreased by 15% this week",
        type: "success" as const,
        priority: "medium" as const
      },
      {
        title: "Database Backup Complete",
        message: "Daily database backup completed successfully",
        type: "info" as const,
        priority: "low" as const
      },
      {
        title: "New Violation Reported",
        message: "User Pedro Garcia has been flagged for repetitive ticket cancellations",
        type: "warning" as const,
        priority: "high" as const
      },
      {
        title: "System Update Available",
        message: "Version 2.1.0 is now available with new features and bug fixes",
        type: "info" as const,
        priority: "medium" as const
      }
    ]

    const results = []
    for (const notification of sampleNotifications) {
      const result = await createSystemNotification(
        notification.title,
        notification.message,
        notification.type,
        notification.priority
      )
      results.push(result)
    }

    return NextResponse.json({
      success: true,
      message: `Created ${results.length} sample notifications`,
      results
    })

  } catch (error) {
    console.error("Error seeding notifications:", error)
    return NextResponse.json(
      { success: false, error: "Failed to seed notifications" },
      { status: 500 }
    )
  }
}

import { NextRequest, NextResponse } from "next/server";
import { createTicket } from "@/app/actions/tickets";

export async function POST(request: NextRequest) {
  try {
    const { count = 5, office = "Registrar Office" } = await request.json();

    const services = [
      "Transcript Request",
      "Certificate Issuance", 
      "Enrollment",
      "Grade Verification",
      "Student ID"
    ];

    const priorities = ["regular", "priority", "vip"];
    const customerNames = [
      "Juan Dela Cruz",
      "Maria Santos", 
      "Pedro Garcia",
      "Ana Rodriguez",
      "Carlos Mendoza",
      "Elena Santos",
      "Miguel Torres",
      "Sofia Lopez"
    ];

    const createdTickets = [];

    for (let i = 0; i < count; i++) {
      const service = services[Math.floor(Math.random() * services.length)];
      const priority = priorities[Math.floor(Math.random() * priorities.length)];
      const customerName = customerNames[Math.floor(Math.random() * customerNames.length)];
      const ticketNumber = `${office.substring(0, 3).toUpperCase()}${String(i + 1).padStart(3, '0')}`;

      const result = await createTicket({
        ticketNumber,
        customerName,
        customerEmail: `${customerName.toLowerCase().replace(/\s+/g, '.')}@student.omsc.edu.ph`,
        customerPhone: `+63 9${Math.floor(Math.random() * 100000000).toString().padStart(9, '0')}`,
        office,
        service,
        priority: priority as any,
        status: "waiting",
        deskId: Math.floor(Math.random() * 3) + 1,
        deskName: `Desk ${Math.floor(Math.random() * 3) + 1}`,
        customerType: Math.random() > 0.5 ? "appointment" : "walk-in",
        appointmentDate: Math.random() > 0.5 ? new Date().toISOString().split('T')[0] : undefined,
        walkInTime: Math.random() > 0.5 ? new Date().toLocaleTimeString() : undefined,
      });

      if (result.success) {
        createdTickets.push({
          ticketNumber,
          customerName,
          service,
          priority
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: `Created ${createdTickets.length} test tickets`,
      tickets: createdTickets
    });

  } catch (error: any) {
    console.error("Error seeding tickets:", error);
    return NextResponse.json(
      { success: false, message: "Failed to seed tickets" },
      { status: 500 }
    );
  }
}

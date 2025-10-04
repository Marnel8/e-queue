import { NextRequest, NextResponse } from "next/server"
import { db } from "@/firebase/firebase"
import { collection, query, where, getDocs, orderBy, limit } from "firebase/firestore"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const q = searchParams.get("q")
    const type = searchParams.get("type") || "all"
    const limitCount = parseInt(searchParams.get("limit") || "10")

    if (!q || q.length < 2) {
      return NextResponse.json({ success: true, results: [] })
    }

    const searchTerm = q.toLowerCase()
    const results: any[] = []

    // Search users
    if (type === "all" || type === "users") {
      try {
        const usersRef = collection(db, "users")
        const usersQuery = query(
          usersRef,
          where("name", ">=", q),
          where("name", "<=", q + "\uf8ff"),
          limit(limitCount)
        )
        const usersSnapshot = await getDocs(usersQuery)
        
        usersSnapshot.forEach((doc) => {
          const userData = doc.data()
          if (
            userData.name?.toLowerCase().includes(searchTerm) ||
            userData.email?.toLowerCase().includes(searchTerm) ||
            userData.role?.toLowerCase().includes(searchTerm)
          ) {
            results.push({
              id: doc.id,
              type: "user",
              title: userData.name || "Unknown User",
              subtitle: userData.email || "No email",
              description: `${userData.role || "No role"} • ${userData.officeId ? "Assigned to office" : "No office"}`,
              href: "/admin/users",
              icon: "user",
              data: userData
            })
          }
        })
      } catch (error) {
        console.error("Error searching users:", error)
      }
    }

    // Search offices
    if (type === "all" || type === "offices") {
      try {
        const officesRef = collection(db, "offices")
        const officesQuery = query(
          officesRef,
          where("name", ">=", q),
          where("name", "<=", q + "\uf8ff"),
          limit(limitCount)
        )
        const officesSnapshot = await getDocs(officesQuery)
        
        officesSnapshot.forEach((doc) => {
          const officeData = doc.data()
          if (
            officeData.name?.toLowerCase().includes(searchTerm) ||
            officeData.location?.toLowerCase().includes(searchTerm) ||
            officeData.description?.toLowerCase().includes(searchTerm)
          ) {
            results.push({
              id: doc.id,
              type: "office",
              title: officeData.name || "Unknown Office",
              subtitle: officeData.location || "No location",
              description: officeData.description || "No description",
              href: "/admin/offices",
              icon: "building",
              data: officeData
            })
          }
        })
      } catch (error) {
        console.error("Error searching offices:", error)
      }
    }

    // Search violations (from localStorage data for now)
    if (type === "all" || type === "violations") {
      // This would need to be implemented with a proper violations collection
      // For now, we'll return empty results
    }

    // Search announcements
    if (type === "all" || type === "announcements") {
      try {
        const announcementsRef = collection(db, "announcements")
        const announcementsQuery = query(
          announcementsRef,
          orderBy("createdAt", "desc"),
          limit(limitCount)
        )
        const announcementsSnapshot = await getDocs(announcementsQuery)
        
        announcementsSnapshot.forEach((doc) => {
          const announcementData = doc.data()
          if (
            announcementData.title?.toLowerCase().includes(searchTerm) ||
            announcementData.content?.toLowerCase().includes(searchTerm)
          ) {
            results.push({
              id: doc.id,
              type: "announcement",
              title: announcementData.title || "Untitled Announcement",
              subtitle: announcementData.officeId ? "Office-specific" : "Global",
              description: announcementData.content?.substring(0, 100) + "..." || "No content",
              href: "/admin/announcements",
              icon: "megaphone",
              data: announcementData
            })
          }
        })
      } catch (error) {
        console.error("Error searching announcements:", error)
      }
    }

    // Sort results by relevance (exact matches first, then partial matches)
    results.sort((a, b) => {
      const aExact = a.title.toLowerCase().startsWith(searchTerm) ? 0 : 1
      const bExact = b.title.toLowerCase().startsWith(searchTerm) ? 0 : 1
      return aExact - bExact
    })

    return NextResponse.json({
      success: true,
      results: results.slice(0, limitCount),
      query: q,
      total: results.length
    })

  } catch (error) {
    console.error("Search error:", error)
    return NextResponse.json(
      { success: false, error: "Search failed" },
      { status: 500 }
    )
  }
}

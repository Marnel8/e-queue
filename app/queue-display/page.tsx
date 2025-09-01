"use client";

import { useState, useEffect } from "react";

interface QueueItem {
  id: string;
  ticketNumber: string;
  service: string;
  status: "waiting" | "serving" | "completed";
  estimatedWaitTime: number;
  priority: "normal" | "priority" | "vip";
  timestamp: string;
  deskId: number;
  assignedStaff?: string;
}

interface Desk {
  id: number;
  name: string;
  assignedStaff: string | null;
  status: "active" | "inactive" | "break";
}

interface ServiceQueue {
  serviceName: string;
  currentServing: string | null;
  waitingCount: number;
  estimatedWaitTime: number;
  queue: QueueItem[];
  desks: Desk[];
}

export default function QueueDisplayPage() {
  const [queues, setQueues] = useState<ServiceQueue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [currentTime, setCurrentTime] = useState(new Date());
  const [mounted, setMounted] = useState(false);

  // Fetch queue data
  const fetchQueueData = async () => {
    try {
      const response = await fetch('/api/queue-status');
      if (!response.ok) {
        throw new Error('Failed to fetch queue data');
      }
      const result = await response.json();
      if (result.success) {
        setQueues(result.data);
        setError(null);
      } else {
        throw new Error(result.error || 'Failed to fetch queue data');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setMounted(true);
    fetchQueueData();
    
    // Refresh data every 30 seconds
    const dataTimer = setInterval(fetchQueueData, 30000);
    
    // Update time every second
    const timeTimer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => {
      clearInterval(dataTimer);
      clearInterval(timeTimer);
    };
  }, []);



  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">
          Registrar Office Queue Display
        </h1>
        <p className="text-xl text-gray-600">
          {mounted ? currentTime.toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          }) : "Loading..."}
        </p>
        <p className="text-3xl font-mono font-bold text-blue-600 mt-2">
          {mounted ? currentTime.toLocaleTimeString('en-US', { 
            hour12: false, 
            hour: '2-digit', 
            minute: '2-digit', 
            second: '2-digit' 
          }) : "Loading..."}
        </p>
      </div>

      {/* Error Display */}
      {error && (
        <div className="max-w-7xl mx-auto mb-6">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <strong className="font-bold">Error: </strong>
            {error}
            <button 
              onClick={fetchQueueData}
              className="ml-4 bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        </div>
      )}



      {/* Service Desks */}
      {!loading && !error && queues.length > 0 && (
        <div className="max-w-7xl mx-auto mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Service Desks</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {queues[0]?.desks?.map((desk, index) => {
              const deskQueue = queues.flatMap(q => q.queue).filter(item => item.deskId === desk.id);
              const currentServing = deskQueue.find(item => item.status === "serving");
              const waitingCount = deskQueue.filter(item => item.status === "waiting").length;
              
              const colors = [
                "from-blue-500 to-blue-700",
                "from-green-500 to-green-700", 
                "from-purple-500 to-purple-700",
                "from-orange-500 to-orange-700"
              ];
              
              return (
                <div key={desk.id} className={`bg-gradient-to-br ${colors[index % colors.length]} text-white rounded-lg p-6 text-center shadow-lg`}>
                  <div className="text-xl font-bold mb-3">{desk.name}</div>
                  <div className="text-4xl font-mono font-bold mb-2">
                    {currentServing?.ticketNumber || "---"}
                  </div>
                  <div className="text-sm opacity-90 mb-2">
                    {desk.assignedStaff || "Unassigned"}
                  </div>
                  <div className="text-lg font-semibold">
                    {waitingCount} waiting
                  </div>
                  <div className={`inline-block px-2 py-1 rounded-full text-xs mt-2 ${
                    desk.status === "active" ? "bg-green-400" : 
                    desk.status === "break" ? "bg-yellow-400" : "bg-gray-400"
                  }`}>
                    {desk.status}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

            {/* Queue Details */}
      {!loading && !error && queues.length > 0 && (
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {queues[0]?.desks?.map((desk, index) => {
              const deskQueue = queues.flatMap(q => q.queue).filter(item => item.deskId === desk.id);
              const currentServing = deskQueue.find(item => item.status === "serving");
              const waitingQueue = deskQueue.filter(item => item.status === "waiting").slice(0, 5);
              
              const colors = [
                "text-blue-600",
                "text-green-600", 
                "text-purple-600",
                "text-orange-600"
              ];
              
              return (
                <div key={desk.id} className="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-6">
                  <div className="text-center mb-4">
                    <h3 className={`text-xl font-bold ${colors[index % colors.length]} mb-2`}>
                      {desk.name}
                    </h3>
                    <div className="text-3xl font-mono font-bold text-green-600 bg-green-100 px-4 py-2 rounded-lg mb-3">
                      {currentServing?.ticketNumber || "---"}
                    </div>
                    <div className="text-sm text-gray-600">Currently Serving</div>
                    <div className="text-xs text-gray-500 mt-1">
                      Staff: {desk.assignedStaff || "Unassigned"}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="text-sm font-semibold text-gray-700 mb-2">Next in Queue:</div>
                    {waitingQueue.length > 0 ? (
                      waitingQueue.map((item, itemIndex) => (
                        <div key={item.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <span className="font-mono font-bold">{item.ticketNumber}</span>
                          <span className="text-sm text-gray-600">#{itemIndex + 1}</span>
                        </div>
                      ))
                    ) : (
                      Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <span className="text-gray-400">---</span>
                          <span className="text-sm text-gray-400">#{i + 1}</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="text-center mt-8 text-gray-500">
        <p>This display updates automatically every 30 seconds</p>
        <p className="text-sm">For assistance, please approach the information desk or call extension 1234</p>
        <p className="text-xs mt-2">Registrar Office • Operating Hours: 8:00 AM - 5:00 PM</p>
      </div>
    </div>
  );
}

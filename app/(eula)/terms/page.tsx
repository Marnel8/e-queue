import { Card, CardTitle, CardHeader, CardContent, CardDescription } from '@/components/ui/card'
import Image from 'next/image'
import React from 'react'

const TermsPage = () => {
  return (
    <div>
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-6">
          <Card className="border-0 shadow-2xl">
            <CardHeader className="text-center pb-8">
              <div className="flex justify-center mb-6">
                <Image src="/images/logo.png" alt="E-Queue Logo" width={64} height={64} className="rounded-full" />
              </div>
              <CardTitle className="text-2xl font-bold text-primary">Terms of Service</CardTitle>
              <CardDescription className="text-muted-foreground">Last updated: 2025-01-27</CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-gray-700">
              <p>
                These terms and conditions govern your use of the E-Queue system at Occidental Mindoro State College – Mamburao Campus. By using this system, you agree to be bound by these terms.
              </p>

              <h2 className="text-lg font-semibold text-gray-800 mt-4">1. System Overview</h2>
              <p className="mt-2">
                The E-Queue system is designed to manage campus office queues efficiently. It provides real-time queue management, ticket issuance, and service delivery for OMSC Mamburao Campus offices.
              </p>

              <h2 className="text-lg font-semibold text-gray-800 mt-4">2. User Roles and Responsibilities</h2>
              <p className="mt-2">
                <strong>Customers:</strong> Must create an account, provide accurate information, and comply with queue rules. You are responsible for maintaining the confidentiality of your account credentials.
              </p>
              <p className="mt-2">
                <strong>Staff:</strong> Must manage queues fairly, process tickets in order, and maintain professional conduct. Only one staff member per office may manage the queue at any given time.
              </p>
              <p className="mt-2">
                <strong>Office Administrators:</strong> Responsible for managing office settings, staff assignments, and service configurations.
              </p>

              <h2 className="text-lg font-semibold text-gray-800 mt-4">3. Queue Rules and Policies</h2>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li><strong>One Active Ticket:</strong> You may only have one active ticket at a time. New tickets can only be issued after completing your current transaction and evaluation.</li>
                <li><strong>Same-Day Validity:</strong> All tickets are valid only for the day they are issued. No advance booking or scheduling is allowed.</li>
                <li><strong>First-Come-First-Serve:</strong> Queues operate on a first-come-first-serve basis, except for priority lanes.</li>
                <li><strong>Priority Lanes:</strong> Require valid priority ID documentation. False or invalid priority claims will result in account restrictions.</li>
                <li><strong>No-Show Policy:</strong> Failure to respond when called will result in automatic ticket cancellation.</li>
                <li><strong>Evaluation Requirement:</strong> Service evaluation completion is mandatory after each transaction before obtaining a new ticket.</li>
              </ul>

              <h2 className="text-lg font-semibold text-gray-800 mt-4">4. Prohibited Activities</h2>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Creating multiple accounts to bypass queue restrictions</li>
                <li>Spam cancellations or repeated ticket cancellations</li>
                <li>Providing false or misleading information</li>
                <li>Attempting to manipulate queue positions</li>
                <li>Sharing account credentials with others</li>
                <li>Using the system for non-campus business purposes</li>
                <li>Uploading inappropriate or false priority documentation</li>
              </ul>

              <h2 className="text-lg font-semibold text-gray-800 mt-4">5. Account Violations and Penalties</h2>
              <p className="mt-2">
                Violations of these terms may result in:
              </p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Temporary account suspension for minor violations</li>
                <li>Permanent account termination for serious violations</li>
                <li>Restriction from priority lane access</li>
                <li>Blocking from obtaining new tickets until compliance</li>
              </ul>

              <h2 className="text-lg font-semibold text-gray-800 mt-4">6. Data and Privacy</h2>
              <p className="mt-2">
                Your use of the system is also governed by our Privacy Policy. We collect and process your data in accordance with campus policies and applicable laws.
              </p>

              <h2 className="text-lg font-semibold text-gray-800 mt-4">7. System Availability</h2>
              <p className="mt-2">
                The system is provided "as is" and we do not guarantee uninterrupted service. Maintenance periods may temporarily affect system availability. During maintenance mode, certain features may be disabled.
              </p>

              <h2 className="text-lg font-semibold text-gray-800 mt-4">8. Limitation of Liability</h2>
              <p className="mt-2">
                OMSC Mamburao Campus is not liable for any delays, service interruptions, or damages arising from the use of the E-Queue system, except as required by law.
              </p>

              <h2 className="text-lg font-semibold text-gray-800 mt-4">9. Changes to Terms</h2>
              <p className="mt-2">
                We reserve the right to modify these terms at any time. Continued use of the system after changes constitutes acceptance of the new terms.
              </p>

              <h2 className="text-lg font-semibold text-gray-800 mt-4">10. Contact Information</h2>
              <p className="mt-2">
                For questions about these terms or the E-Queue system, please contact the OMSC Mamburao Campus IT Department or your respective office administrator.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default TermsPage

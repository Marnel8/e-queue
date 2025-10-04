import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Image from 'next/image'
import React from 'react'

const PrivacyPage = () => {
  return (
            <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <Card className="border-0 shadow-2xl">
          <CardHeader className="text-center pb-8">
            <div className="flex justify-center mb-6">
              <Image src="/images/logo.png" alt="E-Queue Logo" width={64} height={64} className="rounded-full" />
            </div>
            <CardTitle className="text-2xl font-bold text-primary">Privacy Policy</CardTitle>
            <CardDescription className="text-muted-foreground">Last updated: 2025-09-29</CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-gray-700">
            <p>
              This Privacy Policy explains how we collect, use, and share your personal information when you use the E-Queue system at Occidental Mindoro State College – Mamburao Campus.
            </p>

            <h2 className="text-lg font-semibold text-gray-800 mt-4">1. Information We Collect</h2>
            <p className="mt-2">
              When you use the E-Queue system, we collect the following information:
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li><strong>Account Information:</strong> Name, email address, phone number, and password when you create an account</li>
              <li><strong>Queue Data:</strong> Office selections, service requests, ticket numbers, and queue positions</li>
              <li><strong>Priority Information:</strong> Priority ID documents and verification status for priority lane access</li>
              <li><strong>Feedback Data:</strong> Service evaluations, ratings, and feedback forms you submit</li>
              <li><strong>Usage Data:</strong> Login times, queue interactions, and system usage patterns</li>
              <li><strong>Device Information:</strong> IP address, browser type, and device information for system optimization</li>
            </ul>

            <h2 className="text-lg font-semibold text-gray-800 mt-4">2. How We Use Your Information</h2>
            <p className="mt-2">
              We use your information for the following purposes:
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li><strong>Queue Management:</strong> To manage your position in queues, issue tickets, and provide real-time updates</li>
              <li><strong>Service Delivery:</strong> To connect you with appropriate office staff and services</li>
              <li><strong>Notifications:</strong> To send you queue updates, reminders, and service notifications via email, SMS, or in-app alerts</li>
              <li><strong>Priority Processing:</strong> To verify and process priority lane requests with appropriate documentation</li>
              <li><strong>Service Improvement:</strong> To analyze feedback and improve campus office services</li>
              <li><strong>System Security:</strong> To monitor for violations, spam cancellations, and maintain system integrity</li>
              <li><strong>Compliance:</strong> To ensure evaluation completion and maintain service quality standards</li>
            </ul>

            <h2 className="text-lg font-semibold text-gray-800 mt-4">3. Data Sharing and Disclosure</h2>
            <p className="mt-2">
              We do not sell, trade, or transfer your personal information to third parties. We may share your information only in the following circumstances:
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>With campus office staff to provide requested services</li>
              <li>With system administrators for maintenance and security purposes</li>
              <li>When required by law or to protect our rights and safety</li>
              <li>In case of system violations or security breaches</li>
            </ul>

            <h2 className="text-lg font-semibold text-gray-800 mt-4">4. Data Security</h2>
            <p className="mt-2">
              We implement appropriate security measures to protect your personal information. All data is encrypted and stored securely using Firebase services. Access to your information is restricted to authorized personnel only.
            </p>

            <h2 className="text-lg font-semibold text-gray-800 mt-4">5. Data Retention</h2>
            <p className="mt-2">
              We retain your information for as long as necessary to provide services and comply with campus policies. Queue data is typically retained for 30 days, while account information is retained until account deletion.
            </p>

            <h2 className="text-lg font-semibold text-gray-800 mt-4">6. Your Rights</h2>
            <p className="mt-2">
              You have the right to:
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Access and update your personal information</li>
              <li>Request deletion of your account and data</li>
              <li>Opt-out of non-essential notifications</li>
              <li>Request a copy of your data</li>
            </ul>

            <h2 className="text-lg font-semibold text-gray-800 mt-4">7. Contact Information</h2>
            <p className="mt-2">
              If you have any questions about this Privacy Policy or our data practices, please contact the OMSC Mamburao Campus IT Department.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default PrivacyPage

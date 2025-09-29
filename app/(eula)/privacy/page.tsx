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
              This Privacy Policy explains how we collect, use, and share your personal information when you use our E-Queue system.
            </p>

            <h2 className="text-lg font-semibold text-gray-800 mt-4">1. Information We Collect</h2>
            <p className="mt-2">
              We collect information from you when you register on our site, place an order, subscribe to our newsletter, respond to a survey or fill out a form. When ordering or registering on our site, as appropriate, you may be asked to enter your: name, e-mail address, mailing address, phone number, or credit card information. You may, however, visit our site anonymously.
            </p>

            <h2 className="text-lg font-semibold text-gray-800 mt-4">2. How We Use Your Information</h2>
            <p className="mt-2">
              Any of the information we collect from you may be used in one of the following ways:
      
              To personalize your experience (your information helps us to better respond to your individual needs)
              To improve our website (we continually strive to improve our website offerings based on the information and feedback we receive from you)
              To improve customer service (your information helps us to more effectively respond to your customer service requests and support needs)
              To process transactions
              Your information, whether public or private, will not be sold, exchanged, transferred, or given to any other company for any reason whatsoever, without your consent, other than for the express purpose of delivering the purchased product or service requested.
              To administer a contest, promotion, survey or other site feature
              To send periodic emails
              The email address you provide for order processing, will only be used to send you information and updates pertaining to your order.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default PrivacyPage

import { Card, CardTitle, CardHeader, CardContent } from '@/components/ui/card'
import React from 'react'

const TermsPage = () => {
  return (
    <div>
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-6">
          <Card className="border-0 shadow-2xl">
            <CardHeader className="text-center pb-8">
              <CardTitle className="text-2xl font-bold text-primary">Terms of Service</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-gray-700">
              <p>
                These terms and conditions outline the rules and regulations for the use of our website.
              </p>
              <h2 className="text-lg font-semibold text-gray-800 mt-4">1. Introduction</h2>
              <p className="mt-2">
                These terms and conditions outline the rules and regulations for the use of our website.
              </p>
              <h2 className="text-lg font-semibold text-gray-800 mt-4">2. Use of the Website</h2>
              <p className="mt-2">
                You may use the website for personal and commercial purposes, subject to these terms and conditions.
              </p>
              <h2 className="text-lg font-semibold text-gray-800 mt-4">3. User Conduct</h2>
              <p className="mt-2">
                You must comply with all applicable laws and regulations while using the website.
              </p>
              <h2 className="text-lg font-semibold text-gray-800 mt-4">4. Privacy Policy</h2>
              <p className="mt-2">
                Your use of the website is also governed by our Privacy Policy.
              </p>  
              <h2 className="text-lg font-semibold text-gray-800 mt-4">5. Disclaimer</h2>
              <p className="mt-2">
                The website is provided "as is" without any warranties of any kind.
              </p>
              <h2 className="text-lg font-semibold text-gray-800 mt-4">6. Limitation of Liability</h2>
              <p className="mt-2">
                We are not liable for any damages arising from the use of the website.
              </p>
              <h2 className="text-lg font-semibold text-gray-800 mt-4">7. Changes to Terms and Conditions</h2>
              <p className="mt-2">
                We reserve the right to update these terms and conditions at any time.
              </p>
              <h2 className="text-lg font-semibold text-gray-800 mt-4">8. Governing Law</h2>
              <p className="mt-2">
                These terms and conditions are governed by the laws of the jurisdiction in which the website is located.
              </p>
              <h2 className="text-lg font-semibold text-gray-800 mt-4">9. Contact Information</h2>
              <p className="mt-2">
                If you have any questions about these terms and conditions, please contact us at [contact information].
              </p>  
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default TermsPage

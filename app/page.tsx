import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, Users, Shield, Zap } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 md:gap-3">
            <Image
              src="/images/logo.png"
              alt="E-Queue Logo"
              width={32}
              height={32}
              className="md:w-10 md:h-10 rounded-full"
            />
            <div>
              <h1 className="text-lg md:text-xl font-bold text-primary">E-Queue</h1>
              <p className="text-xs text-muted-foreground hidden sm:block">OMSC Mamburao Campus</p>
            </div>
          </div>
          <div className="flex items-center gap-2 md:gap-3">
            <Link href="/login">
              <Button variant="ghost" className="text-primary hover:text-primary/80 text-sm md:text-base px-3 md:px-4">
                Login
              </Button>
            </Link>
            <Link href="/register">
              <Button className="gradient-primary text-white text-sm md:text-base px-3 md:px-4">Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-12 md:py-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image src="/images/hero-bg.jpg" alt="OMSC Campus" fill className="object-cover opacity-10" />
          <div className="absolute inset-0 gradient-primary opacity-5" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-4 md:mb-6 bg-accent/10 text-accent border-accent/20 text-xs md:text-sm">
              Queue Management System
            </Badge>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 leading-tight">
              Streamline Your
              <span className="text-gradient block">Campus Queues</span>
            </h1>
            <p className="text-base md:text-xl text-muted-foreground mb-6 md:mb-8 max-w-2xl mx-auto leading-relaxed px-4">
              Eliminate long waits and disorganized queues at OMSC Mamburao Campus. Experience efficient, real-time
              queue management with smart notifications.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center px-4">
              <Link href="/register">
                <Button
                  size="lg"
                  className="gradient-primary text-white w-full sm:w-auto px-6 md:px-8 py-4 md:py-6 text-base md:text-lg"
                >
                  Book Your Queue
                </Button>
              </Link>
              <Link href="/login">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-primary text-primary w-full sm:w-auto px-6 md:px-8 py-4 md:py-6 text-base md:text-lg bg-transparent"
                >
                  Staff Login
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 md:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-2xl md:text-4xl font-bold text-primary mb-3 md:mb-4">Why Choose E-Queue?</h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto px-4">
              Modern queue management designed specifically for campus offices
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-6 md:p-8 text-center">
                <div className="w-12 h-12 md:w-16 md:h-16 gradient-primary rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6">
                  <Clock className="w-6 h-6 md:w-8 md:h-8 text-white" />
                </div>
                <h3 className="text-lg md:text-xl font-semibold text-primary mb-2 md:mb-3">Real-time Updates</h3>
                <p className="text-sm md:text-base text-muted-foreground">
                  Get live queue status and estimated waiting times
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-6 md:p-8 text-center">
                <div className="w-12 h-12 md:w-16 md:h-16 gradient-accent rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6">
                  <Users className="w-6 h-6 md:w-8 md:h-8 text-white" />
                </div>
                <h3 className="text-lg md:text-xl font-semibold text-primary mb-2 md:mb-3">Multi-Role Access</h3>
                <p className="text-sm md:text-base text-muted-foreground">
                  Tailored interfaces for admins, staff, and students
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-6 md:p-8 text-center">
                <div className="w-12 h-12 md:w-16 md:h-16 gradient-primary rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6">
                  <Shield className="w-6 h-6 md:w-8 md:h-8 text-white" />
                </div>
                <h3 className="text-lg md:text-xl font-semibold text-primary mb-2 md:mb-3">Secure & Reliable</h3>
                <p className="text-sm md:text-base text-muted-foreground">
                  Built with security and data protection in mind
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-6 md:p-8 text-center">
                <div className="w-12 h-12 md:w-16 md:h-16 gradient-accent rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6">
                  <Zap className="w-6 h-6 md:w-8 md:h-8 text-white" />
                </div>
                <h3 className="text-lg md:text-xl font-semibold text-primary mb-2 md:mb-3">Smart Notifications</h3>
                <p className="text-sm md:text-base text-muted-foreground">
                  Multi-channel alerts via app, email, and SMS
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-20 gradient-primary">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-4xl font-bold text-white mb-4 md:mb-6">
            Ready to Transform Your Campus Experience?
          </h2>
          <p className="text-base md:text-xl text-white/90 mb-6 md:mb-8 max-w-2xl mx-auto px-4">
            Join OMSC Mamburao Campus in revolutionizing queue management
          </p>
          <Link href="/register">
            <Button
              size="lg"
              className="bg-white text-primary hover:bg-white/90 px-6 md:px-8 py-4 md:py-6 text-base md:text-lg"
            >
              Get Started Today
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary text-white py-8 md:py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 md:gap-3">
              <Image
                src="/images/logo.png"
                alt="E-Queue Logo"
                width={28}
                height={28}
                className="md:w-8 md:h-8 rounded-full"
              />
              <div>
                <h3 className="font-semibold text-sm md:text-base">E-Queue</h3>
                <p className="text-xs md:text-sm text-white/70">OMSC Mamburao Campus</p>
              </div>
            </div>
            <p className="text-white/70 text-xs md:text-sm">© 2024 E-Queue. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

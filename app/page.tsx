import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Zap, Shield, Clock, MapPin, Star } from "lucide-react"
import Link from "next/link"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              CUET RickshawkX
            </span>
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/about" className="text-gray-600 hover:text-blue-600 transition-colors">
              About
            </Link>
            <Link href="/contact" className="text-gray-600 hover:text-blue-600 transition-colors">
              Contact
            </Link>
            <Link href="/auth/login">
              <Button variant="outline" size="sm">
                Login
              </Button>
            </Link>
            <Link href="/auth/register">
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                Get Started
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <Badge className="mb-4 bg-blue-100 text-blue-700 hover:bg-blue-100">🚀 Smart Campus 2050</Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-500 bg-clip-text text-transparent">
            Future of Campus
            <br />
            Transportation
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Connect with tech-savvy rickshaw pullers on CUET smart campus. Fast, reliable, and sustainable rides at your
            fingertips.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/register">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8">
                Start Riding <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
            <Link href="/auth/register?role=rickshaw">
              <Button size="lg" variant="outline" className="px-8 bg-transparent">
                Drive with Us
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Choose RickshawkX?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Experience the future of campus transportation with our cutting-edge platform
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Clock className="w-6 h-6 text-blue-600" />
                </div>
                <CardTitle>Real-time Tracking</CardTitle>
                <CardDescription>Track your ride in real-time with GPS precision and live updates</CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-emerald-600" />
                </div>
                <CardTitle>Safe & Secure</CardTitle>
                <CardDescription>
                  Verified drivers, secure payments, and 24/7 campus security integration
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <MapPin className="w-6 h-6 text-purple-600" />
                </div>
                <CardTitle>Campus Optimized</CardTitle>
                <CardDescription>
                  Designed specifically for CUET campus with all landmarks and shortcuts
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold mb-2">10K+</div>
              <div className="text-blue-100">Happy Students</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">500+</div>
              <div className="text-blue-100">Active Drivers</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">50K+</div>
              <div className="text-blue-100">Rides Completed</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">4.9</div>
              <div className="text-blue-100 flex items-center justify-center">
                <Star className="w-4 h-4 mr-1 fill-current" />
                Average Rating
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Campus Commute?</h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of CUET students and drivers who are already experiencing the future of transportation
          </p>
          <Link href="/auth/register">
            <Button
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8"
            >
              Get Started Today <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">CUET RickshawkX</span>
              </div>
              <p className="text-gray-400">The future of campus transportation, today.</p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Platform</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/student" className="hover:text-white transition-colors">
                    For Students
                  </Link>
                </li>
                <li>
                  <Link href="/rickshaw" className="hover:text-white transition-colors">
                    For Drivers
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/contact" className="hover:text-white transition-colors">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="hover:text-white transition-colors">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-white transition-colors">
                    Terms
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="hover:text-white transition-colors">
                    Privacy
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">CUET Campus</h3>
              <p className="text-gray-400 text-sm">
                Chittagong University of Engineering & Technology
                <br />
                Smart Campus Initiative 2050
              </p>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2050 CUET RickshawkX. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

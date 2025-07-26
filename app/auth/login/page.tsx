"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Zap, User, Car, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  // const handleLogin = async (formData: FormData) => {
  //   setIsLoading(true);
  //   try {
  //     const formDataObj: any = {};
  //     formData.forEach((value, key) => { formDataObj[key] = value; });

  //     const payload = {
  //       email: formDataObj.email,
  //       password: formDataObj.password,
  //     };

  //     const response = await fetch('/auth/login', {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify(payload),
  //     });

  //     const result = await response.json();
  //     if (!response.ok) throw new Error(result.message || 'Login failed');

  //     // Store token and user
  //     localStorage.setItem('token', result.token);
  //     localStorage.setItem('user', JSON.stringify(result.user));

  //     // Redirect based on user type
  //     if (result.user.type === 'user') router.push('/student/dashboard');
  //     else if (result.user.type === 'driver') router.push('/rickshaw/dashboard');
  //   } catch (error: any) {
  //     alert(error.message || 'Login failed');
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };


  const handleLogin = async (formData: FormData) => {
    const formDataObj: any = {};
    formData.forEach((value, key) => { formDataObj[key] = value; });

    const response = await fetch('http://10.19.88.241:3000/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formDataObj),
    });

    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'Login failed');

    // Store token and user
    localStorage.setItem('token', result.token);
    localStorage.setItem('user', JSON.stringify(result.user));

    // Redirect based on user type
    if (result.user.type === 'user') router.push('/student/dashboard');
    else if (result.user.type === 'driver') router.push('/rickshaw/dashboard');
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              CUET RickshawkX
            </span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome Back</h1>
          <p className="text-gray-600">Sign in to your account</p>
        </div>

        <Card className="border-0 shadow-xl">
          <CardHeader className="pb-4">
            <CardTitle className="text-center">Choose Your Role</CardTitle>
            <CardDescription className="text-center">Select how you want to access the platform</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="student" className="w-full">
              {/* <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="student" className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Student
                </TabsTrigger>
                <TabsTrigger value="rickshaw" className="flex items-center gap-2">
                  <Car className="w-4 h-4" />
                  Driver
                </TabsTrigger>
              </TabsList> */}

              {/* Student Login */}
              <TabsContent value="student">
                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    const formData = new FormData(e.currentTarget)
                    handleLogin(formData)
                  }}
                >
                  <div className="space-y-4">
                    {/* s */}
                    <div className="space-y-2">
                      <Label htmlFor="student-email">Email</Label>
                      <Input
                        id="student-email"
                        name="email"
                        type="email"
                        placeholder="your.email@student.cuet.ac.bd"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="student-password">Password</Label>
                      <Input id="student-password" name="password" type="password" required />
                    </div>
                    <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
                      {isLoading ? "Signing in..." : "Sign In"}
                    </Button>
                  </div>
                </form>
              </TabsContent>

              {/* Rickshaw Driver Login */}
              <TabsContent value="rickshaw">
                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    const formData = new FormData(e.currentTarget)
                    handleLogin(formData)
                  }}
                >
                  <div className="space-y-4">
                    {/* <div className="text-center mb-4">
                      <Badge className="bg-emerald-100 text-emerald-700">Portal</Badge>
                    </div> */}
                    <div className="space-y-2">
                      <Label htmlFor="driver-email">Email</Label>
                      <Input
                        id="driver-email"
                        name="email"
                        type="email"
                        placeholder="driver@cuet.ac.bd"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="driver-password">Password</Label>
                      <Input id="driver-password" name="password" type="password" required />
                    </div>
                    <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700" disabled={isLoading}>
                      {isLoading ? "Signing in..." : "Sign In"}
                    </Button>
                  </div>
                </form>
              </TabsContent>
            </Tabs>

            <div className="mt-6 text-center">
              <Link href="/auth/forgot-password" className="text-sm text-blue-600 hover:text-blue-700">
                Forgot your password?
              </Link>
            </div>

            <div className="mt-4 text-center">
              <span className="text-sm text-gray-600">Don't have an account? </span>
              <Link href="/auth/register" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                Sign up here
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

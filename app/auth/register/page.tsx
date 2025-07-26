"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Zap, User, Car, ArrowLeft, Upload } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [step, setStep] = useState(1)
  const router = useRouter()

  // const handleRegister = async (formData: FormData) => {
  //   setIsLoading(true);
  //   try {
  //     const formDataObj: any = {};
  //     formData.forEach((value, key) => { formDataObj[key] = value; });

  //     // Build payload for user or driver
  //     const payload: any = {
  //       email: formDataObj.email,
  //       phone: formDataObj.phone,
  //       password: formDataObj.password,
  //       name: formDataObj.name,
  //       type: formDataObj.type, // 'user' or 'driver'
  //     };
  //     if (formDataObj.type === 'driver') {
  //       payload.vehicleType = formDataObj.vehicleType;
  //       payload.vehicleNumber = formDataObj.vehicleNumber;
  //       payload.licenseNumber = formDataObj.licenseNumber;
  //     }

  //     const response = await fetch('/auth/register', {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify(payload),
  //     });

  //     const result = await response.json();
  //     if (!response.ok) throw new Error(result.message || 'Registration failed');

  //     // Store token and user
  //     localStorage.setItem('token', result.token);
  //     localStorage.setItem('user', JSON.stringify(result.user));

  //     // Redirect or show success
  //     router.push('/auth/login');
  //   } catch (error: any) {
  //     alert(error.message || 'Registration failed');
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };


  const handleRegister = async (formData: FormData, type: string) => {
    const formDataObj: any = {};
    formData.forEach((value, key) => { formDataObj[key] = value; });

    const response = await fetch('http://10.19.88.241:3000/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...formDataObj, type }),
    });

    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'Registration failed');

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
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Join the Future</h1>
          <p className="text-gray-600">Create your account to get started</p>
        </div>

        <Card className="border-0 shadow-xl">
          <CardHeader className="pb-4">
            <CardTitle className="text-center">Choose Your Role</CardTitle>
            <CardDescription className="text-center">Select how you want to use the platform</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="student" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="student" className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Student
                </TabsTrigger>
                <TabsTrigger value="rickshaw" className="flex items-center gap-2">
                  <Car className="w-4 h-4" />
                  Driver
                </TabsTrigger>
              </TabsList>

              {/* Student Registration */}
              {/* {
  "email": "{{testUserEmail}}",
  "phone": "{{testUserPhone}}",
  "password": "{{testUserPassword}}",
  "name": "Test User",
  "type": "user" */}
              {/* } */}
              <TabsContent value="student">
                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    const formData = new FormData(e.currentTarget)
                    handleRegister(formData, "user")
                  }}
                >
                  <div className="space-y-4">
                    <div className="text-center mb-4">
                      <Badge className="bg-blue-100 text-blue-700">Student Registration</Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input id="name" name="name" required />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="your.email@example.com"
                        required
                      />
                    </div>
                    {/* "phone": "{{testUserPhone}}", */}
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input id="phone" name="phone" type="tel" placeholder="+880 1XXXXXXXXX" required />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <Input id="password" name="password" type="password" required />
                    </div>

                    {/* <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirm Password</Label>
                      <Input id="confirm-password" name="confirmPassword" type="password" required />
                    </div> */}

                    <div className="flex items-center space-x-2">
                      <Checkbox id="terms" required />
                      <Label htmlFor="terms" className="text-sm">
                        I agree to the{" "}
                        <Link href="/terms" className="text-blue-600 hover:underline">
                          Terms of Service
                        </Link>{" "}
                        and{" "}
                        <Link href="/privacy" className="text-blue-600 hover:underline">
                          Privacy Policy
                        </Link>
                      </Label>
                    </div>

                    <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
                      {isLoading ? "Creating Account..." : "Create Student Account"}
                    </Button>
                  </div>
                </form>
              </TabsContent>

              {/* Rickshaw Driver Registration */}
              {/* {
  "email": "{{testDriverEmail}}",
  "phone": "{{testDriverPhone}}",
  "password": "{{testDriverPassword}}",
  "name": "Test Driver",
  "type": "driver",
  "vehicleType": "Rickshaw",
  "vehicleNumber": "DH-TEST-001",
  "licenseNumber": "TEST123456"
} */}
              {/* } */}
              <TabsContent value="rickshaw">
                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    const formData = new FormData(e.currentTarget)
                    handleRegister(formData, "driver")
                  }}
                >
                  <div className="space-y-4">
                    <div className="text-center mb-4">
                      <Badge className="bg-emerald-100 text-emerald-700">Driver Registration</Badge>
                    </div>


                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input id="name" name="name" required />
                    </div>


                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" name="email" type="email" placeholder="your.email@example.com" required />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input id="phone" name="phone" type="tel" placeholder="+880 1XXXXXXXXX" required />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <Input id="password" name="password" type="password" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="vehicleType">Vehicle Type</Label>
                      <Input id="vehicleType" name="vehicleType" value={'Rickshaw'} placeholder="Rickshaw" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="vehicleNumber">Vehicle Number</Label>
                      <Input id="vehicleNumber" name="vehicleNumber" placeholder="DH-TEST-001" required />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="licenseNumber">License Number</Label>
                      <Input id="licenseNumber" name="licenseNumber" placeholder="TEST123456" required />
                    </div>

                    {/* <div className="flex items-center space-x-2">
                      <Checkbox id="driver-terms" required />
                      <Label htmlFor="driver-terms" className="text-sm">
                        I agree to the driver terms and background verification
                      </Label>
                    </div> */}

                    <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700" disabled={isLoading}>
                      {isLoading ? "Creating Account..." : "Apply as Driver"}
                    </Button>
                  </div>
                </form>
              </TabsContent>
            </Tabs>

            <div className="mt-6 text-center">
              <span className="text-sm text-gray-600">Already have an account? </span>
              <Link href="/auth/login" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                Sign in here
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

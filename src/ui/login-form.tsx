'use client';
import { useActionState } from 'react';
import { authenticate } from '@/lib/actions';
import { useSearchParams } from 'next/navigation';
import {
    AtSymbolIcon,
    KeyIcon,
    ExclamationCircleIcon,
  } from '@heroicons/react/24/outline';
import { ArrowRightIcon } from '@heroicons/react/20/solid';
import { Button } from '@/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function LoginForm() {
    const searchParams = useSearchParams();
    const callBackUrl = searchParams?.get('callbackUrl') || '/dashboard/';
    const [errorMessage, formAction, isPending] = useActionState(
        authenticate,
        undefined,
    );

    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-r from-10% via-sk via-30% to-emerald-500 to-90%">
        <Tabs defaultValue="login" className="w-[400px]">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
          </TabsList>
          <TabsContent value="login">
            <Card>
              <CardHeader>
                <CardTitle className="font-bold text-xl">Login</CardTitle>
                <CardDescription>
                  Welcome back! Please login to continue.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <form action={formAction} className="space-y-3">
                  <div className="space-y-1">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Input
                        id="email"
                        type="email"
                        name="email"
                        placeholder="Enter your email address"
                        required
                      />
                      <AtSymbolIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type="password"
                        name="password"
                        placeholder="Enter password"
                        required
                        minLength={6}
                      />
                      <KeyIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                    </div>
                  </div>
                  <input type="hidden" name="redirectTo" value={callBackUrl} />
                  <Button className="mt-4 w-full" aria-disabled={isPending}>
                    Log in <ArrowRightIcon className="ml-auto h-5 w-5 text-gray-50" />
                  </Button>
                  <div
                    className="flex h-8 items-end space-x-1"
                    aria-live="polite"
                    aria-atomic="true"
                  >
                    {errorMessage && (
                      <>
                        <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
                        <p className="text-sm text-red-500">{errorMessage}</p>
                      </>
                    )}
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="register">
            <Card>
              <CardHeader>
                <CardTitle className="font-bold text-xl">Register</CardTitle>
                <CardDescription>
                  Join us today! Create your account below.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="space-y-1">
                  <Label htmlFor="first">First Name</Label>
                  <Input id="first" placeholder="John" type="input" />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="last">Last Name</Label>
                  <Input id="last" placeholder="Doe" type="input" />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" placeholder="Email" type="email" />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" placeholder="Password" type="password" />
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button>Submit</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    );
}
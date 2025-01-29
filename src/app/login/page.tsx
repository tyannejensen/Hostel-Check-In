'use client';

import { Button } from "@/components/ui/button"
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
//Adding auth to the page
import { useActionState } from "react"
import { authenticate } from "@/lib/actions"
import { useSearchParams } from "next/navigation"
import { ExclamationCircleIcon } from '@heroicons/react/24/outline';

export default function Page() {

  const searchParams = useSearchParams()
  const callBackUrl = searchParams?.get("callbackUrl") || "/dashboard/";
  const [errorMessage, formAction, isPending] = useActionState(
    authenticate, 
    undefined,
  );

	return (
    <form action={formAction}>
			<div id="grad">
				<div id="text" className=" flex items-center justify-center h-screen">
					<Tabs defaultValue="register" id="text" className="w-[400px] text">
						<TabsList className="grid w-full grid-cols-2">
							<TabsTrigger id="text" value="register">
								Register
							</TabsTrigger>
							<TabsTrigger id="text" value="login">
								Login
							</TabsTrigger>
						</TabsList>
						<TabsContent value="register">
							<Card>
								<CardHeader>
									<CardTitle id="text" className="font-bold text-xl">
										Register
									</CardTitle>
									<CardDescription>
										{" "}
										Join us today! Create your account below.
									</CardDescription>
								</CardHeader>
								<CardContent className="space-y-2">
									<div id="text" className="space-y-1">
										<Label htmlFor="first">First Name</Label>
										<Input id="first" placeholder="John" type="input" />
									</div>
									<div id="text" className="space-y-1">
										<Label htmlFor="last">Last Name</Label>
										<Input id="last" placeholder="Doe" type="input" />
									</div>
									<div id="text" className="space-y-1">
										<Label htmlFor="email">Email</Label>
										<Input id="email" placeholder="Email" type="email" />
									</div>
									<div id="text" className="space-y-1">
										<Label htmlFor="password">Password</Label>
										<Input
											id="password"
											placeholder="Password"
											type="password"
										/>
									</div>
								</CardContent>
								<CardFooter className="flex justify-end">
									<Button id="contrast" className="drop-shadow-lg" aria-disabled={isPending}>
										Submit
									</Button>
                  {errorMessage && (
                    <>
                      <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
                      <p className="text-sm text-red-500">{errorMessage}</p>
                    </>
                  )}
								</CardFooter>
							</Card>
						</TabsContent>
						<TabsContent value="login">
							<Card>
								<CardHeader>
									<CardTitle id="text" className="font-bold text-xl">
										Login
									</CardTitle>
									<CardDescription>
										Welcome back! Please login to continue.
									</CardDescription>
								</CardHeader>
								<CardContent id="text" className="space-y-2">
									<div className="space-y-1">
										<Label htmlFor="email">Email</Label>
										<Input 
										id="email" 
										placeholder="Email" 
										type="email" 
										name="email"
										required
										/>
									</div>
									<div className="space-y-1">
										<Label htmlFor="password">Password</Label>
										<Input
											id="password"
											placeholder="Password"
											type="password"
											name="password"
											required
										/>
									</div>
								</CardContent>
                <CardFooter className="flex justify-end">
                <input type="hidden" name="redirectTo" value={callBackUrl} />
                  <Button id="dark-button" className="drop-shadow-lg">
                    Login
                  </Button>
                  {errorMessage && (
                    <>
                      <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
                      <p className="text-sm text-red-500">{errorMessage}</p>
                    </>
                  )}
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </form>
  );
}
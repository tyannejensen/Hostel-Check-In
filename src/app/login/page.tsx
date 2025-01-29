import { Button } from "@/components/ui/button";
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

export default async function Page() {
  return (
    <>
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
                  <Button id="contrast" className="drop-shadow-lg">
                    Submit
                  </Button>
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
                    <Input id="email" placeholder="Email" type="email" />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      placeholder="Password"
                      type="password"
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button id="dark-button" className="drop-shadow-lg">
                    Login
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
}

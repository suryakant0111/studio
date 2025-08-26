
"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";

export default function ProfilePage() {

    const { register, handleSubmit, watch, formState: { errors } } = useForm({
        defaultValues: {
            name: "Alex Doe",
            email: "alex.doe@example.com",
            goal: "weight-loss",
            dailyCalories: 2000,
            dailyProtein: 150,
            dailyCarbs: 200,
            dailyFats: 60,
            notifications: true,
            theme: "system",
        }
    });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
        <p className="text-muted-foreground">Manage your profile and settings.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1 space-y-6">
             <Card>
                <CardHeader>
                    <CardTitle>Your Profile</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center text-center">
                    <Avatar className="w-24 h-24 mb-4">
                    <AvatarImage src="https://i.pravatar.cc/150?u=a042581f4e29026704d" alt="Alex Doe" />
                    <AvatarFallback>AD</AvatarFallback>
                    </Avatar>
                    <h2 className="text-xl font-semibold">Alex Doe</h2>
                    <p className="text-muted-foreground">alex.doe@example.com</p>
                    <Button variant="outline" className="mt-4">Change Picture</Button>
                </CardContent>
            </Card>
        </div>

        <div className="lg:col-span-2 space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Account Information</CardTitle>
                    <CardDescription>Update your personal details.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input id="name" {...register("name")} />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input id="email" type="email" {...register("email")} />
                    </div>
                     <Button>Save Changes</Button>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Health & Nutrition Goals</CardTitle>
                     <CardDescription>Set your daily targets and preferences.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="goal">Primary Goal</Label>
                        <Select defaultValue="weight-loss">
                            <SelectTrigger id="goal">
                                <SelectValue placeholder="Select your goal" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="weight-loss">Weight Loss</SelectItem>
                                <SelectItem value="muscle-gain">Muscle Gain</SelectItem>
                                <SelectItem value="maintenance">Maintenance</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="calories">Daily Calories (kcal)</Label>
                            <Input id="calories" type="number" {...register("dailyCalories")} />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="protein">Daily Protein (g)</Label>
                            <Input id="protein" type="number" {...register("dailyProtein")} />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="carbs">Daily Carbs (g)</Label>
                            <Input id="carbs" type="number" {...register("dailyCarbs")} />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="fats">Daily Fats (g)</Label>
                            <Input id="fats" type="number" {...register("dailyFats")} />
                        </div>
                    </div>
                     <Button>Update Goals</Button>
                </CardContent>
            </Card>
            
             <Card>
                <CardHeader>
                    <CardTitle>Settings</CardTitle>
                     <CardDescription>Customize your app experience.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <Label htmlFor="notifications">Enable Notifications</Label>
                            <p className="text-sm text-muted-foreground">Get reminders for meals and tracking.</p>
                        </div>
                        <Switch id="notifications" defaultChecked />
                    </div>
                    <Separator />
                     <div className="flex items-center justify-between">
                        <div>
                           <Label htmlFor="theme">Theme</Label>
                           <p className="text-sm text-muted-foreground">Choose your preferred color scheme.</p>
                        </div>
                         <Select defaultValue="system">
                            <SelectTrigger id="theme" className="w-[180px]">
                                <SelectValue placeholder="Select theme" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="light">Light</SelectItem>
                                <SelectItem value="dark">Dark</SelectItem>
                                <SelectItem value="system">System</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}

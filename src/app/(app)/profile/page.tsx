
"use client"

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { getUserProfile, updateUserProfile, UserProfile } from "@/services/userService";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

type FormData = {
    name: string;
    email: string;
    goal: string;
    dailyCalories: number;
    dailyProtein: number;
    dailyCarbs: number;
    dailyFats: number;
    notifications: boolean;
    theme: string;
};


export default function ProfilePage() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    const { register, handleSubmit, reset, control, formState: { isDirty, isSubmitting } } = useForm<FormData>();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
                const userProfile = await getUserProfile(currentUser.uid);
                if (userProfile) {
                    reset({
                        name: userProfile.name,
                        email: userProfile.email,
                        goal: userProfile.healthGoals.primaryGoal,
                        dailyCalories: userProfile.healthGoals.dailyCalories,
                        dailyProtein: userProfile.healthGoals.dailyProtein,
                        dailyCarbs: userProfile.healthGoals.dailyCarbs,
                        dailyFats: userProfile.healthGoals.dailyFats,
                        notifications: true, // Placeholder
                        theme: "system", // Placeholder
                    });
                } else {
                     // Set initial default values if no profile exists
                     reset({
                        name: currentUser.displayName || "",
                        email: currentUser.email || "",
                        goal: "maintenance",
                        dailyCalories: 2000,
                        dailyProtein: 150,
                        dailyCarbs: 200,
                        dailyFats: 60,
                     })
                }
            } else {
                setUser(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, [reset]);

    const onAccountSubmit = async (data: FormData) => {
        if (!user) return;
        try {
            const currentProfile = await getUserProfile(user.uid);
            const profileData: Partial<UserProfile> = {
                ...currentProfile,
                name: data.name,
                email: data.email,
            };
            await updateUserProfile(user.uid, profileData);
            toast({ title: "Success", description: "Account information updated." });
        } catch (error) {
            toast({ title: "Error", description: "Could not update account information.", variant: "destructive" });
        }
    };
    
    const onGoalsSubmit = async (data: FormData) => {
        if (!user) return;
        try {
            const currentProfile = await getUserProfile(user.uid);
            const profileData: Partial<UserProfile> = {
                ...currentProfile,
                healthGoals: {
                    primaryGoal: data.goal,
                    dailyCalories: Number(data.dailyCalories),
                    dailyProtein: Number(data.dailyProtein),
                    dailyCarbs: Number(data.dailyCarbs),
                    dailyFats: Number(data.dailyFats),
                }
            };
            await updateUserProfile(user.uid, profileData);
            toast({ title: "Success", description: "Health & Nutrition goals updated." });
        } catch (error) {
            toast({ title: "Error", description: "Could not update goals.", variant: "destructive" });
        }
    };

    if (loading) {
        return <ProfilePageSkeleton />;
    }

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
                    <AvatarImage src={user?.photoURL || "https://i.pravatar.cc/150"} alt={user?.displayName || ""} />
                    <AvatarFallback>{user?.displayName?.charAt(0) || user?.email?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <h2 className="text-xl font-semibold">{user?.displayName || "User"}</h2>
                    <p className="text-muted-foreground">{user?.email}</p>
                    <Button variant="outline" className="mt-4">Change Picture</Button>
                </CardContent>
            </Card>
        </div>

        <div className="lg:col-span-2 space-y-6">
            <form onSubmit={handleSubmit(onAccountSubmit)}>
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
                        <Button type="submit" disabled={isSubmitting}>Save Changes</Button>
                    </CardContent>
                </Card>
            </form>

            <form onSubmit={handleSubmit(onGoalsSubmit)}>
                <Card>
                    <CardHeader>
                        <CardTitle>Health & Nutrition Goals</CardTitle>
                        <CardDescription>Set your daily targets and preferences.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="goal">Primary Goal</Label>
                            <Controller
                                name="goal"
                                control={control}
                                render={({ field }) => (
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <SelectTrigger id="goal">
                                            <SelectValue placeholder="Select your goal" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="weight-loss">Weight Loss</SelectItem>
                                            <SelectItem value="muscle-gain">Muscle Gain</SelectItem>
                                            <SelectItem value="maintenance">Maintenance</SelectItem>
                                        </SelectContent>
                                    </Select>
                                )}
                            />
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
                        <Button type="submit" disabled={isSubmitting}>Update Goals</Button>
                    </CardContent>
                </Card>
            </form>
            
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

const ProfilePageSkeleton = () => (
    <div className="space-y-6">
        <div>
            <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
            <p className="text-muted-foreground">Manage your profile and settings.</p>
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-1 space-y-6">
                <Card>
                    <CardHeader><CardTitle>Your Profile</CardTitle></CardHeader>
                    <CardContent className="flex flex-col items-center text-center">
                        <Skeleton className="w-24 h-24 rounded-full mb-4" />
                        <Skeleton className="h-6 w-32 mb-2" />
                        <Skeleton className="h-4 w-48" />
                    </CardContent>
                </Card>
            </div>
            <div className="lg:col-span-2 space-y-6">
                <Card>
                    <CardHeader><CardTitle>Account Information</CardTitle><CardDescription>Update your personal details.</CardDescription></CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2"><Skeleton className="h-4 w-16" /><Skeleton className="h-10 w-full" /></div>
                        <div className="space-y-2"><Skeleton className="h-4 w-16" /><Skeleton className="h-10 w-full" /></div>
                        <Skeleton className="h-10 w-32" />
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader><CardTitle>Health & Nutrition Goals</CardTitle><CardDescription>Set your daily targets and preferences.</CardDescription></CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2"><Skeleton className="h-4 w-16" /><Skeleton className="h-10 w-full" /></div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2"><Skeleton className="h-4 w-24" /><Skeleton className="h-10 w-full" /></div>
                            <div className="space-y-2"><Skeleton className="h-4 w-24" /><Skeleton className="h-10 w-full" /></div>
                            <div className="space-y-2"><Skeleton className="h-4 w-24" /><Skeleton className="h-10 w-full" /></div>
                            <div className="space-y-2"><Skeleton className="h-4 w-24" /><Skeleton className="h-10 w-full" /></div>
                        </div>
                        <Skeleton className="h-10 w-32" />
                    </CardContent>
                </Card>
            </div>
        </div>
    </div>
);

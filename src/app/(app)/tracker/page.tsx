
"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { getDailyLog, addFoodToLog } from "@/services/nutritionService";
import { getUserProfile, UserProfile } from "@/services/userService";
import { DailyLog, FoodLogItem } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Utensils, Zap, Flame, Wheat } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import Image from 'next/image';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function NutritionTrackerPage() {
    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [dailyLog, setDailyLog] = useState<DailyLog | null>(null);
    const [loading, setLoading] = useState(true);

    const today = new Date().toISOString().split('T')[0];

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
                setLoading(true);
                const userProfile = await getUserProfile(currentUser.uid);
                setProfile(userProfile);
                const log = await getDailyLog(currentUser.uid, today);
                setDailyLog(log);
                setLoading(false);
            } else {
                setUser(null);
                setProfile(null);
                setDailyLog(null);
                setLoading(false);
            }
        });
        return () => unsubscribe();
    }, [today]);

    const dailyGoals = {
        calories: profile?.healthGoals.dailyCalories || 2000,
        protein: profile?.healthGoals.dailyProtein || 120,
        carbs: profile?.healthGoals.dailyCarbs || 250,
        fats: profile?.healthGoals.dailyFats || 60,
    };

    const dailyTotals = dailyLog?.totals || { calories: 0, protein: 0, carbs: 0, fats: 0 };
    
    const loggedMeals: (FoodLogItem & { mealType: string })[] = dailyLog ?
        Object.entries(dailyLog.meals).flatMap(([mealType, items]) =>
            items.map(item => ({ ...item, mealType: mealType.charAt(0).toUpperCase() + mealType.slice(1) }))
        ) : [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Nutrition Tracker</h1>
          <p className="text-muted-foreground">Log your meals and track your daily progress for {new Date().toLocaleDateString()}</p>
        </div>
        <Button size="lg">
          <PlusCircle className="mr-2 h-5 w-5" />
          Log a Meal
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Today's Summary</CardTitle>
          <CardDescription>Your progress towards your daily goals.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6 md:grid-cols-2">
          {/* Progress Bars */}
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="font-medium text-sm flex items-center"><Flame className="mr-2 h-4 w-4 text-orange-500" />Calories</span>
                <span className="text-sm text-muted-foreground">{dailyTotals.calories.toFixed(0)} / {dailyGoals.calories} kcal</span>
              </div>
              <Progress value={(dailyTotals.calories / (dailyGoals.calories || 1)) * 100} />
            </div>
             <div>
              <div className="flex justify-between mb-1">
                <span className="font-medium text-sm flex items-center"><Zap className="mr-2 h-4 w-4 text-green-500" />Protein</span>
                <span className="text-sm text-muted-foreground">{dailyTotals.protein.toFixed(0)} / {dailyGoals.protein} g</span>
              </div>
              <Progress value={(dailyTotals.protein / (dailyGoals.protein || 1)) * 100} className="[&>div]:bg-green-500" />
            </div>
             <div>
              <div className="flex justify-between mb-1">
                <span className="font-medium text-sm flex items-center"><Wheat className="mr-2 h-4 w-4 text-yellow-500" />Carbs</span>
                <span className="text-sm text-muted-foreground">{dailyTotals.carbs.toFixed(0)} / {dailyGoals.carbs} g</span>
              </div>
              <Progress value={(dailyTotals.carbs / (dailyGoals.carbs || 1)) * 100} className="[&>div]:bg-yellow-500" />
            </div>
             <div>
              <div className="flex justify-between mb-1">
                <span className="font-medium text-sm flex items-center"><Utensils className="mr-2 h-4 w-4 text-blue-500" />Fats</span>
                <span className="text-sm text-muted-foreground">{dailyTotals.fats.toFixed(0)} / {dailyGoals.fats} g</span>
              </div>
              <Progress value={(dailyTotals.fats / (dailyGoals.fats || 1)) * 100} className="[&>div]:bg-blue-500" />
            </div>
          </div>
          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-4">
             <Card className="text-center">
                <CardHeader className="p-4 pb-2">
                    <CardTitle className="text-sm font-medium">Calories Left</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                    <p className="text-2xl font-bold">{(dailyGoals.calories - dailyTotals.calories).toFixed(0)}</p>
                    <p className="text-xs text-muted-foreground">kcal</p>
                </CardContent>
             </Card>
             <Card className="text-center">
                <CardHeader className="p-4 pb-2">
                    <CardTitle className="text-sm font-medium">Protein Goal</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                    <p className="text-2xl font-bold">{((dailyTotals.protein / (dailyGoals.protein || 1)) * 100).toFixed(0)}%</p>
                    <p className="text-xs text-muted-foreground">of {dailyGoals.protein}g</p>
                </CardContent>
             </Card>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Today's Log</CardTitle>
          <CardDescription>Meals you've logged today.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Meal</TableHead>
                <TableHead>Food</TableHead>
                <TableHead className="text-right">Calories</TableHead>
                <TableHead className="text-right">Protein</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loggedMeals.length > 0 ? loggedMeals.map((item, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{item.mealType}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Image src={item.image || `https://picsum.photos/seed/${item.name}/40`} alt={item.name} width={40} height={40} className="rounded-md object-cover" data-ai-hint="meal image" />
                      <span>{item.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">{item.calories} kcal</TableCell>
                  <TableCell className="text-right">{item.protein} g</TableCell>
                </TableRow>
              )) : (
                <TableRow>
                    <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                        No meals logged yet today.
                    </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

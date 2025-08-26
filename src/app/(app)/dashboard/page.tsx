"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Utensils, Zap, Book, Calendar, PlusCircle, Bot, Plus } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  ChartContainer,
  ChartConfig,
} from "@/components/ui/chart";
import { Pie, PieChart, Cell } from "recharts";
import { RecipeCard } from "@/components/recipe-card";
import { mockRecipes } from "@/lib/mock-data";
import Link from "next/link";
import { useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { getUserProfile, UserProfile } from "@/services/userService";
import { getRecipes } from "@/services/recipeService";
import { Recipe } from "@/lib/types";
import { getDailyLog } from "@/services/nutritionService";
import { DailyLog } from "@/lib/types";

const chartConfig = {
  calories: { label: "Calories" },
  protein: { label: "Protein" },
  carbs: { label: "Carbs" },
  fats: { label: "Fats" },
} satisfies ChartConfig;

export default function Dashboard() {
    const [user, setUser] = useState<User | null>(null);
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [recentRecipes, setRecentRecipes] = useState<Recipe[]>([]);
    const [dailyLog, setDailyLog] = useState<DailyLog | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
                const profile = await getUserProfile(currentUser.uid);
                setUserProfile(profile);

                const recipes = await getRecipes(currentUser.uid);
                setRecentRecipes(recipes.slice(0, 5));

                const today = new Date().toISOString().split('T')[0];
                const log = await getDailyLog(currentUser.uid, today);
                setDailyLog(log);

            } else {
                setUser(null);
                setUserProfile(null);
                setRecentRecipes([]);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const nutritionData = {
        calories: { consumed: dailyLog?.totals.calories || 0, target: userProfile?.healthGoals.dailyCalories || 2000, color: "hsl(var(--chart-1))" },
        protein: { consumed: dailyLog?.totals.protein || 0, target: userProfile?.healthGoals.dailyProtein || 120, color: "hsl(var(--chart-2))" },
        carbs: { consumed: dailyLog?.totals.carbs || 0, target: userProfile?.healthGoals.dailyCarbs || 250, color: "hsl(var(--chart-3))" },
        fats: { consumed: dailyLog?.totals.fats || 0, target: userProfile?.healthGoals.dailyFats || 60, color: "hsl(var(--chart-4))" },
    };


  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome back, {userProfile?.name || 'User'}!</h1>
          <p className="text-muted-foreground">Here's your summary for {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}.</p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Daily Calories</CardTitle>
            <Utensils className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{nutritionData.calories.consumed.toFixed(0)} / {nutritionData.calories.target} kcal</div>
            <p className="text-xs text-muted-foreground">{(nutritionData.calories.target - nutritionData.calories.consumed).toFixed(0)} kcal remaining</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Protein Intake</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{nutritionData.protein.consumed.toFixed(0)}g / {nutritionData.protein.target}g</div>
            <p className="text-xs text-muted-foreground">{nutritionData.protein.target > 0 ? ((nutritionData.protein.consumed / nutritionData.protein.target) * 100).toFixed(0) : 0}% of goal</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recipes Saved</CardTitle>
            <Book className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{recentRecipes.length}</div>
            <p className="text-xs text-muted-foreground">{recentRecipes.filter(r => r.isFavorite).length} favorites</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Meals Planned</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Coming Soon</div>
            <p className="text-xs text-muted-foreground">Plan your week</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Recipes */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Recipes</CardTitle>
            <CardDescription>Your latest culinary creations and finds.</CardDescription>
          </CardHeader>
          <CardContent>
             {recentRecipes.length > 0 ? (
                <Carousel opts={{ align: "start", loop: true }} className="w-full">
                  <CarouselContent>
                    {recentRecipes.map((recipe) => (
                      <CarouselItem key={recipe.id} className="md:basis-1/2">
                        <div className="p-1">
                          <RecipeCard recipe={recipe} />
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious className="hidden sm:flex" />
                  <CarouselNext className="hidden sm:flex" />
                </Carousel>
             ) : (
                <div className="text-center text-muted-foreground py-8">
                    <p>No recipes found.</p>
                    <Button asChild variant="link"><Link href="/generator">Generate one now!</Link></Button>
                </div>
             )}
          </CardContent>
        </Card>

        {/* Today's Nutrition */}
        <Card>
          <CardHeader>
            <CardTitle>Today's Nutrition</CardTitle>
            <CardDescription>Your macronutrient breakdown.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(nutritionData).map(([key, value]) => {
                const consumed = value.consumed > 0 ? value.consumed : 0;
                const total = value.target > 0 ? value.target : 1;
                const remaining = total - consumed > 0 ? total - consumed : 0;
                
                const chartData = [
                  { name: 'consumed', value: consumed, fill: value.color },
                  { name: 'remaining', value: remaining, fill: 'var(--color-muted)' },
                ];
                return (
                  <div key={key} className="flex flex-col items-center gap-2">
                    <div className="relative w-24 h-24">
                      <ChartContainer config={chartConfig} className="absolute inset-0">
                        <PieChart>
                          <Pie
                            data={chartData}
                            dataKey="value"
                            nameKey="name"
                            innerRadius={25}
                            outerRadius={35}
                            startAngle={90}
                            endAngle={450}
                          >
                            {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.fill} stroke={entry.fill}/>
                            ))}
                          </Pie>
                        </PieChart>
                      </ChartContainer>
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                        <p className="font-bold text-lg">{value.consumed.toFixed(0)}</p>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground capitalize">{key}</p>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Quick Actions & Upcoming Meals */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
              <Button asChild size="lg"><Link href="/tracker"><PlusCircle /> Log Food</Link></Button>
              <Button asChild size="lg" variant="secondary"><Link href="/recipes"><Plus /> Add Recipe</Link></Button>
              <Button asChild size="lg" variant="secondary"><Link href="/generator"><Bot /> Generate Recipe</Link></Button>
              <Button asChild size="lg" variant="secondary"><Link href="/planner"><Calendar /> Plan Meal</Link></Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Meals</CardTitle>
            <CardDescription>What's on the menu for the rest of the day.</CardDescription>
          </CardHeader>
          <CardContent>
             <ul className="space-y-4">
                <li className="flex items-center">
                    <div className="bg-primary/20 text-primary rounded-full w-10 h-10 flex items-center justify-center font-bold mr-4">L</div>
                    <div>
                        <p className="font-semibold">Lunch (1:00 PM)</p>
                        <p className="text-sm text-muted-foreground">Grilled Chicken Salad</p>
                    </div>
                    <p className="ml-auto font-medium">450 kcal</p>
                </li>
                 <li className="flex items-center">
                    <div className="bg-primary/20 text-primary rounded-full w-10 h-10 flex items-center justify-center font-bold mr-4">D</div>
                    <div>
                        <p className="font-semibold">Dinner (7:00 PM)</p>
                        <p className="text-sm text-muted-foreground">Keto-friendly Salmon</p>
                    </div>
                    <p className="ml-auto font-medium">550 kcal</p>
                </li>
             </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

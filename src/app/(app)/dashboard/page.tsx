"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Utensils, Heart, Book, Calendar, PlusCircle, Bot, Zap, Plus } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartConfig,
} from "@/components/ui/chart";
import { Pie, PieChart, Cell } from "recharts";
import { RecipeCard } from "@/components/recipe-card";
import { mockRecipes } from "@/lib/mock-data";

const chartConfig = {
  calories: { label: "Calories" },
  protein: { label: "Protein" },
  carbs: { label: "Carbs" },
  fats: { label: "Fats" },
} satisfies ChartConfig;

const nutritionData = {
  calories: { consumed: 1250, target: 2000, color: "hsl(var(--chart-1))" },
  protein: { consumed: 80, target: 120, color: "hsl(var(--chart-2))" },
  carbs: { consumed: 150, target: 250, color: "hsl(var(--chart-3))" },
  fats: { consumed: 40, target: 60, color: "hsl(var(--chart-4))" },
};

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome back, Alex!</h1>
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
            <div className="text-2xl font-bold">1,250 / 2,000 kcal</div>
            <p className="text-xs text-muted-foreground">750 kcal remaining</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Protein Intake</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">80g / 120g</div>
            <p className="text-xs text-muted-foreground">67% of goal</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recipes Saved</CardTitle>
            <Book className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+34</div>
            <p className="text-xs text-muted-foreground">12 favorites</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Meals Planned</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5 this week</div>
            <p className="text-xs text-muted-foreground">2 meals for today</p>
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
            <Carousel opts={{ align: "start", loop: true }} className="w-full">
              <CarouselContent>
                {mockRecipes.slice(0, 5).map((recipe) => (
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
                const chartData = [
                  { name: 'consumed', value: value.consumed, fill: value.color },
                  { name: 'remaining', value: value.target - value.consumed, fill: 'var(--color-muted)' },
                ];
                return (
                  <div key={key} className="flex flex-col items-center">
                    <ChartContainer config={chartConfig} className="w-full h-24 aspect-square">
                      <PieChart accessibilityLayer>
                        <Pie
                          data={chartData}
                          dataKey="value"
                          nameKey="name"
                          innerRadius={25}
                          outerRadius={35}
                          startAngle={90}
                          endAngle={450}
                          cy="50%"
                        >
                          {chartData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.fill} stroke={entry.fill}/>
                          ))}
                        </Pie>
                      </PieChart>
                    </ChartContainer>
                    <div className="text-center -mt-10">
                      <p className="font-bold text-lg">{value.consumed}</p>
                      <p className="text-xs text-muted-foreground capitalize">{key}</p>
                    </div>
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
              <Button size="lg"><PlusCircle className="mr-2 h-4 w-4" /> Log Food</Button>
              <Button size="lg" variant="secondary"><Plus className="mr-2 h-4 w-4" /> Add Recipe</Button>
              <Button size="lg" variant="secondary"><Bot className="mr-2 h-4 w-4" /> Generate Recipe</Button>
              <Button size="lg" variant="secondary"><Calendar className="mr-2 h-4 w-4" /> Plan Meal</Button>
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

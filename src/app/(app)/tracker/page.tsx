
"use client";

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

const dailyGoals = {
  calories: 2000,
  protein: 120,
  carbs: 250,
  fats: 60,
};

const loggedMeals = [
  { meal: 'Breakfast', name: 'Classic Avocado Toast', calories: 250, protein: 8, image: 'https://picsum.photos/100/100' },
  { meal: 'Lunch', name: 'Grilled Chicken Salad', calories: 450, protein: 40, image: 'https://picsum.photos/101/101' },
];

const dailyTotals = loggedMeals.reduce((acc, meal) => {
  acc.calories += meal.calories;
  acc.protein += meal.protein;
  // Mock carbs and fats for demonstration
  acc.carbs += meal.calories * 0.45;
  acc.fats += meal.calories * 0.15;
  return acc;
}, { calories: 0, protein: 0, carbs: 0, fats: 0 });


export default function NutritionTrackerPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Nutrition Tracker</h1>
          <p className="text-muted-foreground">Log your meals and track your daily progress.</p>
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
              <Progress value={(dailyTotals.calories / dailyGoals.calories) * 100} />
            </div>
             <div>
              <div className="flex justify-between mb-1">
                <span className="font-medium text-sm flex items-center"><Zap className="mr-2 h-4 w-4 text-green-500" />Protein</span>
                <span className="text-sm text-muted-foreground">{dailyTotals.protein.toFixed(0)} / {dailyGoals.protein} g</span>
              </div>
              <Progress value={(dailyTotals.protein / dailyGoals.protein) * 100} className="[&>div]:bg-green-500" />
            </div>
             <div>
              <div className="flex justify-between mb-1">
                <span className="font-medium text-sm flex items-center"><Wheat className="mr-2 h-4 w-4 text-yellow-500" />Carbs</span>
                <span className="text-sm text-muted-foreground">{dailyTotals.carbs.toFixed(0)} / {dailyGoals.carbs} g</span>
              </div>
              <Progress value={(dailyTotals.carbs / dailyGoals.carbs) * 100} className="[&>div]:bg-yellow-500" />
            </div>
             <div>
              <div className="flex justify-between mb-1">
                <span className="font-medium text-sm flex items-center"><Utensils className="mr-2 h-4 w-4 text-blue-500" />Fats</span>
                <span className="text-sm text-muted-foreground">{dailyTotals.fats.toFixed(0)} / {dailyGoals.fats} g</span>
              </div>
              <Progress value={(dailyTotals.fats / dailyGoals.fats) * 100} className="[&>div]:bg-blue-500" />
            </div>
          </div>
          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-4">
             <Card className="text-center">
                <CardHeader className="p-4 pb-2">
                    <CardTitle className="text-sm font-medium">Calories Left</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                    <p className="text-2xl font-bold">{dailyGoals.calories - dailyTotals.calories.toFixed(0)}</p>
                    <p className="text-xs text-muted-foreground">kcal</p>
                </CardContent>
             </Card>
             <Card className="text-center">
                <CardHeader className="p-4 pb-2">
                    <CardTitle className="text-sm font-medium">Protein Goal</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                    <p className="text-2xl font-bold">{((dailyTotals.protein / dailyGoals.protein) * 100).toFixed(0)}%</p>
                    <p className="text-xs text-muted-foreground">of 120g</p>
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
              {loggedMeals.map((item, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{item.meal}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Image src={item.image} alt={item.name} width={40} height={40} className="rounded-md object-cover" data-ai-hint="meal image" />
                      <span>{item.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">{item.calories} kcal</TableCell>
                  <TableCell className="text-right">{item.protein} g</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

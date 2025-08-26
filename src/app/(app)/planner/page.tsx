
"use client"

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { Recipe } from '@/lib/types';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { getMealPlan, saveMealPlan } from "@/services/mealPlanService";
import { getWeekId } from "@/lib/utils";

type MealSlot = 'Breakfast' | 'Lunch' | 'Dinner';
type Day = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';

const daysOfWeek: Day[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const mealSlots: MealSlot[] = ['Breakfast', 'Lunch', 'Dinner'];

type PlannedMeals = Record<Day, Record<MealSlot, Recipe | null>>;

export default function MealPlannerPage() {
    const [user, setUser] = useState<User | null>(null);
    const [plannedMeals, setPlannedMeals] = useState<PlannedMeals | null>(null);
    const [loading, setLoading] = useState(true);
    const [currentWeekId, setCurrentWeekId] = useState(getWeekId(new Date()));

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
                setLoading(true);
                const plan = await getMealPlan(currentUser.uid, currentWeekId);
                setPlannedMeals(plan?.days || {
                    Monday: { Breakfast: null, Lunch: null, Dinner: null },
                    Tuesday: { Breakfast: null, Lunch: null, Dinner: null },
                    Wednesday: { Breakfast: null, Lunch: null, Dinner: null },
                    Thursday: { Breakfast: null, Lunch: null, Dinner: null },
                    Friday: { Breakfast: null, Lunch: null, Dinner: null },
                    Saturday: { Breakfast: null, Lunch: null, Dinner: null },
                    Sunday: { Breakfast: null, Lunch: null, Dinner: null },
                });
                setLoading(false);
            } else {
                setUser(null);
                setPlannedMeals(null);
            }
        });
        return () => unsubscribe();
    }, [currentWeekId]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Meal Planner</h1>
          <p className="text-muted-foreground">Drag and drop recipes to plan your week.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon"><ChevronLeft className="h-4 w-4" /></Button>
          <span className="font-semibold">{currentWeekId}</span>
          <Button variant="outline" size="icon"><ChevronRight className="h-4 w-4" /></Button>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <div className="grid grid-cols-7 min-w-[1200px] gap-4">
          {daysOfWeek.map(day => (
            <div key={day} className="space-y-4">
              <h2 className="text-lg font-semibold text-center">{day}</h2>
              {mealSlots.map(slot => (
                <Card key={slot} className="h-48 flex flex-col">
                  <CardHeader className="p-3">
                    <CardTitle className="text-sm font-medium">{slot}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-3 pt-0 flex-grow flex items-center justify-center">
                    {plannedMeals && plannedMeals[day][slot] ? (
                       <div className="w-full text-center">
                        <Image src={plannedMeals[day][slot]!.image} alt={plannedMeals[day][slot]!.name} width={100} height={60} className="w-full h-16 object-cover rounded-md mb-2" data-ai-hint="recipe image" />
                        <p className="text-xs font-medium leading-tight">{plannedMeals[day][slot]!.name}</p>
                        <Badge variant="outline" className="mt-1">{plannedMeals[day][slot]!.calories} kcal</Badge>
                       </div>
                    ) : (
                      <Button variant="ghost" className="w-full h-full flex-col">
                        <PlusCircle className="h-6 w-6 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground mt-1">Add Meal</span>
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

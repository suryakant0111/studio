
"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { getRecipes } from "@/services/recipeService";
import { Recipe } from "@/lib/types";
import { RecipeCard } from '@/components/recipe-card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Search, PlusCircle, ListFilter, X } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function MyRecipesPage() {
  const [user, setUser] = useState<User | null>(null);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setLoading(true);
        const userRecipes = await getRecipes(currentUser.uid);
        setRecipes(userRecipes);
        setLoading(false);
      } else {
        setUser(null);
        setRecipes([]);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Recipes</h1>
          <p className="text-muted-foreground">Browse, filter, and manage your recipe collection.</p>
        </div>
        <div className="flex items-center gap-2">
            <Button size="lg" asChild>
              <Link href="/recipes/new">
                <PlusCircle className="mr-2 h-5 w-5" />
                Add Recipe
              </Link>
            </Button>
             <Button size="lg" asChild variant="secondary">
              <Link href="/generator">
                Generate with AI
              </Link>
            </Button>
        </div>
      </div>

      {/* Filter Section */}
      <div className="p-4 bg-card rounded-lg border space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          <div className="relative sm:col-span-2 md:col-span-3 lg:col-span-2 xl:col-span-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input placeholder="Search recipes..." className="pl-10" />
          </div>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="breakfast">Breakfast</SelectItem>
              <SelectItem value="lunch">Lunch</SelectItem>
              <SelectItem value="dinner">Dinner</SelectItem>
              <SelectItem value="snack">Snack</SelectItem>
              <SelectItem value="pre-workout">Pre-workout</SelectItem>
              <SelectItem value="post-workout">Post-workout</SelectItem>
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Any Diet" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Any Diet</SelectItem>
              <SelectItem value="vegetarian">Vegetarian</SelectItem>
              <SelectItem value="vegan">Vegan</SelectItem>
              <SelectItem value="keto">Keto</SelectItem>
              <SelectItem value="high-protein">High-protein</SelectItem>
              <SelectItem value="low-carb">Low-carb</SelectItem>
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Difficulty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Any Difficulty</SelectItem>
              <SelectItem value="easy">Easy</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="hard">Hard</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="w-full">
              <X className="mr-2 h-4 w-4" />
              Clear
            </Button>
          </div>
        </div>
      </div>
      
      {/* Sorting */}
      <div className="flex justify-end">
         <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline">
                    <ListFilter className="mr-2 h-4 w-4" />
                    Sort by
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>Sort by</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Date added</DropdownMenuItem>
                <DropdownMenuItem>Name</DropdownMenuItem>
                <DropdownMenuItem>Cook time</DropdownMenuItem>
                <DropdownMenuItem>Calories</DropdownMenuItem>
            </DropdownMenuContent>
         </DropdownMenu>
      </div>


      {/* Recipe Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <Card key={i}>
              <CardHeader><Skeleton className="h-48 w-full" /></CardHeader>
              <CardContent className="space-y-2">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : recipes.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {recipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <h3 className="text-xl font-semibold">No Recipes Yet</h3>
          <p className="text-muted-foreground mt-2">You haven't added any recipes to your collection.</p>
          <Button asChild className="mt-4">
            <Link href="/recipes/new">Create a Recipe</Link>
          </Button>
        </div>
      )}
      
      {/* Pagination */}
      {recipes.length > 12 && (
        <div className="flex justify-center">
          <Button variant="outline">Load More</Button>
        </div>
      )}
    </div>
  );
}

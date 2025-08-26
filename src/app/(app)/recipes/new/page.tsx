
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { addRecipe } from "@/services/recipeService";
import { useEffect, useState } from "react";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { PlusCircle, Loader2 } from "lucide-react";

const recipeSchema = z.object({
  name: z.string().min(3, "Recipe name is required"),
  category: z.string().min(1, "Please select a category"),
  cookTime: z.coerce.number().min(1, "Cook time must be at least 1 minute"),
  servings: z.coerce.number().min(1, "Servings must be at least 1"),
  difficulty: z.string().min(1, "Please select a difficulty"),
  calories: z.coerce.number().min(0),
  protein: z.coerce.number().min(0),
  ingredients: z.string().min(10, "Please list ingredients"),
  instructions: z.string().min(10, "Please provide instructions"),
});

type RecipeFormData = z.infer<typeof recipeSchema>;

export default function NewRecipePage() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const form = useForm<RecipeFormData>({
    resolver: zodResolver(recipeSchema),
    defaultValues: {
      name: "",
      category: "Dinner",
      cookTime: 30,
      servings: 2,
      difficulty: "Medium",
      calories: 0,
      protein: 0,
    },
  });

  const { isSubmitting } = form.formState;

  async function onSubmit(values: RecipeFormData) {
    if (!user) {
        toast({ title: "Error", description: "You must be logged in to create a recipe.", variant: "destructive" });
        return;
    }
    try {
      await addRecipe(user.uid, {
        name: values.name,
        category: values.category as any,
        cookTime: values.cookTime,
        servings: values.servings,
        difficulty: values.difficulty as any,
        calories: values.calories,
        protein: values.protein,
        ingredients: values.ingredients.split('\n').filter(line => line.trim() !== ''),
        instructions: values.instructions.split('\n').filter(line => line.trim() !== ''),
        isFavorite: false,
        source: 'user-added',
        // Default values for fields not in the form
        image: `https://picsum.photos/seed/${encodeURIComponent(values.name)}/600/400`,
        diet: [],
        nutritionInfo: `Calories: ${values.calories}, Protein: ${values.protein}g`
      });
      toast({ title: "Success!", description: `Recipe "${values.name}" has been saved.` });
      router.push("/recipes");
    } catch (error) {
        console.error("Error saving recipe:", error);
        toast({ title: "Error", description: "Could not save recipe.", variant: "destructive" });
    }
  }


  return (
    <div className="space-y-6">
       <div>
        <h1 className="text-3xl font-bold tracking-tight">Add a New Recipe</h1>
        <p className="text-muted-foreground">Manually enter the details of your recipe below.</p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recipe Details</CardTitle>
              <CardDescription>Fill in the basic information about your recipe.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Recipe Name</FormLabel>
                    <FormControl><Input placeholder="e.g., Classic Chicken Soup" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger><SelectValue placeholder="Select a category" /></SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Breakfast">Breakfast</SelectItem>
                          <SelectItem value="Lunch">Lunch</SelectItem>
                          <SelectItem value="Dinner">Dinner</SelectItem>
                          <SelectItem value="Snack">Snack</SelectItem>
                          <SelectItem value="Pre-workout">Pre-workout</SelectItem>
                          <SelectItem value="Post-workout">Post-workout</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="cookTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cook Time (minutes)</FormLabel>
                      <FormControl><Input type="number" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="servings"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Servings</FormLabel>
                      <FormControl><Input type="number" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

           <Card>
            <CardHeader>
              <CardTitle>Nutrition & Difficulty</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                 <FormField
                  control={form.control}
                  name="difficulty"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Difficulty</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger><SelectValue placeholder="Select difficulty" /></SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Easy">Easy</SelectItem>
                          <SelectItem value="Medium">Medium</SelectItem>
                          <SelectItem value="Hard">Hard</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="calories"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Calories (kcal)</FormLabel>
                      <FormControl><Input type="number" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="protein"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Protein (g)</FormLabel>
                      <FormControl><Input type="number" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
               </div>
            </CardContent>
           </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Ingredients & Instructions</CardTitle>
                </CardHeader>
                <CardContent className="grid md:grid-cols-2 gap-6">
                    <FormField
                    control={form.control}
                    name="ingredients"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Ingredients</FormLabel>
                            <FormControl><Textarea placeholder="List each ingredient on a new line..." {...field} rows={8} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name="instructions"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Instructions</FormLabel>
                            <FormControl><Textarea placeholder="List each step on a new line..." {...field} rows={8} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                    />
                </CardContent>
            </Card>

            <div className="flex justify-end gap-4">
                <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <PlusCircle className="mr-2 h-4 w-4" />}
                    Save Recipe
                </Button>
            </div>
        </form>
      </Form>
    </div>
  );
}

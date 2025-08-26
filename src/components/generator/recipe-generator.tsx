"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { generateRecipe } from "@/ai/flows/generate-recipe";
import type { GenerateRecipeOutput } from "@/ai/flows/generate-recipe";
import { modifyRecipe } from "@/ai/flows/modify-recipe";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { addRecipe } from "@/services/recipeService";


import {
  Dumbbell,
  Target,
  Zap,
  RefreshCw,
  Apple,
  Clock,
  Loader2,
  Sparkles,
  ChevronDown,
  ChefHat,
  Flame,
  CheckCircle2,
  Wand2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Separator } from "../ui/separator";
import { Input } from "../ui/input";

const purposeOptions = [
  { id: "muscle-gain", label: "Muscle Gain", icon: Dumbbell },
  { id: "weight-loss", label: "Weight Loss", icon: Target },
  { id: "energy-boost", label: "Energy Boost", icon: Zap },
  { id: "post-workout", label: "Post-Workout", icon: RefreshCw },
  { id: "healthy-snack", label: "Healthy Snack", icon: Apple },
  { id: "quick-meal", label: "Quick Meal", icon: Clock },
];

const dietaryOptions = [
  { id: "vegetarian", label: "Vegetarian" },
  { id: "vegan", label: "Vegan" },
  { id: "keto", label: "Keto" },
  { id: "gluten-free", label: "Gluten-Free" },
  { id: "dairy-free", label: "Dairy-Free" },
];

const formSchema = z.object({
  purpose: z.string().min(1, "Please select a purpose"),
  numPeople: z.number().min(1).max(8),
  availableTime: z.number().min(5).max(120),
  dietaryRestrictions: z.array(z.string()).optional(),
  ingredients: z.string().min(3, "Please list at least one ingredient"),
  cuisinePreference: z.string().optional(),
  cookingSkillLevel: z.enum(["beginner", "intermediate", "advanced"]),
});

type FormData = z.infer<typeof formSchema>;

export function RecipeGenerator() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isRefining, setIsRefining] = useState(false);
  const [refineInstruction, setRefineInstruction] = useState("");
  const [generatedRecipe, setGeneratedRecipe] = useState<GenerateRecipeOutput | null>(null);
  const { toast } = useToast();

  useState(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        setUser(currentUser);
    });
    return () => unsubscribe();
  });

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      numPeople: 2,
      availableTime: 30,
      dietaryRestrictions: [],
      cookingSkillLevel: "intermediate",
      ingredients: "",
      cuisinePreference: "any",
    },
  });

  async function onSubmit(values: FormData) {
    setIsLoading(true);
    setGeneratedRecipe(null);
    try {
      const result = await generateRecipe({
        ...values,
        dietaryRestrictions: values.dietaryRestrictions?.join(', '),
      });
      setGeneratedRecipe(result);
    } catch (error) {
      console.error("Error generating recipe:", error);
      toast({
        title: "Error",
        description: "Failed to generate recipe. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function handleRefineRecipe() {
    if (!generatedRecipe || !refineInstruction) return;
    setIsRefining(true);
    try {
      const result = await modifyRecipe({
        recipe: generatedRecipe,
        instruction: refineInstruction,
      });
      setGeneratedRecipe(result);
      setRefineInstruction("");
    } catch (error) {
      console.error("Error refining recipe:", error);
      toast({
        title: "Error",
        description: "Failed to refine recipe. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsRefining(false);
    }
  }
  
  async function handleSaveRecipe() {
    if (!user || !generatedRecipe) return;
    setIsSaving(true);
    try {
        const [calories, protein] = generatedRecipe.nutritionInfo.match(/\d+/g) || ["0", "0"];
        
        await addRecipe(user.uid, {
            name: generatedRecipe.recipeName,
            ingredients: generatedRecipe.ingredients,
            instructions: generatedRecipe.instructions,
            nutritionInfo: generatedRecipe.nutritionInfo,
            calories: parseInt(calories),
            protein: parseInt(protein),
            category: "Dinner", // default category for now
            cookTime: form.getValues("availableTime"),
            servings: form.getValues("numPeople"),
            difficulty: "Medium", // default difficulty
            diet: form.getValues("dietaryRestrictions") || [],
            isFavorite: false,
            source: 'ai-generated'
        });
        
        toast({
            title: "Recipe Saved!",
            description: `${generatedRecipe.recipeName} has been added to your collection.`,
        });
        setGeneratedRecipe(null);

    } catch (error) {
        console.error("Error saving recipe:", error);
        toast({
            title: "Error",
            description: "Could not save recipe.",
            variant: "destructive",
        });
    } finally {
        setIsSaving(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>What are you cooking for?</CardTitle>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="purpose"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {purposeOptions.map((option) => (
                          <button
                            key={option.id}
                            type="button"
                            onClick={() => field.onChange(option.label)}
                            className={cn(
                              "p-4 border rounded-lg text-center transition-colors hover:bg-accent hover:text-accent-foreground",
                              field.value === option.label ? "bg-primary text-primary-foreground border-primary" : "bg-card"
                            )}
                          >
                            <option.icon className="w-8 h-8 mx-auto mb-2" />
                            <span className="font-medium">{option.label}</span>
                          </button>
                        ))}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tell us more</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="numPeople"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Number of People: {field.value}</FormLabel>
                      <FormControl>
                        <Slider
                          min={1}
                          max={8}
                          step={1}
                          value={[field.value]}
                          onValueChange={(vals) => field.onChange(vals[0])}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="availableTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Available Time: {field.value} minutes</FormLabel>
                      <FormControl>
                        <Slider
                          min={5}
                          max={120}
                          step={5}
                          value={[field.value]}
                          onValueChange={(vals) => field.onChange(vals[0])}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="ingredients"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Available Ingredients</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., chicken breast, broccoli, rice, soy sauce"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Collapsible>
            <CollapsibleTrigger asChild>
              <Button variant="link" className="text-primary p-0">
                <ChevronDown className="w-4 h-4 mr-2" />
                Advanced Options
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-8 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Preferences & Restrictions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <FormField
                      control={form.control}
                      name="dietaryRestrictions"
                      render={() => (
                        <FormItem>
                          <FormLabel>Dietary Restrictions</FormLabel>
                           <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {dietaryOptions.map((item) => (
                              <FormField
                                key={item.id}
                                control={form.control}
                                name="dietaryRestrictions"
                                render={({ field }) => {
                                  return (
                                    <FormItem key={item.id} className="flex flex-row items-start space-x-3 space-y-0">
                                      <FormControl>
                                        <Checkbox
                                          checked={field.value?.includes(item.id)}
                                          onCheckedChange={(checked) => {
                                            return checked
                                              ? field.onChange([...(field.value || []), item.id])
                                              : field.onChange(
                                                  (field.value || []).filter(
                                                    (value) => value !== item.id
                                                  )
                                                )
                                          }}
                                        />
                                      </FormControl>
                                      <FormLabel className="font-normal">{item.label}</FormLabel>
                                    </FormItem>
                                  )
                                }}
                              />
                            ))}
                          </div>
                        </FormItem>
                      )}
                    />
                    <div className="grid md:grid-cols-2 gap-6">
                        <FormField
                            control={form.control}
                            name="cuisinePreference"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Cuisine Preference</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                        <SelectValue placeholder="Any Cuisine" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="any">Any</SelectItem>
                                        <SelectItem value="italian">Italian</SelectItem>
                                        <SelectItem value="mexican">Mexican</SelectItem>
                                        <SelectItem value="chinese">Chinese</SelectItem>
                                        <SelectItem value="indian">Indian</SelectItem>
                                    </SelectContent>
                                    </Select>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="cookingSkillLevel"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Cooking Skill Level</FormLabel>
                                    <FormControl>
                                    <RadioGroup
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                        className="flex space-x-4 pt-2"
                                    >
                                        <FormItem className="flex items-center space-x-2 space-y-0">
                                            <FormControl><RadioGroupItem value="beginner" /></FormControl>
                                            <FormLabel className="font-normal">Beginner</FormLabel>
                                        </FormItem>
                                        <FormItem className="flex items-center space-x-2 space-y-0">
                                            <FormControl><RadioGroupItem value="intermediate" /></FormControl>
                                            <FormLabel className="font-normal">Intermediate</FormLabel>
                                        </FormItem>
                                        <FormItem className="flex items-center space-x-2 space-y-0">
                                            <FormControl><RadioGroupItem value="advanced" /></FormControl>
                                            <FormLabel className="font-normal">Advanced</FormLabel>
                                        </FormItem>
                                    </RadioGroup>
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                    </div>
                </CardContent>
              </Card>
            </CollapsibleContent>
          </Collapsible>

          <div className="text-center">
            <Button type="submit" size="lg" disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : (
                <Sparkles className="mr-2 h-5 w-5" />
              )}
              Generate Recipe
            </Button>
          </div>
        </form>
      </Form>
      
      {isLoading && (
        <div className="text-center mt-8">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary"/>
            <p className="mt-2 text-muted-foreground">The AI chef is cooking something up...</p>
        </div>
      )}

      {generatedRecipe && !isRefining && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2"><ChefHat /> {generatedRecipe.recipeName}</CardTitle>
            <CardDescription className="flex items-center gap-2 pt-2"><Flame className="text-orange-500"/> {generatedRecipe.nutritionInfo}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Separator />
            <div className="grid md:grid-cols-3 gap-6">
              <div className="md:col-span-1">
                <h3 className="font-semibold text-lg mb-2">Ingredients</h3>
                <ul className="space-y-2">
                  {generatedRecipe.ingredients.map((ingredient, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 mt-1 text-primary flex-shrink-0" />
                      <span>{ingredient}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="md:col-span-2">
                <h3 className="font-semibold text-lg mb-2">Instructions</h3>
                <ol className="space-y-4">
                  {generatedRecipe.instructions.map((step, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="flex-shrink-0 bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center font-bold text-sm">
                        {index + 1}
                      </div>
                      <p>{step}</p>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
            
            <Separator />

            {/* Refine Section */}
            <div>
              <h3 className="font-semibold text-lg mb-2">Refine Recipe</h3>
              <p className="text-sm text-muted-foreground mb-4">Want to change something? Tell the AI what to do.</p>
              <div className="flex gap-2">
                <Input 
                  placeholder="e.g., 'Make it vegetarian' or 'Double the servings'"
                  value={refineInstruction}
                  onChange={(e) => setRefineInstruction(e.target.value)}
                />
                <Button onClick={handleRefineRecipe} disabled={isRefining || !refineInstruction}>
                    {isRefining ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Wand2 className="mr-2 h-4 w-4"/>}
                    Refine
                </Button>
              </div>
            </div>

            <div className="flex gap-4 pt-4">
                <Button onClick={handleSaveRecipe} disabled={isSaving || !user}>
                    {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save to My Recipes
                </Button>
                <Button variant="outline" onClick={() => setGeneratedRecipe(null)}>Clear</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {isRefining && (
          <div className="text-center mt-8">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary"/>
            <p className="mt-2 text-muted-foreground">The AI chef is refining your recipe...</p>
        </div>
      )}
    </div>
  );
}

import { RecipeGenerator } from "@/components/generator/recipe-generator";

export default function AiRecipeGeneratorPage() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight">AI Recipe Generator</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto mt-2">
          Tell our AI chef what you're looking for, and get a custom recipe in seconds. Let's get cooking!
        </p>
      </div>
      <RecipeGenerator />
    </div>
  );
}

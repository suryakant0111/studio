import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, Users, BarChart2, Heart, MoreVertical } from 'lucide-react';
import { Recipe } from '@/lib/types';
import { cn } from '@/lib/utils';

interface RecipeCardProps {
  recipe: Recipe;
  className?: string;
}

export function RecipeCard({ recipe, className }: RecipeCardProps) {
  return (
    <Card className={cn("overflow-hidden flex flex-col transition-transform transform hover:scale-105 hover:shadow-xl", className)}>
      <CardHeader className="p-0 relative">
        <Image
          src={recipe.image}
          alt={recipe.name}
          width={600}
          height={400}
          className="w-full h-48 object-cover"
          data-ai-hint="recipe image"
        />
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "absolute top-2 right-2 rounded-full bg-white/80 hover:bg-white",
            recipe.isFavorite ? 'text-red-500' : 'text-gray-500'
          )}
        >
          <Heart className="w-5 h-5" />
          <span className="sr-only">Favorite</span>
        </Button>
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <Badge variant="secondary" className="mb-2">{recipe.category}</Badge>
        <h3 className="text-lg font-semibold leading-tight mb-2">{recipe.name}</h3>
        <div className="flex items-center text-sm text-muted-foreground space-x-4">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{recipe.cookTime} min</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span>{recipe.servings}</span>
          </div>
          <div className="flex items-center gap-1">
            <BarChart2 className="w-4 h-4" />
            <span>{recipe.difficulty}</span>
          </div>
        </div>
        <div className="mt-2 text-sm">
          <span className="font-medium">{recipe.calories} kcal</span> &bull; <span className="font-medium">{recipe.protein}g protein</span>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between items-center">
        <Button>View</Button>
        <div>
          <Button variant="ghost" size="icon">
            <MoreVertical className="w-5 h-5" />
            <span className="sr-only">More options</span>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}

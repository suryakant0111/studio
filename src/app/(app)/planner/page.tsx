import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function MealPlannerPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Meal Planner</h1>
        <p className="text-muted-foreground">Plan your meals for the week ahead.</p>
      </div>
       <Card>
        <CardHeader>
          <CardTitle>Coming Soon</CardTitle>
        </CardHeader>
        <CardContent>
          <p>The interactive meal planner is currently in development. Check back soon for updates!</p>
        </CardContent>
      </Card>
    </div>
  );
}

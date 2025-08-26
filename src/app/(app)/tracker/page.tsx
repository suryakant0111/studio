import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function NutritionTrackerPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Nutrition Tracker</h1>
        <p className="text-muted-foreground">Log your meals and track your progress.</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Coming Soon</CardTitle>
        </CardHeader>
        <CardContent>
          <p>The full nutrition tracker is currently in development. Check back soon for updates!</p>
        </CardContent>
      </Card>
    </div>
  );
}

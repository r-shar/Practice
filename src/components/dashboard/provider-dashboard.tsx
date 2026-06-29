import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type ProviderDashboardProps = {
  therapistId: string;
};

export default function ProviderDashboard({
  therapistId,
}: ProviderDashboardProps) {
  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Provider Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Welcome to the provider dashboard</p>
          <p className="text-muted-foreground text-sm mt-2">
            Therapist ID: {therapistId}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";

const Subscriptions = () => (
  <div className="space-y-6">
    <div>
      <h1 className="text-3xl font-bold text-brand-purple">Subscriptions</h1>
      <p className="text-muted-foreground mt-1">Manage your Vointy Employer plan.</p>
    </div>
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Current plan: Free trial</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>30 days remaining. Unlimited users, teams and activities during trial.</p>
          <ul className="space-y-1 mt-3">
            {[
              "Unlimited employees",
              "Unlimited teams",
              "All activities",
              "Management dashboard",
              "Reporting",
              "No per-user fees",
            ].map((f) => (
              <li key={f} className="flex gap-2 items-center">
                <CheckCircle2 className="h-4 w-4 text-brand-purple" /> {f}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
      <Card className="border-brand-purple">
        <CardHeader>
          <CardTitle>Employer Panel — €149/month</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <ul className="space-y-1">
            {[
              "Unlimited employees",
              "Unlimited teams",
              "All activities",
              "Management dashboard",
              "Reporting",
              "No per-user fees",
            ].map((f) => (
              <li key={f} className="flex gap-2 items-center">
                <CheckCircle2 className="h-4 w-4 text-brand-purple" /> {f}
              </li>
            ))}
          </ul>
          <Button className="w-full bg-brand-purple hover:bg-brand-purple-dark">
            Upgrade to Employer Panel
          </Button>
        </CardContent>
      </Card>
    </div>
  </div>
);
export default Subscriptions;

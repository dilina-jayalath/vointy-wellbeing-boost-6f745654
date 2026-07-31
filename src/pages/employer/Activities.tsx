import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MyActivities } from "@/components/app/MyActivities";

const EmployerActivities = () => (
  <div className="space-y-6">
    <div>
      <h1 className="text-3xl font-bold text-brand-purple">Activities</h1>
      <p className="text-muted-foreground mt-1">
        Create company activities and invite employees individually or with a list.
      </p>
    </div>

    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Your activities</CardTitle>
      </CardHeader>
      <CardContent>
        <MyActivities />
      </CardContent>
    </Card>
  </div>
);

export default EmployerActivities;

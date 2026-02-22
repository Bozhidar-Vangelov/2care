import { createMetadata } from "@/lib/metadata";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export const metadata = createMetadata({
  title: "Create Account",
  description: "Create your free 2Care account and start tracking your baby's feeding, sleep, and milestones from day one.",
  path: "/register",
});

export default function RegisterPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Create an account</CardTitle>
        <CardDescription>Track your baby&apos;s milestones from day one</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">Registration form coming soon.</p>
      </CardContent>
    </Card>
  );
}

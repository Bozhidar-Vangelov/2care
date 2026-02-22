import { createMetadata } from "@/lib/metadata";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export const metadata = createMetadata({
  title: "Sign In",
  description:
    "Sign in to your 2Care account to track your baby's daily activities and milestones.",
  path: "/login",
});

export default function LoginPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Welcome back</CardTitle>
        <CardDescription>Sign in to your account</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">Login form coming soon.</p>
      </CardContent>
    </Card>
  );
}

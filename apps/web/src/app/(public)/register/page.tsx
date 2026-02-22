import type { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export const metadata: Metadata = { title: "Create account" };

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

import Link from "next/link";
import { createMetadata } from "@/lib/metadata";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export const metadata = createMetadata({
  title: "Add Baby",
  path: "/babies/new",
  noIndex: true,
});

export default function NewBabyPage() {
  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild className="shrink-0">
          <Link href="/babies" aria-label="Back to Babies">
            <span aria-hidden>←</span>
          </Link>
        </Button>
        <h1 className="text-xl font-semibold">Add Baby</h1>
      </div>

      <Separator />

      <Card>
        <CardHeader>
          <CardTitle>New Baby Profile</CardTitle>
          <CardDescription>
            Enter your baby&apos;s name, date of birth, and gender to get started.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Create form coming soon.</p>
        </CardContent>
      </Card>
    </div>
  );
}

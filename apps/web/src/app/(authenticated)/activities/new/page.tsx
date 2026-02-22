import Link from "next/link";
import { createMetadata } from "@/lib/metadata";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export const metadata = createMetadata({
  title: "Log Activity",
  path: "/activities/new",
  noIndex: true,
});

export default function NewActivityPage() {
  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild className="shrink-0">
          <Link href="/activities" aria-label="Back to Activities">
            <span aria-hidden>←</span>
          </Link>
        </Button>
        <h1 className="text-xl font-semibold">Log Activity</h1>
      </div>

      <Separator />

      <Card>
        <CardHeader>
          <CardTitle>New Activity</CardTitle>
          <CardDescription>
            Record a feeding, sleep, diaper change, or custom activity.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Log form coming soon.</p>
        </CardContent>
      </Card>
    </div>
  );
}

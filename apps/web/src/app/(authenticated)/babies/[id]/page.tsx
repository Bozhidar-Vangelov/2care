import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { createMetadata } from "@/lib/metadata";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface BabyPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: BabyPageProps): Promise<Metadata> {
  const { id } = await params;
  // TODO: fetch baby name from API and use it as the title
  return createMetadata({ title: `Baby Profile`, path: `/babies/${id}`, noIndex: true });
}

export default async function BabyPage({ params }: BabyPageProps) {
  const { id } = await params;

  // TODO: fetch baby by ID from API — redirect to not-found if null
  if (!id) notFound();

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <Button variant="ghost" size="icon" asChild className="shrink-0">
            <Link href="/babies" aria-label="Back to Babies">
              {/* ChevronLeft via CSS to avoid an extra import before real UI */}
              <span aria-hidden>←</span>
            </Link>
          </Button>
          <div className="min-w-0">
            <h1 className="text-xl font-semibold truncate">Baby Profile</h1>
            <p className="text-xs text-muted-foreground font-mono truncate">{id}</p>
          </div>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link href={`/babies/${id}/edit`}>Edit</Link>
        </Button>
      </div>

      <Separator />

      {/* Placeholder content */}
      <Card>
        <CardHeader>
          <CardTitle>Details</CardTitle>
          <CardDescription>
            Baby profile, photos, and recent activities will appear here.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Implementation coming soon.</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activities</CardTitle>
          <CardDescription>Latest logged activities for this baby.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Implementation coming soon.</p>
        </CardContent>
      </Card>
    </div>
  );
}

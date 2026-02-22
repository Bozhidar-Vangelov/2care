import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { createMetadata } from "@/lib/metadata";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface FamilyPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: FamilyPageProps): Promise<Metadata> {
  const { id } = await params;
  return createMetadata({ title: "Family", path: `/families/${id}`, noIndex: true });
}

export default async function FamilyPage({ params }: FamilyPageProps) {
  const { id } = await params;

  if (!id) notFound();

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <Button variant="ghost" size="icon" asChild className="shrink-0">
            <Link href="/families" aria-label="Back to Families">
              <span aria-hidden>←</span>
            </Link>
          </Button>
          <div className="min-w-0">
            <h1 className="text-xl font-semibold truncate">Family</h1>
            <p className="text-xs text-muted-foreground font-mono truncate">{id}</p>
          </div>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link href={`/families/${id}?invite=true`}>Invite</Link>
        </Button>
      </div>

      <Separator />

      <Card>
        <CardHeader>
          <CardTitle>Members</CardTitle>
          <CardDescription>Family members and their roles will appear here.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Implementation coming soon.</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Babies</CardTitle>
          <CardDescription>Babies linked to this family.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Implementation coming soon.</p>
        </CardContent>
      </Card>
    </div>
  );
}

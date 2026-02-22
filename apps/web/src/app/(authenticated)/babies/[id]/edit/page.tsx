import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { createMetadata } from "@/lib/metadata";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface EditBabyPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: EditBabyPageProps): Promise<Metadata> {
  const { id } = await params;
  return createMetadata({ title: "Edit Baby", path: `/babies/${id}/edit`, noIndex: true });
}

export default async function EditBabyPage({ params }: EditBabyPageProps) {
  const { id } = await params;

  if (!id) notFound();

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild className="shrink-0">
          <Link href={`/babies/${id}`} aria-label="Back to Baby Profile">
            <span aria-hidden>←</span>
          </Link>
        </Button>
        <div>
          <h1 className="text-xl font-semibold">Edit Baby</h1>
          <p className="text-xs text-muted-foreground font-mono">{id}</p>
        </div>
      </div>

      <Separator />

      <Card>
        <CardHeader>
          <CardTitle>Baby Information</CardTitle>
          <CardDescription>Update name, date of birth, gender, and profile photo.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Edit form coming soon.</p>
        </CardContent>
      </Card>
    </div>
  );
}

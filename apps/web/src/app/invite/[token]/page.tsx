import Link from "next/link";
import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface InvitePageProps {
  params: Promise<{ token: string }>;
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Family Invite | 2Care",
    description: "You have been invited to join a family on 2Care.",
    // Invite pages should not be indexed — tokens are single-use and
    // personal, and we don't want them to appear in search results.
    robots: { index: false, follow: false },
  };
}

export default async function InvitePage({ params }: InvitePageProps) {
  const { token } = await params;

  // TODO: call GET /api/v1/families/invite-info?token=... (or similar) to
  // fetch the family name + inviter name so the page can greet the user.
  // If the token is invalid/expired, call notFound() or show an error card.

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 p-6">
      {/* Brand mark */}
      <div className="text-center">
        <span className="text-2xl font-bold tracking-tight">2Care</span>
      </div>

      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle>You&apos;re invited!</CardTitle>
          <CardDescription>Someone has invited you to join their family on 2Care.</CardDescription>
        </CardHeader>

        <CardContent className="space-y-3 text-center">
          <p className="text-sm text-muted-foreground">
            Sign in or create a free account to accept the invitation and start tracking baby
            activities together.
          </p>
          {/* Surface the token in a mono style so it's easy to debug */}
          <p className="rounded-md bg-muted px-3 py-1.5 text-xs font-mono text-muted-foreground break-all">
            {token}
          </p>
        </CardContent>

        <CardFooter className="flex flex-col gap-2">
          {/*
           * Pass the token as a search param so the login / register pages
           * can redirect back here after successful authentication, at which
           * point the page calls POST /api/v1/families/join with the token.
           */}
          <Button className="w-full" asChild>
            <Link href={`/login?next=/invite/${token}`}>Sign in to accept</Link>
          </Button>
          <Button variant="outline" className="w-full" asChild>
            <Link href={`/register?next=/invite/${token}`}>Create an account</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

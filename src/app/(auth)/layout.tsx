import Link from "next/link";
import { Dumbbell } from "lucide-react";

import { Card } from "@/components/ui/card";

export default function AuthLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="flex min-h-full flex-1 items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <Link
          href="/"
          className="mb-8 flex items-center justify-center gap-2 text-lg font-bold"
        >
          <span className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Dumbbell className="size-4" />
          </span>
          Black<span className="text-primary">GYM</span>
        </Link>
        <Card className="border-border/80 bg-card/95 shadow-xl backdrop-blur">
          {children}
        </Card>
      </div>
    </div>
  );
}

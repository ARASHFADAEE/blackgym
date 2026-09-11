import Image from "next/image";

import { cn } from "@/lib/utils";

type PageHeroProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  className?: string;
  imageSrc?: string;
};

export function PageHero({
  eyebrow,
  title,
  description,
  className,
  imageSrc = "/images/hero-gym.jpg",
}: PageHeroProps) {
  return (
    <section className={cn("relative overflow-hidden border-b border-border", className)}>
      <Image
        src={imageSrc}
        alt=""
        fill
        priority={false}
        sizes="100vw"
        className="object-cover object-center opacity-40"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-background/85 to-background" />
      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        {eyebrow ? (
          <p className="mb-3 text-sm font-medium text-muted-foreground">{eyebrow}</p>
        ) : null}
        <h1 className="max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl">{title}</h1>
        {description ? (
          <p className="mt-5 max-w-2xl text-lg leading-8 text-muted-foreground">{description}</p>
        ) : null}
      </div>
    </section>
  );
}

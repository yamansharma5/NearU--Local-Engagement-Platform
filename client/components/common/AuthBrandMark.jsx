import Link from "next/link";
import Image from "next/image";

export default function AuthBrandMark() {
  return (
    <Link
      href="/"
      className="mb-8 flex items-center justify-center gap-3 text-lg font-semibold tracking-tight text-foreground"
    >
      <span className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl">
        <Image src="/logo-mark.png" alt="Alleyo" fill sizes="40px" className="object-contain" priority />
      </span>
      <span className="flex flex-col leading-tight">
        <span>Alleyo</span>
        <span className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
          Local discovery
        </span>
      </span>
    </Link>
  );
}

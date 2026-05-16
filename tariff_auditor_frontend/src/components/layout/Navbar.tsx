import Link from "next/link";
import { Button } from "../ui/Button";

export function Navbar() {
  return (
    <nav className="w-full h-[64px] bg-canvas border-b border-hairline flex items-center justify-between px-8 sticky top-0 z-50">
      <div className="flex items-center gap-3">
        <div className="w-2 h-2 rounded-full bg-accent-green shadow-[0_0_8px_rgba(17,255,153,0.5)]" />
        <Link href="/" className="font-playfair text-[20px] text-ink tracking-tight">
          TariffGuard
        </Link>
      </div>

      <div className="hidden lg:flex items-center gap-8">
        <Link href="/dashboard" className="text-[14px] text-charcoal hover:text-ink transition-colors">
          Dashboard
        </Link>
        <Link href="/audit/new" className="text-[14px] text-charcoal hover:text-ink transition-colors">
          New Audit
        </Link>
        <Link href="/history" className="text-[14px] text-charcoal hover:text-ink transition-colors">
          History
        </Link>
        <Link href="/docs" className="text-[14px] text-charcoal hover:text-ink transition-colors">
          Docs
        </Link>
      </div>

      <div className="flex items-center gap-6">
        <Link href="/login" className="text-[14px] text-charcoal hover:text-ink transition-colors hidden sm:block">
          Sign in
        </Link>
        <Button asChild variant="primary">
          <Link href="/audit/new">Start Auditing</Link>
        </Button>
      </div>
    </nav>
  );
}

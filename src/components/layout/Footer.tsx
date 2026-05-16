import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-canvas pt-16 pb-16 px-8 border-t border-hairline">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-16">
        <div>
          <h4 className="font-medium text-ink mb-4 text-[14px]">Product</h4>
          <ul className="space-y-3">
            <li><Link href="/dashboard" className="text-[14px] text-charcoal hover:text-ink">Dashboard</Link></li>
            <li><Link href="/audit/new" className="text-[14px] text-charcoal hover:text-ink">New Audit</Link></li>
            <li><Link href="#" className="text-[14px] text-charcoal hover:text-ink">Integrations</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-medium text-ink mb-4 text-[14px]">Resources</h4>
          <ul className="space-y-3">
            <li><Link href="#" className="text-[14px] text-charcoal hover:text-ink">Documentation</Link></li>
            <li><Link href="#" className="text-[14px] text-charcoal hover:text-ink">API Reference</Link></li>
            <li><Link href="#" className="text-[14px] text-charcoal hover:text-ink">HS Code Guide</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-medium text-ink mb-4 text-[14px]">Legal</h4>
          <ul className="space-y-3">
            <li><Link href="#" className="text-[14px] text-charcoal hover:text-ink">Privacy Policy</Link></li>
            <li><Link href="#" className="text-[14px] text-charcoal hover:text-ink">Terms of Service</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-medium text-ink mb-4 text-[14px]">Company</h4>
          <ul className="space-y-3">
            <li><Link href="#" className="text-[14px] text-charcoal hover:text-ink">About</Link></li>
            <li><Link href="#" className="text-[14px] text-charcoal hover:text-ink">Contact</Link></li>
          </ul>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center pt-8 border-t border-hairline gap-4">
        <div className="text-[12px] text-[#888e90]">
          © {new Date().getFullYear()} TariffGuard AI. All rights reserved.
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-accent-green" />
          <span className="text-[12px] text-[#888e90]">All systems operational</span>
        </div>
      </div>
    </footer>
  );
}

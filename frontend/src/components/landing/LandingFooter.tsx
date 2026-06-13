import { type FC } from "react";
import { Link } from "react-router-dom";

type FooterLink = { label: string } & (
  | { href: string; external?: boolean }
  | { to: string }
);

const FOOTER_COLS: Record<string, FooterLink[]> = {
  Ecosystem: [
    { label: "Dashboard",  to: "/dashboard" },
    { label: "Liquidate",  to: "/liquidate" },
    { label: "Faucets",    href: "#faucets", external: false },
  ],
  Protocol: [
    { label: "Documentation", href: "/docs/index.html", external: true },
    { label: "Audits",        to: "/coming-soon" },
  ],
  Governance: [
    { label: "Forum",   to: "/coming-soon" },
    { label: "Discord", to: "/coming-soon" },
  ],
  About: [
    { label: "Blog",      to: "/coming-soon" },
    { label: "Brand Kit", to: "/coming-soon" },
  ],
};

const FooterLink: FC<{ link: FooterLink }> = ({ link }) => {
  const cls = "text-sm font-medium text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-neutral-200 transition-colors duration-200";
  if ("href" in link)
    return <a href={link.href} target={link.external ? "_blank" : undefined} rel="noopener noreferrer" className={cls}>{link.label}</a>;
  return <Link to={link.to} className={cls}>{link.label}</Link>;
};

export const LandingFooter: FC = () => (
  <footer className="border-t border-slate-200 dark:border-neutral-800/60 pt-16 md:pt-20 pb-12 px-4 transition-colors duration-300">
    <div className="max-w-6xl mx-auto">

      {/* Main grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-10 mb-16">
        {/* Brand column */}
        <div className="col-span-2 md:col-span-1 space-y-4">
          <div className="flex items-center gap-2.5">
            <img src="/nNGNlogo.png" alt="NairaStable" className="w-8 h-8 object-contain flex-shrink-0" />
            <span className="font-extrabold tracking-tight text-slate-900 dark:text-neutral-50 text-lg">NairaStable</span>
          </div>
          <p className="text-sm text-slate-500 dark:text-neutral-500 leading-relaxed max-w-xs">
            The decentralised, over-collateralised Naira stablecoin — built on Arbitrum.
          </p>
        </div>

        {/* Link columns */}
        {Object.entries(FOOTER_COLS).map(([category, links]) => (
          <div key={category} className="space-y-4">
            <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 dark:text-neutral-500">{category}</p>
            <ul className="space-y-2.5">
              {links.map((link) => (
                <li key={link.label}>
                  <FooterLink link={link} />
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Bottom bar */}
      <div className="border-t border-slate-200 dark:border-neutral-800/60 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-xs font-medium text-slate-500 dark:text-neutral-600">© {new Date().getFullYear()} NairaStable Protocol. All rights reserved.</p>
        <p className="text-xs font-medium text-slate-500 dark:text-neutral-600 max-w-sm text-center md:text-right">
          NairaStable is experimental software. Not financial advice. Use at your own risk.
        </p>
      </div>
    </div>
  </footer>
);

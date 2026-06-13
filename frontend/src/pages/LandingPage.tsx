import { type FC } from "react";
import { LandingNav }       from "../components/landing/LandingNav";
import { HeroSection }      from "../components/landing/HeroSection";
import { StatsSection }     from "../components/landing/StatsSection";
import { EcosystemSection } from "../components/landing/EcosystemSection";
import { FlowSection }      from "../components/landing/FlowSection";
import { AboutSection }     from "../components/landing/AboutSection";
import { CTASection }       from "../components/landing/CTASection";
import { FaucetsSection }   from "../components/landing/FaucetsSection";
import { LandingFooter }    from "../components/landing/LandingFooter";

/**
 * Landing page — a thin composition of standalone section components.
 * Each section handles its own animations and data.
 */
export const LandingPage: FC = () => (
  <div className="min-h-screen bg-slate-50 dark:bg-[#030303] text-slate-900 dark:text-neutral-50 overflow-x-hidden transition-colors duration-500">
    <LandingNav />
    <HeroSection />
    <StatsSection />
    <EcosystemSection />
    <AboutSection />
    <FlowSection />
    <CTASection />
    <FaucetsSection />
    <LandingFooter />
  </div>
);

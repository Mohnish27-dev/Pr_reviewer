import { loadWorkflow, loadArchitecture } from "@/components/landing/lib/loadMarkdown";
import { Architecture } from "./sections/Architecture";
import { Collaboration } from "./sections/Collaboration";
import { Features } from "./sections/Features";
import { Hero } from "./sections/Hero";
import { Workflow } from "./sections/Workflow";
import { BottomCTA } from "./sections/BottomCTA";
import { Footer } from "./sections/Footer";

export async function LandingPage() {
  const workflowSections = loadWorkflow();
  const architectureSections = loadArchitecture();

  return (
    <div className="landing-v2" data-landing="true">
      <Hero />
      <Collaboration />
      <Features />
      <Workflow sections={workflowSections} />
      <Architecture sections={architectureSections} />
      <BottomCTA />
      <Footer />
    </div>
  );
}

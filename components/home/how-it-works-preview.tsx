import Link from "next/link";
import { Camera, Sparkles, BookOpen, Gift, ArrowRight } from "lucide-react";

const steps = [
  {
    icon: Camera,
    number: 1,
    title: "Submit",
    description: "Share up to 3 film photos monthly",
  },
  {
    icon: Sparkles,
    number: 2,
    title: "Curate",
    description: "Community judges select 15 featured",
  },
  {
    icon: BookOpen,
    number: 3,
    title: "Print",
    description: "Featured photos appear in our magazine",
  },
  {
    icon: Gift,
    number: 4,
    title: "Win",
    description: "Every submitter enters the prize raffle",
  },
];

export function HowItWorksPreview() {
  return (
    <section className="py-12 border-y bg-muted/30">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-semibold">How It Works</h2>
          <Link
            href="/about"
            className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
          >
            Learn more
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {steps.map((step) => (
            <div key={step.number} className="flex flex-col items-center text-center gap-3">
              <div className="relative">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <step.icon className="h-5 w-5 text-primary" />
                </div>
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">
                  {step.number}
                </span>
              </div>
              <div>
                <h3 className="font-medium mb-1">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

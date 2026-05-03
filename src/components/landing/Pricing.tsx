import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { Link } from "react-router-dom";

const tiers = [
    { name: "Free", price: "$0", desc: "Try Vireon and create your first videos.", features: ["3 videos / month", "720p export", "Basic captions"], cta: "Start free", variant: "glow" as const },
    { name: "Pro", price: "$29", desc: "Everything a single business needs to stay consistent.", features: ["50 videos / month", "1080p export", "Captions + hooks", "Multi-platform scheduling"], cta: "Go Pro", variant: "hero" as const, featured: true },
    { name: "Premium", price: "$79", desc: "For agencies and power creators.", features: ["Unlimited videos", "4K export", "Brand kit & presets", "Priority rendering", "Team seats"], cta: "Get Premium", variant: "glow" as const },
];

export const Pricing = () => (
    <section id="pricing" className="container py-24">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <p className="text-sm text-primary font-medium uppercase tracking-wider">Pricing</p>
            <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight">
                Simple plans, <span className="text-gradient">serious results</span>
            </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {tiers.map((t) => (
                <div
                    key={t.name}
                    className={`relative rounded-2xl border p-8 transition-smooth ${t.featured
                            ? "border-primary/60 bg-gradient-card shadow-glow scale-[1.02]"
                            : "border-border bg-card/50 hover:border-primary/30"
                        }`}
                >
                    {t.featured && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-gradient-primary text-xs font-semibold text-primary-foreground">
                            Most popular
                        </div>
                    )}
                    <h3 className="font-display text-xl font-semibold">{t.name}</h3>
                    <div className="mt-4 flex items-baseline gap-1">
                        <span className="font-display text-5xl font-bold">{t.price}</span>
                        <span className="text-muted-foreground">/mo</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2 mb-6">{t.desc}</p>
                    <ul className="space-y-3 mb-8">
                        {t.features.map((f) => (
                            <li key={f} className="flex items-start gap-2 text-sm">
                                <Check className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                                <span>{f}</span>
                            </li>
                        ))}
                    </ul>
                    <Button asChild variant={t.variant} className="w-full">
                        <Link to="/auth">{t.cta}</Link>
                    </Button>
                </div>
            ))}
        </div>
    </section>
);

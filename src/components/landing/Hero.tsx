import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import heroImg from "@/assets/hero.jpg";

export const Hero = () => (
    <section className="relative overflow-hidden bg-gradient-hero">
        <div className="container relative grid lg:grid-cols-2 gap-12 items-center py-20 lg:py-32">
            <div className="space-y-8 animate-fade-up">
                <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/50 backdrop-blur px-4 py-1.5 text-xs text-muted-foreground">
                    <Sparkles className="h-3.5 w-3.5 text-primary" />
                    AI-powered short-form video studio
                </div>
                <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.05] tracking-tight">
                    Turn photos into <span className="text-gradient">scroll-stopping</span> videos.
                </h1>
                <p className="text-lg text-muted-foreground max-w-xl leading-relaxed">
                    Vireon AI converts your images and a quick description into platform-ready TikToks, Reels, and Shorts — no editing skills required.
                </p>
                <div className="flex flex-wrap gap-4">
                    <Button asChild variant="hero" size="lg">
                        <Link to="/auth">
                            Generate your first video
                            <ArrowRight className="h-4 w-4" />
                        </Link>
                    </Button>
                    <Button asChild variant="glow" size="lg">
                        <a href="#how">See how it works</a>
                    </Button>
                </div>
                <div className="flex items-center gap-6 pt-4 text-sm text-muted-foreground">
                    <div><span className="text-foreground font-semibold">12k+</span> creators</div>
                    <div className="h-4 w-px bg-border" />
                    <div><span className="text-foreground font-semibold">4.9/5</span> rating</div>
                    <div className="h-4 w-px bg-border" />
                    <div>No credit card</div>
                </div>
            </div>
            <div className="relative animate-float">
                <div className="absolute inset-0 bg-gradient-primary blur-3xl opacity-30 rounded-full" />
                <img
                    src={heroImg}
                    alt="Vireon AI generating short-form video from photos"
                    width={1280}
                    height={1024}
                    className="relative rounded-3xl border border-border shadow-elegant"
                />
            </div>
        </div>
    </section>
);

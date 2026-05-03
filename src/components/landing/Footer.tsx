import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Instagram, Twitter, Linkedin, ArrowRight } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";

export const Footer = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const handleHashClick = (e: React.MouseEvent<HTMLAnchorElement>, hash: string) => {
        e.preventDefault();
        if (location.pathname !== "/") {
            navigate(`/${hash}`);
        } else {
            const element = document.querySelector(hash);
            if (element) {
                element.scrollIntoView({ behavior: "smooth" });
            }
        }
    };

    return (
        <footer className="relative border-t border-border overflow-hidden">
            {/* Subtle background gradient for the footer */}
            <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
            
            {/* CTA Section */}
            <div className="border-b border-border/50 bg-muted/30">
                <div className="container py-16 flex flex-col items-center text-center space-y-6">
                    <h3 className="text-3xl md:text-4xl font-bold tracking-tight">
                        Start creating viral videos today
                    </h3>
                    <p className="text-muted-foreground text-lg max-w-xl">
                        Join hundreds of local businesses using Vireon AI to scale their social media presence effortlessly.
                    </p>
                    <Button size="lg" className="rounded-full shadow-lg group" asChild>
                        <Link to="/auth">
                            Get Started Free
                            <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                        </Link>
                    </Button>
                </div>
            </div>

            {/* Main Footer Content */}
            <div className="container py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 relative z-10">
                {/* Brand Section */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="space-y-4">
                        <Logo />
                        <p className="text-lg font-medium text-foreground">
                            Turn photos into scroll-stopping videos — instantly.
                        </p>
                        <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
                            Vireon AI helps local businesses generate and manage high-quality short-form video content using AI.
                        </p>
                    </div>
                    
                    {/* Social Links */}
                    <div className="flex items-center space-x-4 pt-2">
                        <button onClick={() => toast("Coming Soon 🚀")} className="p-2 rounded-full bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer" aria-label="Instagram">
                            <Instagram className="w-4 h-4" />
                        </button>
                        <button onClick={() => toast("Coming Soon 🚀")} className="p-2 rounded-full bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer" aria-label="Twitter">
                            <Twitter className="w-4 h-4" />
                        </button>
                        <a href="https://www.linkedin.com/in/vishvam001" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground transition-colors" aria-label="LinkedIn">
                            <Linkedin className="w-4 h-4" />
                        </a>
                    </div>
                </div>

                {/* Links Sections */}
                <div className="space-y-4">
                    <h4 className="font-semibold text-foreground">Product</h4>
                    <ul className="space-y-3 text-sm text-muted-foreground">
                        <li><a href="#features" onClick={(e) => handleHashClick(e, '#features')} className="hover:text-primary transition-colors">Features</a></li>
                        <li><a href="#how-it-works" onClick={(e) => handleHashClick(e, '#how-it-works')} className="hover:text-primary transition-colors">How it Works</a></li>
                        <li><a href="#pricing" onClick={(e) => handleHashClick(e, '#pricing')} className="hover:text-primary transition-colors">Pricing</a></li>
                    </ul>
                </div>

                <div className="space-y-4">
                    <h4 className="font-semibold text-foreground">Company</h4>
                    <ul className="space-y-3 text-sm text-muted-foreground">
                        <li><a href="#about" onClick={(e) => handleHashClick(e, '#about')} className="hover:text-primary transition-colors">About Vireon AI</a></li>
                        <li><a href="mailto:support@vireon.ai" className="hover:text-primary transition-colors">Contact</a></li>
                        <li><span className="flex items-center gap-2 opacity-70">Careers <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded uppercase font-semibold tracking-wider">Soon</span></span></li>
                        <li><span className="flex items-center gap-2 opacity-70">Blog <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded uppercase font-semibold tracking-wider">Soon</span></span></li>
                    </ul>
                </div>

                <div className="space-y-4">
                    <h4 className="font-semibold text-foreground">Legal</h4>
                    <ul className="space-y-3 text-sm text-muted-foreground mb-6">
                        <li><Link to="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
                        <li><Link to="/terms" className="hover:text-primary transition-colors">Terms of Service</Link></li>
                    </ul>
                    <div className="p-4 bg-muted/50 rounded-lg border border-border/50 text-xs">
                        <span className="font-medium text-foreground block mb-1">Data Security</span>
                        <span className="text-muted-foreground">We use secure cloud infrastructure (Supabase) to protect your data.</span>
                    </div>
                </div>
            </div>

            {/* Copyright Bar */}
            <div className="border-t border-border/50 relative z-10">
                <div className="container py-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
                    <span>© {new Date().getFullYear()} Vireon AI. All rights reserved.</span>
                    <span>Designed for local businesses to thrive.</span>
                </div>
            </div>
        </footer>
    );
};

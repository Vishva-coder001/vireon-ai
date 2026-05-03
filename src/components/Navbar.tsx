import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Logo } from "./Logo";

export const Navbar = () => {
    const navigate = useNavigate();

    const handleHashClick = (e: React.MouseEvent<HTMLAnchorElement>, hash: string) => {
        e.preventDefault();
        navigate("/");
        setTimeout(() => {
            const el = document.getElementById(hash.replace("#", ""));
            if (el) el.scrollIntoView({ behavior: "smooth" });
        }, 100);
    };

    return (
        <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/70 backdrop-blur-xl">
            <div className="container flex h-16 items-center justify-between">
                <Logo />
                <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
                    <a href="#features" onClick={(e) => handleHashClick(e, '#features')} className="cursor-pointer hover:text-primary transition-colors">Features</a>
                    <a href="#how-it-works" onClick={(e) => handleHashClick(e, '#how-it-works')} className="cursor-pointer hover:text-primary transition-colors">How it Works</a>
                    <a href="#pricing" onClick={(e) => handleHashClick(e, '#pricing')} className="cursor-pointer hover:text-primary transition-colors">Pricing</a>
                </nav>
                <div className="flex items-center gap-3">
                    <Link to="/auth" className="text-sm font-medium text-muted-foreground hover:text-primary cursor-pointer transition-colors hidden sm:inline">
                        Sign in
                    </Link>
                    <Button asChild variant="hero" size="sm">
                        <Link to="/auth" className="cursor-pointer">Get started</Link>
                    </Button>
                </div>
            </div>
        </header>
    );
};

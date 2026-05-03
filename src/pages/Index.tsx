import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/landing/Hero";
import { Features } from "@/components/landing/Features";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Pricing } from "@/components/landing/Pricing";
import { Footer } from "@/components/landing/Footer";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const Index = () => {
    const location = useLocation();

    useEffect(() => {
        if (location.hash) {
            const id = location.hash.replace("#", "");
            const element = document.getElementById(id);
            if (element) {
                setTimeout(() => {
                    element.scrollIntoView({ behavior: "smooth" });
                }, 100);
            }
        }
    }, [location.hash]);

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <main>
                <Hero />
                <Features />
                <HowItWorks />
                <Pricing />
            </main>
            <Footer />
        </div>
    );
};

export default Index;

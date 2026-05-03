import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/landing/Footer";

const TermsOfService = () => {
    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Navbar />
            <main className="flex-1 container max-w-4xl py-24">
                <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
                <div className="prose prose-sm dark:prose-invert">
                    <p className="text-muted-foreground mb-6">Last updated: May 2026</p>
                    
                    <h2 className="text-2xl font-semibold mt-8 mb-4">1. Acceptance of Terms</h2>
                    <p>By accessing and using Vireon AI, you accept and agree to be bound by the terms and provision of this agreement. In addition, when using these particular services, you shall be subject to any posted guidelines or rules applicable to such services.</p>

                    <h2 className="text-2xl font-semibold mt-8 mb-4">2. Provision of Services</h2>
                    <p>You agree and acknowledge that Vireon AI is entitled to modify, improve or discontinue any of its services at its sole discretion and without notice to you even if it may result in you being prevented from accessing any information contained in it. Furthermore, you agree and acknowledge that Vireon AI is entitled to provide services to you through subsidiaries or affiliated entities.</p>

                    <h2 className="text-2xl font-semibold mt-8 mb-4">3. Proprietary Rights</h2>
                    <p>You acknowledge and agree that Vireon AI may contain proprietary and confidential information including trademarks, service marks and patents protected by intellectual property laws and international intellectual property treaties. Vireon AI authorizes you to view and make a single copy of portions of its content for offline, personal, non-commercial use.</p>

                    <h2 className="text-2xl font-semibold mt-8 mb-4">4. Termination of Agreement</h2>
                    <p>The Terms of this agreement will continue to apply in perpetuity until terminated by either party without notice at any time for any reason. Terms that are to continue in perpetuity shall be unaffected by the termination of this agreement.</p>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default TermsOfService;

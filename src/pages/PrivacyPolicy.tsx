import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/landing/Footer";

const PrivacyPolicy = () => {
    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Navbar />
            <main className="flex-1 container max-w-4xl py-24">
                <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
                <div className="prose prose-sm dark:prose-invert">
                    <p className="text-muted-foreground mb-6">Last updated: May 2026</p>
                    
                    <h2 className="text-2xl font-semibold mt-8 mb-4">1. Information We Collect</h2>
                    <p>We collect information you provide directly to us, such as when you create or modify your account, request on-demand services, contact customer support, or otherwise communicate with us. This information may include: name, email, phone number, postal address, profile picture, payment method, and other information you choose to provide.</p>

                    <h2 className="text-2xl font-semibold mt-8 mb-4">2. How We Use Your Information</h2>
                    <p>We may use the information we collect about you to:</p>
                    <ul className="list-disc pl-6 space-y-2 my-4">
                        <li>Provide, maintain, and improve our services, including, for example, to facilitate payments, send receipts, provide products and services you request (and send related information), develop new features, provide customer support to users, develop safety features, authenticate users, and send product updates and administrative messages.</li>
                        <li>Perform internal operations, including, for example, to prevent fraud and abuse of our services; to troubleshoot software bugs and operational problems; to conduct data analysis, testing, and research; and to monitor and analyze usage and activity trends.</li>
                        <li>Send or facilitate communications (i) between you and a service provider, such as estimated times of arrival (ETAs), or (ii) between you and a contact of yours at your direction in connection with your use of certain features.</li>
                    </ul>

                    <h2 className="text-2xl font-semibold mt-8 mb-4">3. Data Security</h2>
                    <p>We use secure cloud infrastructure (Supabase) to protect your data. While we strive to use commercially acceptable means to protect your personal information, we cannot guarantee its absolute security.</p>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default PrivacyPolicy;

import { Wand2, Smartphone, LayoutDashboard, CalendarClock } from "lucide-react";

const features = [
    { icon: Wand2, title: "AI Video Generator", desc: "Upload images and a short description. Vireon assembles a polished short-form video in seconds." },
    { icon: Smartphone, title: "Platform Optimized", desc: "Auto-formatted for TikTok, Reels, and YouTube Shorts with captions and hooks built in." },
    { icon: LayoutDashboard, title: "Content Dashboard", desc: "Manage every video, track status, and keep your content pipeline organized in one place." },
    { icon: CalendarClock, title: "Smart Scheduling", desc: "Pick a platform and time — Vireon lines up your posts so you never miss the algorithm." },
];

export const Features = () => (
    <section id="features" className="container py-24">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <p className="text-sm text-primary font-medium uppercase tracking-wider">Features</p>
            <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight">
                Everything you need to <span className="text-gradient">go viral</span>
            </h2>
            <p className="text-muted-foreground">A complete toolkit built for busy local businesses and creators.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f) => (
                <div key={f.title} className="group relative rounded-2xl border border-border bg-gradient-card p-6 shadow-card hover:border-primary/40 hover:shadow-glow transition-smooth">
                    <div className="h-12 w-12 rounded-xl bg-gradient-primary flex items-center justify-center mb-5 shadow-glow">
                        <f.icon className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <h3 className="font-display text-lg font-semibold mb-2">{f.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                </div>
            ))}
        </div>
    </section>
);

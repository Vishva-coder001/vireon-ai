const steps = [
    { n: "01", title: "Upload your photos", desc: "Drop in product shots, room photos, or any imagery you want to feature." },
    { n: "02", title: "Describe your vibe", desc: "Tell Vireon the message, mood, and platform. AI does the heavy lifting." },
    { n: "03", title: "Publish & schedule", desc: "Preview, tweak captions, and schedule across TikTok, Reels, and Shorts." },
];

export const HowItWorks = () => (
    <section id="how-it-works" className="relative py-24 border-y border-border bg-card/30">
        <div className="container">
            <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
                <p className="text-sm text-primary font-medium uppercase tracking-wider">How it works</p>
                <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight">
                    From photo to post in <span className="text-gradient">3 steps</span>
                </h2>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
                {steps.map((s) => (
                    <div key={s.n} className="relative rounded-2xl border border-border bg-background/40 backdrop-blur p-8">
                        <div className="font-display text-5xl font-bold text-gradient mb-4">{s.n}</div>
                        <h3 className="font-display text-xl font-semibold mb-2">{s.title}</h3>
                        <p className="text-muted-foreground leading-relaxed">{s.desc}</p>
                    </div>
                ))}
            </div>
        </div>
    </section>
);
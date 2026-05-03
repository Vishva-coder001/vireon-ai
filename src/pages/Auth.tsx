import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/Logo";
import { toast } from "sonner";
import { supabase } from "@/lib/supabaseClient";

const Auth = () => {
    const [mode, setMode] = useState<"login" | "signup">("signup");
    const [form, setForm] = useState({ name: "", email: "", password: "" });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (mode === "signup") {
                const { error } = await supabase.auth.signUp({
                    email: form.email,
                    password: form.password,
                    options: {
                        data: {
                            name: form.name,
                        },
                    },
                });
                if (error) throw error;
                toast.success("Account created successfully! You can now sign in.");
                setMode("login");
            } else {
                const { error } = await supabase.auth.signInWithPassword({
                    email: form.email,
                    password: form.password,
                });
                if (error) throw error;
                toast.success("Welcome back!");
                navigate("/dashboard");
            }
        } catch (error: any) {
            toast.error(error.message || "An error occurred during authentication.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-hero flex flex-col">
            <div className="container py-6">
                <Logo />
            </div>
            <div className="flex-1 flex items-center justify-center px-4 pb-12">
                <div className="w-full max-w-md">
                    <div className="rounded-3xl border border-border bg-gradient-card backdrop-blur p-8 shadow-elegant">
                        <div className="text-center mb-8 space-y-2">
                            <h1 className="font-display text-3xl font-bold">
                                {mode === "signup" ? "Create your account" : "Welcome back"}
                            </h1>
                            <p className="text-sm text-muted-foreground">
                                {mode === "signup" ? "Start generating videos in seconds." : "Sign in to your Vireon dashboard."}
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {mode === "signup" && (
                                <div className="space-y-2">
                                    <Label htmlFor="name">Name</Label>
                                    <Input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required placeholder="Jane Doe" />
                                </div>
                            )}
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required placeholder="you@business.com" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <Input id="password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required placeholder="••••••••" />
                            </div>
                            <Button type="submit" variant="hero" className="w-full" size="lg" disabled={loading}>
                                {loading ? "Please wait..." : (mode === "signup" ? "Create account" : "Sign in")}
                            </Button>
                        </form>

                        <p className="text-center text-sm text-muted-foreground mt-6">
                            {mode === "signup" ? "Already have an account?" : "Don't have an account?"}{" "}
                            <button
                                type="button"
                                onClick={() => setMode(mode === "signup" ? "login" : "signup")}
                                className="text-primary hover:underline font-medium"
                            >
                                {mode === "signup" ? "Sign in" : "Sign up"}
                            </button>
                        </p>
                    </div>
                    <p className="text-center text-xs text-muted-foreground mt-6">
                        <Link to="/" className="hover:text-foreground transition-smooth">← Back to home</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Auth;

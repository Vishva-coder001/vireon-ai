import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Twitter, Instagram, Youtube, Trash2 } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

export const SocialAccountsSection = () => {
    const { user } = useAuth();
    const [accounts, setAccounts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchAccounts = async () => {
        if (!user) return;
        setLoading(true);
        const { data, error } = await supabase
            .from("social_accounts")
            .select("*")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false });

        if (error) {
            toast.error("Failed to load accounts");
            console.error(error);
        } else {
            setAccounts(data || []);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchAccounts();
    }, [user]);

    const handleConnect = async (platform: string) => {
        if (!user) return;
        const mockAccountName = `${platform}_user_${Math.floor(Math.random() * 1000)}`;
        const { error } = await supabase.from("social_accounts").insert({
            user_id: user.id,
            platform,
            account_name: mockAccountName,
            access_token: "mock_token_123"
        });

        if (error) {
            toast.error(`Failed to connect ${platform}`);
        } else {
            toast.success(`Connected ${platform} account successfully!`);
            fetchAccounts();
        }
    };

    const handleDisconnect = async (id: string) => {
        const { error } = await supabase.from("social_accounts").delete().eq("id", id);
        if (error) {
            toast.error("Failed to disconnect account");
        } else {
            toast.success("Account disconnected");
            fetchAccounts();
        }
    };

    const getIcon = (platform: string) => {
        switch (platform.toLowerCase()) {
            case "instagram": return <Instagram className="h-5 w-5 text-pink-500" />;
            case "tiktok": return <Twitter className="h-5 w-5 text-black dark:text-white" />; // using Twitter icon as placeholder for TikTok
            case "youtube": return <Youtube className="h-5 w-5 text-red-500" />;
            default: return <Plus className="h-5 w-5" />;
        }
    };

    return (
        <section id="social" className="space-y-6">
            <header className="space-y-1">
                <h2 className="font-display text-2xl font-semibold">Social Accounts</h2>
                <p className="text-muted-foreground">Manage your connected platforms for auto-posting.</p>
            </header>

            <div className="grid sm:grid-cols-3 gap-4 mb-8">
                {["Instagram", "TikTok", "YouTube"].map((platform) => (
                    <div key={platform} className="rounded-2xl border border-border bg-gradient-card p-5 shadow-card flex flex-col items-center justify-center gap-3 text-center">
                        {getIcon(platform)}
                        <h3 className="font-medium">{platform}</h3>
                        <Button variant="outline" size="sm" onClick={() => handleConnect(platform)}>
                            Connect
                        </Button>
                    </div>
                ))}
            </div>

            <div className="rounded-2xl border border-border bg-gradient-card shadow-card overflow-hidden">
                <div className="p-4 border-b border-border font-medium">Connected Accounts</div>
                {loading ? (
                    <div className="p-8 text-center text-muted-foreground">Loading accounts...</div>
                ) : accounts.length === 0 ? (
                    <div className="p-12 text-center text-muted-foreground text-sm">
                        No accounts connected yet. Connect an account above to start scheduling posts.
                    </div>
                ) : (
                    <div className="divide-y divide-border">
                        {accounts.map((acc) => (
                            <div key={acc.id} className="p-4 flex items-center justify-between hover:bg-muted/50 transition-colors">
                                <div className="flex items-center gap-3">
                                    {getIcon(acc.platform)}
                                    <div>
                                        <p className="font-medium text-sm">{acc.account_name}</p>
                                        <p className="text-xs text-muted-foreground capitalize">{acc.platform}</p>
                                    </div>
                                </div>
                                <Button variant="ghost" size="icon" onClick={() => handleDisconnect(acc.id)} className="text-destructive hover:text-destructive hover:bg-destructive/10">
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};

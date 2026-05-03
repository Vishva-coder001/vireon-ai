import { LogOut, User as UserIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

export const TopNavbar = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate("/auth");
    };

    return (
        <header className="sticky top-0 z-10 w-full border-b border-border bg-background/80 backdrop-blur">
            <div className="flex h-16 items-center justify-between px-6 lg:px-10">
                <div className="flex items-center gap-4">
                    {/* Optional: Mobile sidebar toggle can go here */}
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <UserIcon className="h-4 w-4" />
                        <span className="hidden sm:inline">{user?.email}</span>
                    </div>
                    <Button variant="outline" size="sm" onClick={handleLogout} className="gap-2">
                        <LogOut className="h-4 w-4" />
                        <span className="hidden sm:inline">Sign out</span>
                    </Button>
                </div>
            </div>
        </header>
    );
};

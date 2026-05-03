import { NavLink, useLocation } from "react-router-dom";
import { LayoutDashboard, Upload, Video, CalendarClock, Settings, LogOut } from "lucide-react";
import { Logo } from "@/components/Logo";

const items = [
    { title: "Overview", url: "/dashboard", icon: LayoutDashboard, end: true },
    { title: "Generate", url: "/dashboard#generate", icon: Upload },
    { title: "My Videos", url: "/dashboard#videos", icon: Video },
    { title: "Scheduler", url: "/dashboard#schedule", icon: CalendarClock },
    { title: "Social Accounts", url: "/dashboard#social", icon: Settings },
];

export const DashboardSidebar = () => {
    const { hash, pathname } = useLocation();
    const current = pathname + hash;

    return (
        <aside className="hidden lg:flex flex-col w-64 border-r border-border bg-sidebar shrink-0">
            <div className="p-6 border-b border-border">
                <Logo />
            </div>
            <nav className="flex-1 p-4 space-y-1">
                {items.map((item) => {
                    const active = item.end ? current === item.url || pathname === "/dashboard" && !hash && item.end : current === item.url;
                    return (
                        <NavLink
                            key={item.title}
                            to={item.url}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-smooth ${active
                                    ? "bg-gradient-primary text-primary-foreground shadow-glow"
                                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-foreground"
                                }`}
                        >
                            <item.icon className="h-4 w-4" />
                            {item.title}
                        </NavLink>
                    );
                })}
            </nav>
            <div className="p-4 border-t border-border space-y-1">
                <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-sidebar-foreground hover:bg-sidebar-accent transition-smooth">
                    <Settings className="h-4 w-4" /> Settings
                </button>
                <NavLink to="/" className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-sidebar-foreground hover:bg-sidebar-accent transition-smooth">
                    <LogOut className="h-4 w-4" /> Sign out
                </NavLink>
            </div>
        </aside>
    );
};

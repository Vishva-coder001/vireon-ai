import { useState, useEffect } from "react";
import { BrowserRouter, useLocation } from "react-router-dom";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { TopNavbar } from "@/components/dashboard/TopNavbar";
import { UploadSection } from "@/components/dashboard/UploadSection";
import { VideosGrid } from "@/components/dashboard/VideosGrid";
import { SchedulerSection } from "@/components/dashboard/SchedulerSection";
import { SocialAccountsSection } from "@/components/dashboard/SocialAccountsSection";
import { Video, Sparkles } from "lucide-react";
import { getVideos, getScheduledPosts } from "@/services/videoService";

const Dashboard = () => {
    const { hash } = useLocation();
    const [stats, setStats] = useState({ videos: 0, scheduled: 0 });

    useEffect(() => {
        const fetchStats = async () => {
            const [videosRes, postsRes] = await Promise.all([
                getVideos(),
                getScheduledPosts()
            ]);
            setStats({
                videos: videosRes.data?.length || 0,
                scheduled: postsRes.data?.length || 0,
            });
        };
        fetchStats();
    }, [hash]);

    const overviewStats = [
        { label: "Videos created", value: stats.videos.toString(), icon: Video },
        { label: "Scheduled posts", value: stats.scheduled.toString(), icon: Sparkles },
    ];

    // Determine which section to show based on hash
    const renderContent = () => {
        switch (hash) {
            case "#generate":
                return <UploadSection />;
            case "#videos":
                return <VideosGrid />;
            case "#schedule":
                return <SchedulerSection />;
            case "#social":
                return <SocialAccountsSection />;
            default:
                // Overview
                return (
                    <div className="space-y-8">
                        <header className="space-y-1">
                            <h1 className="font-display text-3xl font-bold">Welcome back 👋</h1>
                            <p className="text-muted-foreground">Here's what's happening with your content.</p>
                        </header>

                        <div className="grid sm:grid-cols-2 gap-4">
                            {overviewStats.map((s) => (
                                <div key={s.label} className="rounded-2xl border border-border bg-gradient-card p-5 shadow-card">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm text-muted-foreground">{s.label}</span>
                                        <s.icon className="h-4 w-4 text-primary" />
                                    </div>
                                    <div className="font-display text-3xl font-bold">{s.value}</div>
                                </div>
                            ))}
                        </div>

                        <div className="grid gap-8">
                            <UploadSection />
                            <VideosGrid />
                        </div>
                    </div>
                );
        }
    };

    return (
        <div className="min-h-screen flex bg-background">
            <DashboardSidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
                <TopNavbar />
                <main className="flex-1 overflow-auto">
                    <div className="p-6 lg:p-10 max-w-6xl mx-auto">
                        {renderContent()}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Dashboard;

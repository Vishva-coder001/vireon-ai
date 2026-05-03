import { useState, useEffect } from "react";
import { Play, Clock, CheckCircle2 } from "lucide-react";
import { getVideos } from "@/services/videoService";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export const VideosGrid = () => {
    const [videos, setVideos] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchVideos = async () => {
        setLoading(true);
        const { data, error } = await getVideos();
        if (data) {
            setVideos(data);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchVideos();
        
        // Optional: Poll for updates every 10 seconds if any video is 'Processing'
        const interval = setInterval(() => {
            const hasProcessing = videos.some(v => v.status === 'Processing');
            if (hasProcessing) {
                fetchVideos();
            }
        }, 10000);
        return () => clearInterval(interval);
    }, [videos]);

    return (
        <section id="videos" className="rounded-2xl border border-border bg-gradient-card p-6 shadow-card">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="font-display text-xl font-semibold">Your videos</h2>
                    <p className="text-sm text-muted-foreground">{videos.length} total</p>
                </div>
            </div>

            {loading && videos.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground text-sm">
                    Loading videos...
                </div>
            ) : videos.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 space-y-4">
                    <p className="text-muted-foreground text-sm">No videos yet</p>
                    <Button asChild>
                        <Link to="/dashboard#generate">Create your first video</Link>
                    </Button>
                </div>
            ) : (
                <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
                    {videos.map((v) => (
                        <div key={v.id} className="group rounded-xl border border-border bg-background/40 overflow-hidden hover:border-primary/40 transition-smooth">
                            {v.status === 'Completed' && v.video_url ? (
                                <a href={v.video_url} target="_blank" rel="noopener noreferrer" className="relative aspect-[9/16] bg-secondary flex items-center justify-center overflow-hidden block">
                                    {v.thumbnail_url ? (
                                        <img src={v.thumbnail_url} alt={v.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-smooth" />
                                    ) : (
                                        <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-accent/30" />
                                    )}
                                    <Play className="absolute h-12 w-12 text-foreground/80 group-hover:scale-110 transition-smooth drop-shadow-md" />
                                </a>
                            ) : (
                                <div className="relative aspect-[9/16] bg-secondary flex items-center justify-center overflow-hidden">
                                    {v.thumbnail_url ? (
                                        <img src={v.thumbnail_url} alt={v.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-smooth" />
                                    ) : (
                                        <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-accent/30" />
                                    )}
                                    {v.status === "Processing" && <Clock className="absolute h-12 w-12 text-foreground/50 animate-pulse" />}
                                </div>
                            )}
                            <div className="p-4 space-y-2">
                                <p className="font-medium text-sm truncate">{v.title}</p>
                                <div className="flex items-center justify-between text-xs">
                                    <span className="text-muted-foreground">{new Date(v.created_at).toLocaleDateString()}</span>
                                    <span className={`flex items-center gap-1 ${v.status === "Completed" ? "text-primary" : "text-muted-foreground"}`}>
                                        {v.status === "Completed" ? <CheckCircle2 className="h-3 w-3" /> : <Clock className="h-3 w-3 animate-pulse" />}
                                        {v.status}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
};

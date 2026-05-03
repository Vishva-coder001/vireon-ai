import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarClock, CheckCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { getVideos, schedulePost, getScheduledPosts, updatePostStatus } from "@/services/videoService";

export const SchedulerSection = () => {
    const [videos, setVideos] = useState<any[]>([]);
    const [scheduledPosts, setScheduledPosts] = useState<any[]>([]);
    const [platform, setPlatform] = useState("instagram");
    const [datetime, setDatetime] = useState("");
    const [selectedVideo, setSelectedVideo] = useState("");
    const [caption, setCaption] = useState("");
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);

    const fetchData = async () => {
        setFetching(true);
        const [videosRes, postsRes] = await Promise.all([
            getVideos(),
            getScheduledPosts()
        ]);
        
        if (videosRes.data) {
            setVideos(videosRes.data.filter((v: any) => v.status === "Completed"));
        }
        if (postsRes.data) {
            setScheduledPosts(postsRes.data);
        }
        setFetching(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Auto-post simulation
    useEffect(() => {
        const interval = setInterval(() => {
            setScheduledPosts(prevPosts => {
                let updated = false;
                const now = new Date();
                
                const newPosts = prevPosts.map(post => {
                    if (post.status === 'scheduled' && new Date(post.scheduled_time) <= now) {
                        updated = true;
                        updatePostStatus(post.id, 'posted'); // Fire and forget update
                        return { ...post, status: 'posted' };
                    }
                    return post;
                });
                
                if (updated) {
                    toast.success("A scheduled post was just published!");
                }
                
                return updated ? newPosts : prevPosts;
            });
        }, 10000); // Check every 10 seconds

        return () => clearInterval(interval);
    }, []);

    const handleSchedule = async () => {
        if (!selectedVideo || !datetime || !platform) {
            toast.error("Please fill in all required fields.");
            return;
        }

        const scheduledTime = new Date(datetime);
        if (scheduledTime <= new Date()) {
            toast.error("Scheduled time must be in the future.");
            return;
        }

        setLoading(true);
        const { error } = await schedulePost({
            video_id: selectedVideo,
            platform,
            scheduled_time: scheduledTime.toISOString(),
            caption,
            status: "scheduled"
        });

        if (error) {
            toast.error("Failed to schedule post.");
            console.error(error);
        } else {
            toast.success(`Scheduled for ${platform} on ${scheduledTime.toLocaleString()}`);
            setDatetime("");
            setCaption("");
            setSelectedVideo("");
            fetchData();
        }
        setLoading(false);
    };

    return (
        <section id="schedule" className="space-y-8">
            <div className="rounded-2xl border border-border bg-gradient-card p-6 shadow-card">
                <div className="flex items-center gap-2 mb-1">
                    <CalendarClock className="h-5 w-5 text-primary" />
                    <h2 className="font-display text-xl font-semibold">Schedule a post</h2>
                </div>
                <p className="text-sm text-muted-foreground mb-6">Plan your next drop across platforms.</p>

                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label>Select Video</Label>
                        <Select value={selectedVideo} onValueChange={setSelectedVideo}>
                            <SelectTrigger><SelectValue placeholder="Select a completed video" /></SelectTrigger>
                            <SelectContent>
                                {videos.length === 0 ? (
                                    <SelectItem value="empty" disabled>No completed videos available</SelectItem>
                                ) : (
                                    videos.map(v => (
                                        <SelectItem key={v.id} value={v.id}>{v.title}</SelectItem>
                                    ))
                                )}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Platform</Label>
                            <Select value={platform} onValueChange={setPlatform}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="instagram">Instagram Reels</SelectItem>
                                    <SelectItem value="tiktok">TikTok</SelectItem>
                                    <SelectItem value="youtube">YouTube Shorts</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Date & time</Label>
                            <Input type="datetime-local" value={datetime} onChange={(e) => setDatetime(e.target.value)} />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Caption</Label>
                        <Textarea 
                            placeholder="Write your post caption..." 
                            value={caption} 
                            onChange={(e) => setCaption(e.target.value)} 
                            className="resize-none h-24"
                        />
                    </div>
                </div>

                <Button variant="hero" className="mt-6 w-full sm:w-auto" onClick={handleSchedule} disabled={loading || videos.length === 0}>
                    {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Scheduling...</> : "Schedule post"}
                </Button>
            </div>

            <div className="rounded-2xl border border-border bg-gradient-card shadow-card overflow-hidden">
                <div className="p-4 border-b border-border font-medium">Upcoming & Posted</div>
                
                {fetching ? (
                    <div className="p-12 text-center text-muted-foreground text-sm">Loading schedule...</div>
                ) : scheduledPosts.length === 0 ? (
                    <div className="p-12 text-center text-muted-foreground text-sm">
                        No scheduled posts yet. Create one above.
                    </div>
                ) : (
                    <div className="divide-y divide-border">
                        {scheduledPosts.map(post => (
                            <div key={post.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-muted/50 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 rounded-lg bg-secondary overflow-hidden shrink-0">
                                        {post.videos?.thumbnail_url ? (
                                            <img src={post.videos.thumbnail_url} alt="thumbnail" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-muted-foreground bg-primary/10">
                                                <CalendarClock className="h-6 w-6" />
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <p className="font-medium text-sm">{post.videos?.title || 'Unknown Video'}</p>
                                        <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">{post.caption || 'No caption'}</p>
                                        <div className="flex gap-2 mt-2">
                                            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                                                {post.platform}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2">
                                    <div className="text-xs text-muted-foreground">
                                        {new Date(post.scheduled_time).toLocaleString(undefined, {
                                            month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit'
                                        })}
                                    </div>
                                    <div className={`text-xs font-medium flex items-center gap-1 ${post.status === 'posted' ? 'text-green-500' : 'text-amber-500'}`}>
                                        {post.status === 'posted' ? <CheckCircle className="h-3 w-3" /> : <CalendarClock className="h-3 w-3" />}
                                        {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};

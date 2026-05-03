import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Upload, ImageIcon, X, Sparkles, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { uploadThumbnail, createVideo } from "@/services/videoService";
import { supabase } from "@/lib/supabaseClient";

export const UploadSection = () => {
    const [files, setFiles] = useState<File[]>([]);
    const [description, setDescription] = useState("");
    const [generating, setGenerating] = useState(false);

    const handleFiles = (list: FileList | null) => {
        if (!list) return;
        setFiles((prev) => [...prev, ...Array.from(list)].slice(0, 8));
    };

    const handleGenerate = async () => {
        if (!files.length || !description.trim()) {
            toast.error("Add at least one image and a description.");
            return;
        }
        
        setGenerating(true);
        const title = description.split(" ").slice(0, 6).join(" ") || "Untitled video";
        
        try {
            toast.info("Uploading images...");
            const imageUrls: string[] = [];
            
            // Upload all images
            for (const file of files) {
                const { data: url, error: uploadError } = await uploadThumbnail(file);
                if (uploadError) throw uploadError;
                if (url) imageUrls.push(url);
            }

            if (!imageUrls || imageUrls.length === 0) {
                throw new Error("No images uploaded");
            }

            // Get session token
            const { data: sessionData } = await supabase.auth.getSession();
            const token = sessionData?.session?.access_token;
            const user = sessionData?.session?.user;

            if (!user) throw new Error("Not authenticated");

            const { data: video, error } = await supabase
                .from("videos")
                .insert({
                    title: description || "Generated Video",
                    description,
                    thumbnail_url: imageUrls[0],
                    status: "Processing",
                    user_id: user.id
                })
                .select()
                .single();

            // Validate response:
            if (error || !video?.id) {
                throw new Error("Failed to create video record");
            }

            console.log("Sending payload:", {
                video_id: video.id,
                image_urls: imageUrls
            });

            // Trigger backend generation
            const response = await fetch("http://localhost:3001/api/generate-video", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    video_id: video.id,
                    image_urls: imageUrls,
                    access_token: token
                })
            });

            if (!response.ok) {
                const errData = await response.json().catch(() => ({}));
                throw new Error(errData.error || "Failed to trigger video generation");
            }

            setFiles([]);
            setDescription("");
            toast.success("Video queued — generating now!");

        } catch (error: any) {
            console.error("Video generation error:", error);
            toast.error(error.message || "An error occurred while queuing the video.");
        } finally {
            setGenerating(false);
        }
    };

    return (
        <section id="generate" className="rounded-2xl border border-border bg-gradient-card p-6 shadow-card">
            <div className="flex items-center gap-2 mb-1">
                <Sparkles className="h-5 w-5 text-primary" />
                <h2 className="font-display text-xl font-semibold">Generate a new video</h2>
            </div>
            <p className="text-sm text-muted-foreground mb-6">Upload photos, describe the vibe, and Vireon will build it for you.</p>

            <label className="block">
                <div className="border-2 border-dashed border-border rounded-2xl p-8 text-center hover:border-primary/50 hover:bg-primary/5 transition-smooth cursor-pointer">
                    <Upload className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                    <p className="font-medium">Drop images here or click to upload</p>
                    <p className="text-xs text-muted-foreground mt-1">PNG, JPG up to 8 files</p>
                    <input type="file" accept="image/*" multiple className="hidden" onChange={(e) => handleFiles(e.target.files)} />
                </div>
            </label>

            {files.length > 0 && (
                <div className="grid grid-cols-4 gap-3 mt-4">
                    {files.map((f, i) => (
                        <div key={i} className="relative group aspect-square rounded-xl bg-secondary border border-border overflow-hidden">
                            <img src={URL.createObjectURL(f)} alt={f.name} className="w-full h-full object-cover" />
                            <button
                                onClick={() => setFiles(files.filter((_, idx) => idx !== i))}
                                className="absolute top-1 right-1 p-1 rounded-full bg-background/80 opacity-0 group-hover:opacity-100 transition-smooth"
                            >
                                <X className="h-3 w-3" />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            <div className="mt-6 space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                    <ImageIcon className="h-4 w-4" /> Description
                </label>
                <Textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="e.g. Cozy autumn menu launch at our café — warm vibes, latte art, steam, fast cuts."
                    className="min-h-[100px] resize-none"
                />
            </div>

            <Button variant="hero" size="lg" className="w-full mt-6" onClick={handleGenerate} disabled={generating}>
                {generating ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating…</> : "Generate Video"}
            </Button>
        </section>
    );
};

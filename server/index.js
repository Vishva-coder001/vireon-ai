import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import ffmpeg from 'fluent-ffmpeg';
import ffmpegStatic from 'ffmpeg-static';
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Load .env from parent directory
dotenv.config({ path: path.resolve(process.cwd(), '../.env') });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure FFmpeg path is set correctly
ffmpeg.setFfmpegPath(ffmpegStatic);

const app = express();
app.use(cors({
  origin: "*",
  methods: ["GET", "POST"],
}));
app.use(express.json());

// In local dev, Vite might be running in a different cwd context, so fallbacks are helpful.
const supabaseUrl = process.env.VITE_SUPABASE_URL || "YOUR_SUPABASE_URL";
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || "YOUR_SUPABASE_ANON_KEY";

app.post('/api/generate-video', async (req, res) => {
    console.log("Received request:", req.body);
    const { video_id, image_urls, access_token } = req.body;

    if (!video_id || !image_urls || image_urls.length === 0) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    // Immediately return response to non-block UI
    res.status(200).json({ message: 'Job started' });

    // Process asynchronously
    try {
        console.log(`[Job ${video_id}] Starting video generation...`);
        // Initialize Supabase client with user's access token to bypass RLS policies
        const supabase = createClient(supabaseUrl, supabaseAnonKey, {
            global: {
                headers: {
                    Authorization: `Bearer ${access_token}`
                }
            }
        });

        // 1. Download images to temp directory
        const tempDir = path.join(__dirname, 'temp', video_id);
        if (!fs.existsSync(tempDir)) {
            fs.mkdirSync(tempDir, { recursive: true });
        }

        const localImages = [];
        for (let i = 0; i < image_urls.length; i++) {
            const imgUrl = image_urls[i];
            const response = await fetch(imgUrl);
            if (!response.ok) throw new Error(`Failed to download image: ${imgUrl}`);
            const buffer = await response.arrayBuffer();
            const filePath = path.join(tempDir, `img_${i}.jpg`);
            fs.writeFileSync(filePath, Buffer.from(buffer));
            localImages.push(filePath);
        }

        // 2. Generate video using FFmpeg
        const outputVideoPath = path.join(tempDir, `output.mp4`);
        
        // We use image sequence: img_0.jpg, img_1.jpg ...
        const imgSequenceCommand = ffmpeg()
            .input(path.join(tempDir, 'img_%d.jpg'))
            .inputOptions([
                '-framerate 1/2' // 2 seconds per image
            ])
            .outputOptions([
                '-c:v libx264',
                '-pix_fmt yuv420p',
                '-vf scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920' // Format for TikTok/Reels
            ])
            .save(outputVideoPath);

        await new Promise((resolve, reject) => {
            imgSequenceCommand.on('end', resolve).on('error', reject);
        });

        console.log(`[Job ${video_id}] FFmpeg render complete.`);

        // 3. Upload to Supabase Storage (videos bucket)
        const videoBuffer = fs.readFileSync(outputVideoPath);
        const videoFileName = `${video_id}.mp4`;
        
        const { error: uploadError } = await supabase.storage
            .from('videos')
            .upload(videoFileName, videoBuffer, {
                contentType: 'video/mp4',
                upsert: true
            });

        if (uploadError) {
            console.error(`[Job ${video_id}] Storage upload failed:`, uploadError);
            throw uploadError;
        }

        const { data: publicUrlData } = supabase.storage
            .from('videos')
            .getPublicUrl(videoFileName);
        
        const videoUrl = publicUrlData.publicUrl;

        // 4. Update Database
        const { error: updateError } = await supabase
            .from('videos')
            .update({ status: 'Completed', video_url: videoUrl })
            .eq('id', video_id);

        if (updateError) {
            console.error(`[Job ${video_id}] DB update failed:`, updateError);
            throw updateError;
        }

        console.log(`[Job ${video_id}] Video successfully deployed!`);

        // 5. Cleanup
        fs.rmSync(tempDir, { recursive: true, force: true });

    } catch (err) {
        console.error(`[Job ${video_id}] Failed:`, err);
        // Fallback update to failed
        try {
            const supabase = createClient(supabaseUrl, supabaseAnonKey, {
                global: { headers: { Authorization: `Bearer ${access_token}` } }
            });
            await supabase.from('videos').update({ status: 'Failed' }).eq('id', video_id);
        } catch (e) {
            console.error('Failed to update status to Failed', e);
        }
    }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Backend server running on port ${PORT}`);
});

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import ffmpeg from 'fluent-ffmpeg';
import ffmpegStatic from 'ffmpeg-static';
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Load env (works locally + Railway)
dotenv.config();

// Fix __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Set FFmpeg path
ffmpeg.setFfmpegPath(ffmpegStatic);

// Init app
const app = express();
app.use(cors({ origin: "*", methods: ["GET", "POST"] }));
app.use(express.json());

// ✅ PRODUCTION ENV VARIABLES (NO VITE)
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    console.error("❌ Missing Supabase env variables");
    process.exit(1);
}

// ✅ Use SERVICE ROLE (bypasses RLS safely on backend)
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// =============================
// VIDEO GENERATION ENDPOINT
// =============================
app.post('/api/generate-video', async (req, res) => {
    console.log("📥 Request:", req.body);

    const { video_id, image_urls } = req.body;

    if (!video_id || !image_urls || image_urls.length === 0) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    // Respond immediately (non-blocking UI)
    res.status(200).json({ message: 'Job started' });

    try {
        console.log(`🎬 [${video_id}] Processing started`);

        // =============================
        // 1. CREATE TEMP DIR
        // =============================
        const tempDir = path.join(__dirname, 'temp', video_id);
        fs.mkdirSync(tempDir, { recursive: true });

        const localImages = [];

        // =============================
        // 2. DOWNLOAD IMAGES
        // =============================
        for (let i = 0; i < image_urls.length; i++) {
            const imgUrl = image_urls[i];

            const response = await fetch(imgUrl);
            if (!response.ok) throw new Error(`Image download failed`);

            const buffer = await response.arrayBuffer();
            const filePath = path.join(tempDir, `img_${i}.jpg`);

            fs.writeFileSync(filePath, Buffer.from(buffer));
            localImages.push(filePath);
        }

        console.log(`📸 [${video_id}] Images downloaded`);

        // =============================
        // 3. GENERATE VIDEO (FFMPEG)
        // =============================
        const outputVideoPath = path.join(tempDir, `output.mp4`);

        await new Promise((resolve, reject) => {
            ffmpeg()
                .input(path.join(tempDir, 'img_%d.jpg'))
                .inputOptions(['-framerate 1/2']) // 2 sec/image
                .outputOptions([
                    '-c:v libx264',
                    '-pix_fmt yuv420p',
                    '-vf scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920'
                ])
                .on('end', resolve)
                .on('error', reject)
                .save(outputVideoPath);
        });

        console.log(`🎞️ [${video_id}] Video generated`);

        // =============================
        // 4. UPLOAD TO SUPABASE
        // =============================
        const videoBuffer = fs.readFileSync(outputVideoPath);
        const fileName = `${video_id}.mp4`;

        const { error: uploadError } = await supabase.storage
            .from('videos')
            .upload(fileName, videoBuffer, {
                contentType: 'video/mp4',
                upsert: true
            });

        if (uploadError) {
            console.error("❌ Upload failed:", uploadError);
            throw uploadError;
        }

        const { data } = supabase.storage
            .from('videos')
            .getPublicUrl(fileName);

        const videoUrl = data.publicUrl;

        console.log(`☁️ [${video_id}] Uploaded`);

        // =============================
        // 5. UPDATE DATABASE
        // =============================
        const { error: dbError } = await supabase
            .from('videos')
            .update({
                status: 'completed',
                video_url: videoUrl
            })
            .eq('id', video_id);

        if (dbError) throw dbError;

        console.log(`✅ [${video_id}] Completed`);

        // =============================
        // 6. CLEANUP
        // =============================
        fs.rmSync(tempDir, { recursive: true, force: true });

    } catch (err) {
        console.error(`🔥 [${video_id}] Failed:`, err);

        // Update status to failed
        await supabase
            .from('videos')
            .update({ status: 'failed' })
            .eq('id', video_id);
    }
});

// =============================
// START SERVER
// =============================
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
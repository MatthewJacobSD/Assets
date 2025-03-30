import { NextResponse } from 'next/server';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import sharp from 'sharp';

// Only these image types are allowed - no sus formats
const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

export async function POST(request: Request) {
    // Get that form data from the frontend
    const data = await request.formData();
    const file: File | null = data.get('image') as unknown as File;

    // If no file was sent, throw hands
    if (!file) {
        return NextResponse.json({ error: 'No image provided' }, { status: 400 });
    }

    // Check if file type is valid - we don't do random files here
    if (!allowedMimeTypes.includes(file.type)) {
        return NextResponse.json(
            { error: 'Only JPEG, PNG, WEBP, and GIF images are allowed' },
            { status: 400 }
        );
    }

    // Convert that file to something we can work with
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Set up where we gonna store these fire pics
    const uploadDir = path.join(process.cwd(), 'public/uploads');

    // Give each file a unique name - no duplicates allowed
    const uniqueName = `${uuidv4()}${path.extname(file.name)}`;
    const filePath = path.join(uploadDir, uniqueName);

    // Process image with sharp - making it look crisp
    await sharp(buffer)
        .resize(1200, 1200, { fit: 'inside', withoutEnlargement: true }) // Keep it reasonable size
        .toFormat('webp') // WebP is the GOAT format
        .toFile(filePath); // Save that bad boy

    // Tell the frontend everything went smooth
    return NextResponse.json({
        success: true,
        fileName: file.name, // Original name for flexing
        fileSize: file.size, // How big that file be
        fileUrl: `/uploads/${uniqueName}`, // Where to find it
    });
}
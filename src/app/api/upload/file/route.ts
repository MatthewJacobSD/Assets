import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: Request) {
    // Get that file data from the frontend
    const data = await request.formData();
    const file: File | null = data.get('file') as unknown as File;

    // If they forgot to attach a file, throw an L
    if (!file) {
        return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Convert file to something we can work with
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Set up our file storage spot
    const uploadDir = path.join(process.cwd(), 'public/uploads');
    try {
        // Check if directory already exists
        await (await import('fs')).promises.access(uploadDir);
    } catch {
        // If not, create it - we gotchu
        await (await import('fs')).promises.mkdir(uploadDir, { recursive: true });
    }

    // Give each file a unique name - no duplicates in the club
    const uniqueName = `${uuidv4()}${path.extname(file.name)}`;
    const filePath = path.join(uploadDir, uniqueName);

    // Actually save the file - mission accomplished
    await writeFile(filePath, buffer);

    // Send back the success message with file deets
    return NextResponse.json({
        success: true,
        fileName: file.name, // Original name
        fileSize: file.size, // How much space it taking
        fileUrl: `/uploads/${uniqueName}`, // Where to find it
    });
}
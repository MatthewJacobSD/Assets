'use client'; // Client-side only - no cap

import React, { useState, useRef, ChangeEvent } from 'react';
import Image from "next/image"; // For that crispy optimized image loading

/*
  Type definitions - we don't do 'any' here
  This is how we keep our code from being sus
*/
type UploadResult = {
    success: boolean; // Yeet or no yeet?
    fileName: string; // OG file name
    fileSize: number; // How big? That's what she said
    fileUrl: string; // Where the file be posted up
    error?: string; // When things go oopsie
};

type ErrorResult = {
    error: string; // Straight up fail
};

export default function UploadPage() {
    // State variables - our app's memory
    const [file, setFile] = useState<File | null>(null); // Current file pick
    const [image, setImage] = useState<File | null>(null); // Current image pick
    const [imagePreview, setImagePreview] = useState<string | null>(null); // Image preview URL
    const [fileResult, setFileResult] = useState<UploadResult | ErrorResult | null>(null); // File upload outcome
    const [imageResult, setImageResult] = useState<UploadResult | ErrorResult | null>(null); // Image upload outcome
    const [isUploading, setIsUploading] = useState(false); // Loading state - plz wait

    // Refs for our file inputs - so we can reset them like nothing happened
    const fileInputRef = useRef<HTMLInputElement>(null);
    const imageInputRef = useRef<HTMLInputElement>(null);

    // When you pick a file - basic file selector behavior
    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFile(e.target.files[0]); // Only take the first file - we ain't greedy
        }
    };

    // When you pick an image - same but with extra sauce
    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedImage = e.target.files[0];
            setImage(selectedImage);

            // Create a preview - gotta see that fire before posting
            const reader = new FileReader();
            reader.onload = () => {
                if (reader.readyState === 2) { // 2 = DONE (HTML5 stuff)
                    setImagePreview(reader.result as string);
                }
            };
            reader.readAsDataURL(selectedImage); // Convert to base64 for preview
        }
    };

    // When you submit a file - let's get this bread
    const handleFileUpload = async (e: React.FormEvent) => {
        e.preventDefault(); // No page refresh - we fancy now
        if (!file) return; // If no file, why we here?

        setIsUploading(true); // Loading spinner go brrr
        const formData = new FormData();
        formData.append('file', file); // Pack it up

        try {
            const response = await fetch('/api/upload/file', {
                method: 'POST',
                body: formData,
            });

            const result: UploadResult = await response.json();
            setFileResult(result); // Show results - flex on 'em
        } catch (error) {
            console.error('Error uploading file:', error);
            setFileResult({ error: 'Failed to upload file' }); // Oof moment
        } finally {
            setIsUploading(false); // Loading done
            if (fileInputRef.current) fileInputRef.current.value = ''; // Reset input
            setFile(null); // Clear selection
        }
    };

    // When you submit an image - same vibe but for pics
    const handleImageUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!image) return;

        setIsUploading(true);
        const formData = new FormData();
        formData.append('image', image);

        try {
            const response = await fetch('/api/upload/image', {
                method: 'POST',
                body: formData,
            });

            const result: UploadResult = await response.json();
            setImageResult(result);
        } catch (error) {
            console.error('Error uploading image:', error);
            setImageResult({ error: 'Failed to upload image' });
        } finally {
            setIsUploading(false);
            if (imageInputRef.current) imageInputRef.current.value = '';
            setImage(null);
            setImagePreview(null); // Clear preview too
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-8">Next.js File Uploader</h1>

            <div className="grid md:grid-cols-2 gap-8">
                {/* File Upload Section - for all your document needs */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4">File Upload</h2>
                    <form onSubmit={handleFileUpload} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Select File</label>
                            <input
                                type="file"
                                onChange={handleFileChange}
                                ref={fileInputRef}
                                className="w-full px-3 py-2 border rounded-md"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={isUploading || !file}
                            className={`w-full py-2 px-4 rounded-md text-white ${
                                isUploading || !file
                                    ? 'bg-gray-400 cursor-not-allowed'
                                    : 'bg-blue-600 hover:bg-blue-700'
                            }`}
                        >
                            {isUploading ? 'Uploading...' : 'Upload File'}
                        </button>
                    </form>

                    {fileResult && (
                        <div className="mt-4 p-3 rounded-md bg-gray-50">
                            {'error' in fileResult ? (
                                <p className="text-red-500">{fileResult.error}</p>
                            ) : (
                                <>
                                    <p className="font-medium">Upload successful!</p>
                                    <p>Original name: {fileResult.fileName}</p>
                                    <p>Size: {(fileResult.fileSize / 1024).toFixed(2)} KB</p>
                                    {fileResult.fileUrl && (
                                        <a
                                            href={fileResult.fileUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-600 hover:underline"
                                        >
                                            View File
                                        </a>
                                    )}
                                </>
                            )}
                        </div>
                    )}
                </div>

                {/* Image Upload Section - for your fire memes */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4">Image Upload</h2>
                    <form onSubmit={handleImageUpload} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Select Image</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                ref={imageInputRef}
                                className="w-full px-3 py-2 border rounded-md"
                                required
                            />
                        </div>
                        {imagePreview && (
                            <div className="mt-2">
                                <p className="text-sm mb-1">Preview:</p>
                                <Image
                                    src={imagePreview}
                                    alt="Preview"
                                    width={300}
                                    height={200}
                                    className="max-w-full h-auto max-h-40 rounded-md"
                                />
                            </div>
                        )}
                        <button
                            type="submit"
                            disabled={isUploading || !image}
                            className={`w-full py-2 px-4 rounded-md text-white ${
                                isUploading || !image
                                    ? 'bg-gray-400 cursor-not-allowed'
                                    : 'bg-green-600 hover:bg-green-700'
                            }`}
                        >
                            {isUploading ? 'Uploading...' : 'Upload Image'}
                        </button>
                    </form>

                    {imageResult && (
                        <div className="mt-4 p-3 rounded-md bg-gray-50">
                            {'error' in imageResult ? (
                                <p className="text-red-500">{imageResult.error}</p>
                            ) : (
                                <>
                                    <p className="font-medium">Upload successful!</p>
                                    <p>Original name: {imageResult.fileName}</p>
                                    <p>Size: {(imageResult.fileSize / 1024).toFixed(2)} KB</p>
                                    {imageResult.fileUrl && (
                                        <div className="mt-2">
                                            <a
                                                href={imageResult.fileUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-600 hover:underline"
                                            >
                                                View Image
                                            </a>
                                            <Image
                                                src={imageResult.fileUrl}
                                                alt="Uploaded preview"
                                                width={300}
                                                height={200}
                                                className="mt-2 max-w-full h-auto max-h-40 rounded-md"
                                            />
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
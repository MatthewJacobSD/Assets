# 🚀 Next.js File & Image Uploader

## 📌 Overview
This project is a **Next.js-based** file and image uploader with a smooth and fire user experience. It lets you **upload files and images**, process them, and serve them efficiently. Built with **Sharp** for image optimization and **UUID** for unique file naming, this setup is **modern, clean, and hella fast.**

## 🔥 Features
- 📂 **File Uploads** – Drop your docs, PDFs, or any files.
- 🖼️ **Image Uploads** – Supports JPEG, PNG, WEBP, and GIF formats.
- 🎨 **Auto Image Optimization** – Resizes images to 1200x1200 and converts them to WebP.
- 🔗 **Unique File Naming** – Prevents duplicate file names.
- ⚡ **Next.js API Routes** – Server-side processing for better performance.
- 🎭 **Full UI Integration** – Built with TailwindCSS for a sleek look.

---

## 📂 Project Structure
```
project-root/
├── public/
│   ├── uploads/       # Uploaded files live here
├── app/
│   ├── UploadPage.tsx # Main upload UI
│   ├── page.tsx       # Home page with upload component
├── pages/
│   ├── api/
│   │   ├── upload/
│   │   │   ├── file.ts # Handles file uploads
│   │   │   ├── image.ts # Handles image uploads
├── styles/            # Tailwind styling
├── package.json       # Dependencies
```

---

## 🛠️ Installation & Setup
### 1️⃣ Clone the Repo
```bash
git clone https://github.com/yourusername/nextjs-uploader.git
cd nextjs-uploader
```

### 2️⃣ Install Dependencies
```bash
yarn install # or npm install
```

### 3️⃣ Run the Dev Server
```bash
yarn dev # or npm run dev
```

---

## 🏗️ API Endpoints
### **📂 File Upload**
#### `POST /api/upload/file`
- **Request:**
    - `multipart/form-data`
    - `file` (required): The file to be uploaded.
- **Response:**
```json
{
  "success": true,
  "fileName": "document.pdf",
  "fileSize": 12345,
  "fileUrl": "/uploads/random-uuid.pdf"
}
```

### **🖼️ Image Upload**
#### `POST /api/upload/image`
- **Request:**
    - `multipart/form-data`
    - `image` (required): The image file.
- **Response:**
```json
{
  "success": true,
  "fileName": "image.png",
  "fileSize": 54321,
  "fileUrl": "/uploads/random-uuid.webp"
}
```

---

## 🎨 UI & UX
- Uses **TailwindCSS** for a clean, responsive design.
- **Image Previews** before uploading.
- Shows **upload progress and success messages**.

---

## 🚀 Future Improvements
- 🔄 **Drag & Drop Uploads**
- 📝 **File Type Restrictions for Docs**
- 🎨 **Customizable Themes**
- 📡 **Cloud Storage Integration (S3, Firebase, etc.)**

---

## 👥 Contributing
1. Fork the repo & clone it.
2. Create a feature branch.
3. Push changes & open a PR.

---

## 📜 License
#### Author
MatthewJacobSD

MIT License. Go wild. 🚀



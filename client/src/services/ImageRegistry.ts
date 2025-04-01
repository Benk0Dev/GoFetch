import imageCompression from 'browser-image-compression';

import { API_URL } from "@client/services/Registry";

export async function uploadImage(file: File) {
  try {
    const compressedFile = await imageCompression(file, {
      maxSizeMB: 0.95,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
      initialQuality: 0.9,
      fileType: file.type
    });

    const formData = new FormData();
    formData.append("image", compressedFile);

    const response = await fetch(`${API_URL}/upload-image`, {
      method: "POST",
      body: formData
    });

    if (response.ok) {
      const data = await response.json();
      return data.filename;
    } else {
      const text = await response.text();
      console.error(text);
      return null;
    }
  } catch (e) {
    console.error(e);
    return null;
  }
}

export async function getImageByFilename(filename: string | undefined | null) {
  if (!filename || filename.startsWith("blob:")) return null;

  try {
    const response = await fetch(`${API_URL}/image/${filename}`);
    if (response.ok) {
      const data = await response.blob();
      return URL.createObjectURL(data);
    } else {
      return null;
    }
  } catch (e) {
    console.error("Failed to fetch image:", filename, e);
    return null;
  }
}
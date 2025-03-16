export default function getFullFilePath(fileName: string): string {
    if (!fileName) return ""; // Handle empty filename case

    // Define the correct relative path inside the public folder
    const basePath = "/images/user_images"; 

    // Ensure there's no double slashes
    const cleanFileName = fileName.startsWith("/") ? fileName.slice(1) : fileName;

    return `${basePath}/${cleanFileName}`;
}
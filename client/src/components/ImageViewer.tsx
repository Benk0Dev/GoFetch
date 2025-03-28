import { useEffect } from "react";
import { X } from "lucide-react";
import styles from "@client/components/ImageViewer.module.css";

interface ImageViewerProps {
    imageSrc: string;
    onClose: () => void;
}

function ImageViewer({ imageSrc, onClose }: ImageViewerProps) {
    useEffect(() => {
        const preventScroll = (e: Event) => e.preventDefault();

        const preventKeys = (e: KeyboardEvent) => {
            const keys = ["ArrowUp", "ArrowDown", "PageUp", "PageDown", " "];
            if (keys.includes(e.key)) e.preventDefault();
            if (e.key === "Escape") onClose();
        };

        document.addEventListener("wheel", preventScroll, { passive: false });
        document.addEventListener("touchmove", preventScroll, { passive: false });
        document.addEventListener("keydown", preventKeys);

        return () => {
            document.removeEventListener("wheel", preventScroll);
            document.removeEventListener("touchmove", preventScroll);
            document.removeEventListener("keydown", preventKeys);
        };
    }, []);

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.imageContainer} onClick={(e) => e.stopPropagation()}>
                <button className={styles.closeButton} onClick={onClose}>
                    <X size={28} strokeWidth={2.5} />
                </button>
                <img src={imageSrc} alt="Full View" />
            </div>
        </div>
    );
}

export default ImageViewer;

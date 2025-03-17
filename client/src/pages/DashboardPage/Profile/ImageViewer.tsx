import styles from "./ImageViewer.module.css";

interface ImageViewerProps {
    imageSrc: string;
    onClose: () => void;
}

function ImageViewer({ imageSrc, onClose }: ImageViewerProps) {
    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.imageContainer} onClick={(e) => e.stopPropagation()}>
                <img src={imageSrc} alt="Full View" />
            </div>
        </div>
    );
}

export default ImageViewer;

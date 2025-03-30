import styles from "@client/pages/DashboardPage/Bookings/CreateReview.module.css";
import { useEffect, useState } from "react";
import { Star } from "lucide-react";

function CreateReview({ onSubmit, onCancel, minder }: { onSubmit: (rating: number, reviewText: string) => void, onCancel: () => void, minder: any }) {
    const [rating, setRating] = useState<number>(0);
    const [reviewText, setReviewText] = useState("");
    const [hoveredRating, setHoveredRating] = useState<number>(0);

    useEffect(() => {
        const preventScroll = (e: Event) => e.preventDefault();

        const preventKeys = (e: KeyboardEvent) => {
            const isTextAreaFocused = document.activeElement && document.activeElement.tagName === "TEXTAREA";

            if (!isTextAreaFocused) {
                const keys = ["ArrowUp", "ArrowDown", "PageUp", "PageDown", " "];
                if (keys.includes(e.key)) e.preventDefault();
            }
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

    const handleRatingChange = (ratingValue: number) => {
        setRating(ratingValue);
    };

    const handleStarHover = (hoverValue: number) => {
        setHoveredRating(hoverValue);
    };

    return (
        <div className={styles.modalBackdrop}>
            <div className={styles.modal}>
                <h3>Leave a Review for {minder.name.fname} {minder.name.sname}</h3>
                <div className={styles.rating}>
                    {[1, 2, 3, 4, 5].map((value) => (
                        <Star
                            size={24}
                            strokeWidth={2}
                            key={value}
                            onClick={() => handleRatingChange(value)}
                            onMouseEnter={() => handleStarHover(value)}
                            onMouseLeave={() => handleStarHover(0)} 
                            className={`${rating >= value || hoveredRating >= value ? styles.selected : ''}`}
                        />
                    ))}
                </div>
                <textarea
                    placeholder="Write your review here..."
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                />
                <div className={styles.modalActions}>
                    <button className={`btn btn-secondary ${styles.cancelBtn}`} onClick={onCancel}>
                        Cancel
                    </button>
                    <button className="btn btn-primary" onClick={() => onSubmit(rating, reviewText)}>
                        Submit
                    </button>
                </div>
            </div>
        </div>
    );
}

export default CreateReview;

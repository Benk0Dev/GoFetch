import styles from "./MinderPage.module.css";

function About({ minder }: { minder: any }) {
    return (
        <div className={styles.sectionContainer}>
            <div className={styles.subSectionContainer}>
                <h4>About {minder.name.fname} {minder.name.sname}</h4>
                <p>{minder.minderRoleInfo.bio}</p>
                <div>
                    <span>Availability</span>
                    <p>{minder.minderRoleInfo.availability}</p>
                </div>

            </div>
            <div className={styles.subSectionContainer}>
                <h4>Gallery</h4>
                <p>Photos from previous pet minding sessions.</p>
                {minder.minderRoleInfo.pictures.length > 0 ? (
                    <div className={styles.gallery}>
                        {minder.minderRoleInfo.pictures.map((image: string, index: number) => (
                            <img
                                key={index}
                                src={image}
                                alt={`Gallery image ${index + 1}`}
                                className={styles.galleryImage}
                            />
                        ))}
                    </div>
                ) : (
                    <p>No pictures available.</p>
                )}
                
            </div>
        </div>
    );

}

export default About;

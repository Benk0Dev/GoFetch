import styles from "./Home.module.css";

function Statistic({ icon, title, value }: { icon: any, title: string, value: string }) {
    return (
        <div className={styles.statistic}>
            <div className={styles.statisticContent}>
                <p>{title}</p>
                <h3>{value}</h3>
            </div>
            {icon}
        </div>
    );
}

export default Statistic;
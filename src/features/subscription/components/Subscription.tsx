
import styles from './Subscription.module.css';


const Subscription = () => {
    const handleSubscribe = () => {
        alert("Tack för att du prenumererar!");
    };

    return (
        <div className={styles.subscriptionContainer}>
            <div className={styles.banner}>59 kr/mån</div>

            <div className={styles.planName}>PREMIUM</div>

            <ul className={styles.subscriptionList}>
                <li>Använd AI för att fördjupa dina anteckningar</li>
                <li>Använd AI för att.......</li>
                <li>Använd AI för att..........</li>
                <li>Använd AI för att....</li>
            </ul>

            <button onClick={handleSubscribe}>Köp</button>
        </div>
    );
};

export default Subscription;

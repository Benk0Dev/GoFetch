import { useState } from 'react';
import { IType, IDuration, INewService } from '../../../models/IService';
import styles from './Services.module.css';

function NewService( { onCancel, onAdd }: { onCancel: () => void, onAdd: (service: INewService) => void } ) {
    const [serviceType, setServiceType] = useState<IType | "">("");
    const [duration, setDuration] = useState<IDuration | "">("");
    const [price, setPrice] = useState(0);
    const [error, setError] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!serviceType || !duration || !price) {
            setError("All fields are required.");
            return;
        }
        if (price <= 0) {
            setError("Price must be greater than 0.");
            return;
        }

        const service: INewService = {
            type: serviceType,
            duration,
            price
        };
        onAdd(service);
    };

    return (
        <div className={styles.newService}>
            <h2>Add New Service</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Service Type</label>
                    <select
                        id="service-type"
                        value={serviceType}
                        onChange={(e) => setServiceType(e.target.value as IType)}
                    >
                        <option value="">Select service type</option>
                        {Object.entries(IType).map(([key, label]) => (
                            <option key={key} value={label}>{label}</option>
                        ))}
                    </select>
                    <p>Choose the type of service you want to offer.</p>
                </div>

                <div>
                    <label>Duration</label>
                    <select
                        id="duration"
                        value={duration}
                        onChange={(e) => setDuration(e.target.value as IDuration)}
                    >
                        <option value="">Select duration</option>
                        {Object.entries(IDuration).map(([key, label]) => (
                            <option key={key} value={label}>{label}</option>
                        ))}
                    </select>
                    <p>How long will this service typically take?</p>
                </div>

                <div>
                    <label>Price (£)</label>
                    <input
                        type="number"
                        id="price"
                        value={price}
                        onChange={(e) => setPrice(Number(e.target.value))}
                    />
                    <p>How much do you charge for this service?</p>
                </div>

                {error && <span className={styles.error}>{error}</span>}

                <div className={styles.addServiceButtons}>
                    <button className="btn btn-secondary" type="button" onClick={onCancel}>Cancel</button>
                    <button className="btn btn-primary" type="submit">Add Service</button>
                </div>
            </form>
        </div>
    );
}

export default NewService;

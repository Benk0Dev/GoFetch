import { useNavigate } from 'react-router-dom';
import styles from './BannedPage.module.css';
import { useAuth } from '@client/context/AuthContext';

function BannedPage() {
  const navigate = useNavigate();
  
  return (
    <div className='container'>
      <h1>Account Suspended</h1>
      <p>Your account has been suspended due to violations of our community guidelines.</p>
    </div>
  );
}

export default BannedPage;
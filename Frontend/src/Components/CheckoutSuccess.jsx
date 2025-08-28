import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { addUser } from '../utils/userSlice';
import { paymentsAPI } from '../utils/api';

function CheckoutSuccess() {
  const [status, setStatus] = useState('confirming');
  const [message, setMessage] = useState('Activating premium…');
  const dispatch = useDispatch();

  useEffect(() => {
    const url = new URL(window.location.href);
    const phonePeTxnId = url.searchParams.get('txnId');
    const tier = url.searchParams.get('tier');

    const confirm = async () => {
      try {
        const res = await paymentsAPI.confirmPhonePePayment({ txnId: phonePeTxnId, membershipTier: tier });
        // Update local user cache so UI unlocks premium
        if (res?.user) {
          dispatch(addUser(res.user));
        }
        setStatus('success');
        setMessage('Premium activated. Enjoy!');
      } catch (err) {
        setStatus('error');
        setMessage('We could not confirm the payment. Contact support if charged.');
      }
    };
    if (sessionId) confirm();
    else {
      setStatus('error');
      setMessage('Missing session id.');
    }
  }, [dispatch]);

  return (
    <div className="flex flex-col items-center justify-center py-10 gap-4">
      <h1 className={`text-2xl font-bold ${status === 'success' ? 'text-success' : status === 'error' ? 'text-error' : ''}`}>
        {status === 'confirming' ? 'Payment successful' : status === 'success' ? 'Premium activated' : 'Confirmation issue'}
      </h1>
      <p className="text-base-content/80">{message}</p>
    </div>
  );
}

export default CheckoutSuccess;



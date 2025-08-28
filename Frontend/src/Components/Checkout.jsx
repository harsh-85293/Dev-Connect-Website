import { useState } from 'react';
import { paymentsAPI } from '../utils/api';

function Checkout() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCheckout = async (membershipTier = 'silver') => {
    try {
      setLoading(true);
      setError("");
      // Choose tier: silver (₹99) or gold (₹199)
      const pricing = {
        silver: { amount: 9900, productName: 'DevConnect Silver', productDescription: 'Premium features (Silver)' },
        gold: { amount: 19900, productName: 'DevConnect Gold', productDescription: 'Infinite requests + all perks' },
      };
      const cfg = pricing[membershipTier] || pricing.silver;
      // Try PhonePe by default
      const { url } = await paymentsAPI.createPhonePeSession({ ...cfg, membershipTier });
      if (url) {
        window.location.href = url;
      } else {
        setError("Failed to get checkout URL");
      }
    } catch (err) {
      const apiMessage = err?.response?.data?.message || err?.message || "Could not start checkout. Please try again.";
      setError(apiMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-10 gap-6 px-4">
      <h1 className="text-2xl font-bold">Upgrade Membership</h1>
      <p className="text-base-content/80">Choose a plan that fits you</p>

      {error && (
        <div className="alert alert-error max-w-2xl">
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
        {/* Silver Card */}
        <div className="card bg-base-100 shadow-xl border border-base-300">
          <div className="card-body">
            <h2 className="card-title flex items-center gap-2">
              <span className="text-blue-600">Silver</span>
              <span className="badge badge-info">₹99</span>
            </h2>
            <p className="text-base-content/70">Essential premium perks</p>
            <ul className="list-disc pl-5 text-sm text-base-content/80 space-y-1 mt-2">
              <li>Blue tick on your profile</li>
              <li>Up to 100 connection requests per day</li>
              <li>Boosted feed visibility</li>
            </ul>
            <div className="card-actions justify-end mt-4">
              <button
                className="btn btn-primary"
                onClick={() => handleCheckout('silver')}
                disabled={loading}
              >
                {loading ? 'Redirecting…' : 'Get Silver'}
              </button>
            </div>
          </div>
        </div>

        {/* Gold Card */}
        <div className="card bg-base-100 shadow-xl border border-yellow-400">
          <div className="card-body">
            <h2 className="card-title flex items-center gap-2">
              <span className="text-yellow-600">Gold</span>
              <span className="badge" style={{backgroundColor: '#facc15', color: '#000'}}>₹199</span>
            </h2>
            <p className="text-base-content/70">Everything in Silver, plus more</p>
            <ul className="list-disc pl-5 text-sm text-base-content/80 space-y-1 mt-2">
              <li>Gold badge + crown highlight</li>
              <li>Infinite connection requests</li>
              <li>Priority placement in feeds</li>
            </ul>
            <div className="card-actions justify-end mt-4">
              <button
                className="btn btn-warning"
                onClick={() => handleCheckout('gold')}
                disabled={loading}
              >
                {loading ? 'Redirecting…' : 'Get Gold'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;



import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

function Premium() {
  const user = useSelector((state) => state.user);

  if (!user?.isPremium) {
    return (
      <div className="flex flex-col items-center justify-center py-10 gap-4">
        <h1 className="text-2xl font-bold">Premium required</h1>
        <p className="text-base-content/80">Unlock this page by purchasing premium.</p>
        <Link to="/checkout" className="btn btn-primary">Go to Checkout</Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-10 gap-4">
      <h1 className="text-3xl font-bold">Welcome to Premium</h1>
      {user.membershipTier === 'gold' ? (
        <p className="text-base-content/80">Gold membership active: infinite requests, priority features, and more.</p>
      ) : (
        <p className="text-base-content/80">Silver membership active: 100 requests/day, blue tick, and more.</p>
      )}
      <ul className="list-disc mt-4 text-base-content/80">
        <li>Blue tick on your profile</li>
        <li>{user.membershipTier === 'gold' ? 'Infinite connection requests' : 'Up to 100 requests/day'}</li>
        <li>Boosted feed visibility</li>
      </ul>
    </div>
  );
}

export default Premium;



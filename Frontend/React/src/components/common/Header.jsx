import { Link } from 'react-router-dom';
import { ConnectButton } from '@rainbow-me/rainbowkit';

export default function Header() {
  return (
    <header>
      <Link to="/" className="logo">
        CommitLock
      </Link>
      <ConnectButton />
    </header>
  );
}

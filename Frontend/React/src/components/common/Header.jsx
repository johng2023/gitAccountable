import { Link } from 'react-router-dom';
import { ConnectButton } from '@rainbow-me/rainbowkit';

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-slate-900 border-b border-slate-700 flex justify-between items-center px-10 z-50">
      <Link to="/" className="text-2xl font-bold text-blue-500">
        CommitLock
      </Link>
      <ConnectButton />
    </header>
  );
}

import { Outlet } from 'react-router-dom';
import Header from '../common/Header';

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-slate-900">
      <Header />
      <main className="pt-16">
        <Outlet />
      </main>
    </div>
  );
}

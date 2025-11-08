import { Outlet } from 'react-router-dom';
import Header from '../common/Header';

export default function MainLayout() {
  return (
    <div className="app-layout">
      <Header />
      <main className="app-main">
        <Outlet />
      </main>
    </div>
  );
}

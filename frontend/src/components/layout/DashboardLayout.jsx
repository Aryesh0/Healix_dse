import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

const DashboardLayout = () => {
  return (
    <div className="flex h-screen w-full overflow-hidden" style={{ background: '#f0fdf9' }}>
      <Sidebar />
      <div className="ml-[240px] flex-1 flex flex-col h-screen overflow-y-auto relative">
        <Topbar />
        <main className="flex-1 p-7" style={{ background: 'linear-gradient(135deg, #f0fdf9 0%, #f8faff 100%)' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;

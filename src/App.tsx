import { useState } from 'react';
import { AppSidebar } from './components/AppSidebar';
import { TopBar } from './components/TopBar';
import { Dashboard } from './pages/Dashboard';
import { Stocks } from './pages/Stocks';
import { Portfolio } from './pages/Portfolio';
import { Intelligence } from './pages/Intelligence';
import { SmartMoney } from './pages/SmartMoney';
import { Markets } from './pages/Markets';
import { Analysis } from './pages/Analysis';

export default function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'stocks':
        return <Stocks />;
      case 'portfolio':
        return <Portfolio />;
      case 'intelligence':
        return <Intelligence />;
      case 'smart-money':
        return <SmartMoney />;
      case 'markets':
        return <Markets />;
      case 'analysis':
        return <Analysis />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="flex">
        <AppSidebar activePage={currentPage} onNavigate={setCurrentPage} />
        <div className="flex-1 flex flex-col">
          <TopBar />
          <main className="flex-1 overflow-y-auto">
            {renderPage()}
          </main>
        </div>
      </div>
    </div>
  );
}

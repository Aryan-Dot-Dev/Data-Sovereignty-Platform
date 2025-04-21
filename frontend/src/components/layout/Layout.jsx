import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

function Layout() {
  // Force dark mode on the document
  useEffect(() => {
    document.documentElement.classList.add('dark');
    document.body.classList.add('bg-dark-500', 'text-light-200');
    
    return () => {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('bg-dark-500', 'text-light-200');
    };
  }, []);
  
  return (
    <div className="flex flex-col min-h-screen bg-dark-500">
      <Navbar />
      {/* Add padding top to account for fixed navbar */}
      <main className="flex-1 w-full mx-auto pt-16">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default Layout;
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

const Layout = () => {
  return (
    <>
      <Header />
      <main className=" w-full overflow-hidden text-white transition-all duration-200 bg-black/70 ">
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

export default Layout;

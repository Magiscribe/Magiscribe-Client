import { Outlet } from 'react-router-dom';
import Footer from '../components/nav/footer';
import { NavBar } from '../components/nav/nav-bar';

export default function Main() {
  return (
    <>
      <div className="h-full w-full fixed bg-slate-50 dark:bg-slate-900"></div>
      <div className="h-full w-full leading-normal tracking-normal text-slate-800 dark:text-white h-full absolute top-0">
        <NavBar />

        <div className="pt-2 sm:pt-24">
          <Outlet />
        </div>

        <Footer />
      </div>
    </>
  );
}

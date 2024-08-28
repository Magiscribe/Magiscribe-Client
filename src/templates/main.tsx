import { Outlet } from 'react-router-dom';
import Footer from '../components/nav/footer';
import { NavBar } from '../components/nav/nav-bar';

export default function Main() {
  return (
    <>
      <div className="h-full w-full fixed gradient"></div>
      <div className="h-full w-full leading-normal tracking-normal text-white h-full absolute top-0">
        <NavBar />

        <div className="pt-24 h-full">
          <Outlet />
        </div>

        <Footer />
      </div>
    </>
  );
}

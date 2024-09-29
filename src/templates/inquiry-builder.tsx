import { Protect, RedirectToSignIn } from '@clerk/clerk-react';
import { Outlet } from 'react-router-dom';

import Footer from '../components/nav/footer';
import { NavBar } from '../components/nav/nav-bar';

export default function InquiryBuilderTemplate() {
  return (
    <Protect fallback={<RedirectToSignIn />}>
      <div className="h-full w-full fixed gradient"></div>
      <div className="h-full w-full leading-normal tracking-normal text-white h-full absolute top-0">
        <NavBar isFixed={false} />

        <div className="mx-auto max-w-[90%] p-4">
          <Outlet />
        </div>

        <Footer />
      </div>
    </Protect>
  );
}

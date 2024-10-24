import { Protect, RedirectToSignIn } from '@clerk/clerk-react';
import { Outlet } from 'react-router-dom';

import Footer from '../components/nav/footer';
import { NavBar } from '../components/nav/nav-bar';
import clsx from 'clsx';

export default function InquiryBuilderTemplate() {
  return (
    <Protect fallback={<RedirectToSignIn />}>
      <div
        className={clsx('h-full w-full fixed', 
          'text-white dark:text-slate-800',
          'bg-gradient-to-r from-[#7133d5] to-[#0508be]',
          ' dark:from-slate-800 dark:to-slate-800',
        )}
      ></div>
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

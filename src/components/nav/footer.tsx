import React from 'react';

// interface LinkItem {
//   name: string;
//   link: string;
// }

// interface LinkGroup {
//   title: string;
//   links: LinkItem[];
// }

// const getLinksData = (): LinkGroup[] => [
//   {
//     title: "Links",
//     links: [
//       { name: "FAQ", link: "#" },
//       { name: "Help", link: "#" },
//       { name: "Support", link: "#" },
//     ],
//   },
//   {
//     title: "Legal",
//     links: [
//       { name: "Terms", link: "#" },
//       { name: "Privacy", link: "#" },
//     ],
//   },
//   {
//     title: "Social",
//     links: [
//       { name: "Facebook", link: "#" },
//       { name: "Linkedin", link: "#" },
//       { name: "Twitter", link: "#" },
//     ],
//   },
//   {
//     title: "Company",
//     links: [
//       { name: "Official Blog", link: "#" },
//       { name: "About Us", link: "#" },
//       { name: "Contact", link: "#" },
//     ],
//   },
// ];

// const renderLinks = (title: string, links: LinkItem[]) => (
//   <div className="flex-1">
//     <p className="uppercase font-bold md:mb-6">{title}</p>
//     <ul className="list-reset mb-6">
//       {links.map(({ name, link }) => (
//         <li key={name} className="mt-2 inline-block mr-2 md:block md:mr-0">
//           <a
//             href={link}
//             className="no-underline hover:underline hover:text-pink-500"
//           >
//             {name}
//           </a>
//         </li>
//       ))}
//     </ul>
//   </div>
// );

const Footer: React.FC = () => {
  // TODO: These are disabled until we actually have other pages.
  // const linksData = getLinksData();

  return (
    <footer>
      <div className="container mx-auto px-8 text-white">
        <div className="w-full flex flex-col md:flex-row py-6">
          {/* {linksData.map(({ title, links }) => renderLinks(title, links))} */}

          <p className="w-full md:w-1/3 my-4 text-sm text-white">
            © {new Date().getFullYear()} Magiscribe. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

import { motion } from "framer-motion";

function WandIcon() {
  return (
    <svg
      className="w-12 mb-4 mr-2 inline"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 289.17 287.44"
    >
      <defs>
        <style>
          {`
          .cls-1, .cls-2, .cls-3 {
            fill: currentColor;
            stroke: currentColor;
            stroke-width: 0px;
          }

          .cls-2 {
            stroke-width: 4px;
          }

          .cls-2, .cls-3 {
            fill: none;
            stroke-linecap: round;
            stroke-miterlimit: 10;
          }

          .cls-3 {
            stroke-width: 19px;
          }`}
        </style>
      </defs>
      <g id="Layer_3" data-name="Layer 3">
        <g>
          <motion.path
            className="cls-1"
            animate={{ opacity: [0, 1] }}
            transition={{ duration: 1, delay: 1 }}
            d="M201.82,27.1c-16.97,1.28-24.29,10.85-25.35,26.6-2.27-6.57-2.39-13.59-7.18-18.81-4.82-5.26-11.77-5.47-18.72-8.08,17.02-.95,24.73-10.33,25.5-26.8,1.56,15.85,8.32,25.98,25.76,27.1Z"
          />
          <motion.path
            className="cls-1"
            animate={{ opacity: [0, 1] }}
            transition={{ duration: 1, delay: 0.25 }}
            d="M256.68,123.76c1.59-19.2.31-21.65-16.65-31.69,14.42,2.33,25.32-1.71,30.88-16.85-3.26,16.26,3.18,26.14,18.27,31.58-16.46-4.15-26.87,1.7-32.5,16.96Z"
          />
          <motion.path
            className="cls-1"
            animate={{ opacity: [0, 1] }}
            transition={{ duration: 1, delay: 0 }}
            d="M197.47,127.96c7.43,7.31,15.18,8.28,24.27,2.63-6.54,7.34-9.15,14.83-3.11,24.02-8.04-7.18-15.78-7.82-24.62-1.98,7.28-7.51,9.41-15.26,3.46-24.66Z"
          />
          <motion.path
            className="cls-1"
            animate={{ opacity: [0, 1] }}
            transition={{ duration: 1, delay: 0.75 }}
            d="M256.4,32.2c-1.2,8,1.51,13.47,8.91,17.04-7.97-.79-13.83,1.47-17.35,9.11.56-7.88-1.07-14.26-9.44-17.47,8.53,1.32,13.95-1.86,17.88-8.68Z"
          />
          <motion.path
            className="cls-1"
            animate={{ opacity: [0, 1] }}
            transition={{ duration: 1, delay: 0.4 }}
            d="M199.53,69.7c3.89-3.93,5.22-7.94,3.49-13.42,4.13,3.47,8.36,5.4,13.77,2.98-3.55,4.27-5.86,8.64-3.2,14.31-4.19-3.73-8.41-5.88-14.06-3.88Z"
          />
          <motion.path
            className="cls-1"
            animate={{ opacity: [0, 1] }}
            transition={{ duration: 1, delay: 0.1 }}
            d="M137.77,77.32c.34,5.14,3.41,7.97,8.59,11.23-6.47-.63-10.25.7-12.45,5.85-.66-4.63-1.91-8.51-7.46-10.82,5.26-.88,9.17-1.8,11.32-6.27Z"
          />
          <motion.line
            className="cls-3"
            animate={{ pathLength: [0, 1] }}
            transition={{ duration: 1, delay: 0 }}
            x2="149.98"
            y2="137.46"
            x1="9.5"
            y1="277.94"
          />
          <motion.rect
            className="cls-2"
            animate={{ opacity: [0, 1] }}
            transition={{ duration: 1, delay: 1 }}
            x="155.91"
            y="87.91"
            width="15.13"
            height="72.13"
            rx="4.54"
            ry="4.54"
            transform="translate(191.39 327.24) rotate(-135)"
          />
        </g>
      </g>
    </svg>
  );
}

export function Logo() {
  return (
    <a
      className={`font-display no-underline hover:no-underline font-bold text-2xl lg:text-4xl mt-2`}
    >
      <WandIcon />
      <motion.span
        animate={{ opacity: [0, 1], marginLeft: [25, 0] }}
        transition={{ duration: 1, delay: 0.5 }}
      >
        Magiscribe
      </motion.span>
    </a>
  );
}

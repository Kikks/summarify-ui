import { motion } from 'framer-motion';
import Image from 'next/image';

const CustomLoader = () => {
  return (
    <div className="flex items-center justify-center">
      <motion.figure
        className="flex items-center space-x-3"
        animate={{
          scale: [0.9, 1.1, 0.9],
          transition: {
            repeat: Infinity,
            duration: 3,
          },
        }}
      >
        <Image
          src="/logo.svg"
          alt="Summarify Logo"
          width={32}
          height={32}
          priority
        />

        <h1 className="text-lg font-bold">Summarify</h1>
      </motion.figure>
    </div>
  );
};

export default CustomLoader;

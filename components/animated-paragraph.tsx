import { motion } from 'framer-motion';
import { FC } from 'react';

const paragraphContainerVariants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      when: 'beforeChildren',
      staggerChildren: 0.025,
    },
  },
};

const paragraphVariants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
  },
};

interface AnimatedParagraphProps {
  paragraphs: string[];
}

const AnimatedParagraph: FC<AnimatedParagraphProps> = ({ paragraphs = [] }) => {
  return (
    <motion.div
      variants={paragraphContainerVariants}
      initial="hidden"
      animate="visible"
      className="flex flex-col space-y-5"
    >
      {paragraphs.map((paragraph, index) => (
        <motion.p
          key={index}
          variants={paragraphVariants}
          className="text-sm dark:text-gray-400"
        >
          {paragraph}
        </motion.p>
      ))}
    </motion.div>
  );
};

export default AnimatedParagraph;

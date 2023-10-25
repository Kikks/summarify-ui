import { LucideIcon } from 'lucide-react';
import { HTMLMotionProps, motion } from 'framer-motion';
import React, { FC } from 'react';

type MotionAndDocumentProps = HTMLMotionProps<'div'>;

interface StatCardProps extends MotionAndDocumentProps {
  title: string;
  value: number;
  Icon: LucideIcon;
}

const StatCard: FC<StatCardProps> = ({ title, value, Icon }) => {
  return (
    <motion.div className="flex aspect-video w-full items-center space-x-5 rounded-xl bg-secondary p-5">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary">
        <Icon size="32px" className="text-primary-foreground" />
      </div>

      <div className="flex flex-1 flex-col">
        <h3 className="text-2xl font-medium">{value}</h3>
        <span className="text-xs">{title}</span>
      </div>
    </motion.div>
  );
};

export default StatCard;

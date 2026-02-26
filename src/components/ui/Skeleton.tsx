'use client';

import { motion } from 'motion/react';

interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  className?: string;
  rounded?: boolean;
}

export default function Skeleton({
  width,
  height,
  className = '',
  rounded = false,
}: SkeletonProps) {
  const style: React.CSSProperties = {
    width: width !== undefined ? (typeof width === 'number' ? `${width}px` : width) : '100%',
    height: height !== undefined ? (typeof height === 'number' ? `${height}px` : height) : '1rem',
  };

  return (
    <div
      style={style}
      className={`relative overflow-hidden bg-slate-200 ${rounded ? 'rounded-full' : 'rounded-lg'} ${className}`}
    >
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent"
        initial={{ x: '-100%' }}
        animate={{ x: '200%' }}
        transition={{
          duration: 1.4,
          ease: 'easeInOut',
          repeat: Infinity,
          repeatDelay: 0.2,
        }}
      />
    </div>
  );
}

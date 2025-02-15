'use client';
import React from 'react';

import { motion, useAnimation, PanInfo } from 'framer-motion';
import { useEffect, useState } from 'react';

interface CommentSectionProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CommentSection({ isOpen, onClose }: CommentSectionProps) {
  const controls = useAnimation();
  // const [isDragging, setIsDragging] = useState(false);

  // Height of the comment section
  const COMMENT_SECTION_HEIGHT = '70vh';
  
  useEffect(() => {
    if (isOpen) {
      controls.start('visible');
    } else {
      controls.start('hidden');
    }
  }, [isOpen, controls]);

  const handleDragEnd = async (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    // Get the height of the viewport
    const viewportHeight = window.innerHeight;
    // Calculate 50% of the viewport height
    const closeThreshold = viewportHeight * 0.2 ;
    
    if (info.offset.y > closeThreshold) {
      await controls.start('hidden');
      onClose();
    } else {
      // If not dragged past threshold, snap back to visible position
      controls.start('visible');
    }
    // setIsDragging(false);
  };

  const variants = {
    hidden: {
      y: '100%',
      transition: {
        type: 'spring',
        damping: 30,
        stiffness: 300,
      },
    },
    visible: {
      y: 0,
      transition: {
        type: 'spring',
        damping: 30,
        stiffness: 300,
      },
    },
  };

  return (
    <motion.div
      initial="hidden"
      animate={controls}
      variants={variants}
      drag="y"
      dragConstraints={{ top: 0 }}
      dragElastic={0.2}
      onDragStart={() => setIsDragging(true)}
      onDragEnd={handleDragEnd}
      className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-lg"
      style={{ height: COMMENT_SECTION_HEIGHT, touchAction: 'none' }}
    >
      {/* Drag handle */}
      <div className="flex justify-center p-2">
        <div className="w-10 h-1 bg-gray-300 rounded-full" />
      </div>

      {/* Comments container */}
      <div className="px-4 pb-4 h-full overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4">Comments</h2>
        
        {/* Example comments - replace with your actual comments */}
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="mb-4 p-3 border-b">
            <div className="flex items-center mb-2">
              <div className="w-8 h-8 rounded-full bg-gray-200 mr-2" />
              <span className="font-medium">User {i + 1}</span>
            </div>
            <p className="text-gray-600">
              This is an example comment. Replace with real comments from your data source.
            </p>
          </div>
        ))}
      </div>
    </motion.div>
  );
} 
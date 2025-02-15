'use client';

import { useState } from 'react';
import CommentSection from './CommentSection';
import React from 'react';
export default function CommentButton() {
  const [isCommentOpen, setIsCommentOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsCommentOpen(true)}
        className="flex items-center space-x-2 px-4 py-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
            clipRule="evenodd"
          />
        </svg>
        <span>Comments</span>
      </button>

      <CommentSection
        isOpen={isCommentOpen}
        onClose={() => setIsCommentOpen(false)}
      />
    </>
  );
} 
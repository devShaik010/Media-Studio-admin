import React from 'react';

const LoadingSpinner = () => (
  <div className="flex justify-center items-center p-8">
    <div className="animate-spin rounded-full h-8 w-8 border-2 border-[var(--primary-color)] border-t-transparent" />
  </div>
);

export default LoadingSpinner;
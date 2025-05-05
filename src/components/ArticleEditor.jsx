import React from 'react';

const ArticleEditor = ({ value, onChange, placeholder }) => {
  return (
    <div className="prose-editor">
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full min-h-[400px] p-6 text-lg leading-relaxed font-serif
                   border border-gray-200 rounded-lg focus:ring-0 
                   focus:border-gray-300 transition-colors
                   placeholder:text-gray-400 text-gray-700
                   resize-y"
      />
      <style jsx>{`
        .prose-editor textarea {
          background-image: linear-gradient(transparent, transparent calc(1.5em - 1px), #E5E7EB 0);
          background-size: 100% 1.5em;
          line-height: 1.5em;
        }
      `}</style>
    </div>
  );
};

export default ArticleEditor;
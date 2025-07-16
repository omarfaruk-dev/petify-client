import React from 'react';

/**
 * Reusable SectionTitle component for all sections.
 * Usage: <SectionTitle>Title Here</SectionTitle> or <SectionTitle title="Title Here" />
 */
const SectionTitle = ({ title, children }) => {
    return (
        <div className="w-full flex justify-center items-center mb-2">
            <h2 className="text-2xl md:text-3xl font-extrabold text-secondary mb-2 text-center w-full flex justify-center">
                {title || children}
            </h2>
        </div>
    );
};

export default SectionTitle;
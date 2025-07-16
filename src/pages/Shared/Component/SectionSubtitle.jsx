import React from 'react';

/**
 * Reusable SectionSubtitle component for all sections.
 * Usage: <SectionSubtitle>Subtitle here</SectionSubtitle> or <SectionSubtitle subtitle="Subtitle here" />
 */
const SectionSubtitle = ({ subtitle, children }) => {
    return (
        <div className="w-full flex justify-center items-center mb-6">
            <p className="text-base md:text-lg text-base-content/70 text-center max-w-2xl mx-auto">
                {subtitle || children}
            </p>
        </div>
    );
};

export default SectionSubtitle;
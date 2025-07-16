import React from 'react';

/**
 * Reusable SectionTitle component for all sections.
 * Usage: <SectionTitle>Title Here</SectionTitle> or <SectionTitle title="Title Here" />
 */


const SectionTitle = ({ title, children, label = 'About Us', labelPosition = 'left', titlePosition = 'left' }) => {
    // labelPosition: 'left', 'center', 'right'
    let justify = 'justify-start';
    if (labelPosition === 'center') justify = 'justify-center';
    if (labelPosition === 'right') justify = 'justify-end';

    // titlePosition: 'left', 'center', 'right'
    let titleAlign = 'text-left';
    if (titlePosition === 'center') titleAlign = 'text-center';
    if (titlePosition === 'right') titleAlign = 'text-right';

    return (
        <div className="w-full mb-4">
            {/* Label with line */}
            <div className={`flex items-center gap-2 mb-2 ${justify}`}>
                <span className="inline-block w-8 h-0.5 bg-primary rounded-full" />
                <span className="uppercase text-primary text-xs font-bold tracking-widest">{label}</span>
            </div>
            {/* Main Title */}
            <h2 className={`${titleAlign} text-2xl md:text-4xl font-extrabold text-secondary leading-tight tracking-wide uppercase`} style={{fontFamily: 'inherit'}}>
                {title || children}
            </h2>
        </div>
    );
};

export default SectionTitle;
import React from 'react';

const DynamicIdError = () => {
    return (
        <div>
            No data found with this url: {window.location.pathname}
        </div>
    );
};

export default DynamicIdError;
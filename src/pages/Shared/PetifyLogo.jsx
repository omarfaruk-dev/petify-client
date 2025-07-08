import React from 'react';
import { FaPaw } from 'react-icons/fa';

const PetifyLogo = () => {
    return (
        <div className="flex items-center">
            <FaPaw className="text-3xl text-primary mr-3" />
            <p className='text-3xl font-extrabold -ml-2'> Petify</p>
        </div>
    );
};

export default PetifyLogo;
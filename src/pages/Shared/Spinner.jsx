
import { FaPaw } from 'react-icons/fa';


const Spinner = () => {
    return (
        <div className="flex justify-center items-center h-screen bg-base-100">
            <div className="relative flex flex-col items-center">
                {/* Loader ring with paw icon */}
                <div className="relative flex items-center justify-center animate-bounce mb-4">
                    <div className="animate-spin rounded-full h-24 w-24 border-t-4 border-primary border-opacity-30 border-b-4 border-b-primary/60"></div>
                    <FaPaw className="absolute text-primary" style={{ fontSize: 56, top: '50%', left: '50%', transform: 'translate(-50%, -50%)', filter: 'drop-shadow(0 2px 8px #14B8A655)' }} />
                </div>
                <span className="mt-4 text-primary font-bold text-lg tracking-wide drop-shadow">loading...</span>
            </div>
        </div>
    );
};

export default Spinner;
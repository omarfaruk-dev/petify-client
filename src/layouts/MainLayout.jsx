
import { Outlet } from 'react-router';
import NavBar from '../pages/Shared/NavBar';
import Footer from '../pages/Shared/Footer';

const MainLayout = () => {
    return (
        <div> 
            <header className='mb-16'>
               <NavBar/>
            </header>
            <main>
                <Outlet/> 
            </main>
            <footer>
                <Footer/>
            </footer>
        </div>
    );
};

export default MainLayout;
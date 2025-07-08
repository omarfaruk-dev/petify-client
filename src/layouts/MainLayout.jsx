
import { Outlet } from 'react-router';
import NavBar from '../pages/Shared/NavBar';

const MainLayout = () => {
    return (
        <div> 
            <header>
               <NavBar/>
            </header>
            <main>
                <Outlet/> 
            </main>
            <footer>
                footer
            </footer>
        </div>
    );
};

export default MainLayout;
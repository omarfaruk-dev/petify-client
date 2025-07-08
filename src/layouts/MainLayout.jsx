
import { Outlet } from 'react-router';

const MainLayout = () => {
    return (
        <div>
            <header>
               
            </header>
            <main>
                <Outlet/>
            </main>
        </div>
    );
};

export default MainLayout;
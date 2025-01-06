import {Outlet} from "react-router-dom";
import Sidebar from "../component/Sidebar.jsx";
import Footer from "../component/Footer.jsx";

function Dashboard() {
    return (
        <div className="flex min-h-screen bg-footer text-white">
            <Sidebar />
            <div className="flex-1 flex flex-col">
                <main className="flex-1">
                    <Outlet />
                </main>
                <Footer />
            </div>
        </div>
    );
}

export default Dashboard;
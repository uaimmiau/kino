import { BrowserRouter, Route, Routes } from "react-router-dom";
import MainPage from "./pages/MainPage.tsx";
import Dinosaur from "./pages/Dinosaur.tsx";
import "./App.css";
import Account from "./pages/Account.tsx";
import Reservations from "./pages/Reservations.tsx";
import RoleMgmt from "./pages/RoleMgmt.tsx";
import RoomMgmt from "./pages/RoomMgmt.tsx";
import ScreeningMgmt from "./pages/ScreeningMgmt.tsx";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<MainPage />} />
                <Route path="/account" element={<Account />} />
                <Route
                    path="/account/reservations"
                    element={<Reservations />}
                />
                <Route path="/admin/role-mgmt" element={<RoleMgmt />} />
                <Route path="/admin/room-mgmt" element={<RoomMgmt />} />
                <Route
                    path="/admin/screening-mgmt"
                    element={<ScreeningMgmt />}
                />
            </Routes>
        </BrowserRouter>
    );
}

export default App;

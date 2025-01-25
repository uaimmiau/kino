import { BrowserRouter, Route, Routes } from "react-router-dom";
import MainPage from "./pages/MainPage.tsx";
import "./css/App.css";
import Account from "./pages/Account.tsx";
import Reservations from "./pages/Reservations.tsx";
import RoleMgmt from "./pages/RoleMgmt.tsx";
import RoomMgmt from "./pages/RoomMgmt.tsx";
import ScreeningMgmt from "./pages/ScreeningMgmt.tsx";
import Rooms from "./pages/Rooms.tsx";
import MovieMgmt from "./pages/MovieMgmt.tsx";
import Movies from "./pages/Movies.tsx";
import Register from "./pages/auth/Register.tsx";
import Login from "./pages/auth/Login.tsx";

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
                {/* <Route path="/admin/role-mgmt" element={<RoleMgmt />} /> */}
                <Route path="/admin/room-mgmt" element={<RoomMgmt />} />
                <Route path="/admin/rooms" element={<Rooms />} />
                <Route path="/admin/movie-mgmt" element={<MovieMgmt />} />
                <Route path="/admin/movies" element={<Movies />} />
                <Route
                    path="/admin/screening-mgmt"
                    element={<ScreeningMgmt />}
                />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="*" element={<MainPage />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;

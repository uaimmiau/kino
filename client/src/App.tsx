import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./css/App.css";
import { AuthWrapper } from "./pages/auth/AuthWrapper.tsx";

function App() {
    return (
        <BrowserRouter>
            <AuthWrapper />
        </BrowserRouter>
    );
}

export default App;

//<Routes>
// <Route path="/" element={<MainPage />} />
// <Route path="/account" element={<Account />} />
// <Route
//     path="/account/reservations"
//     element={<Reservations />}
// />
// {/* <Route path="/admin/role-mgmt" element={<RoleMgmt />} /> */}
// <Route path="/admin/room-mgmt" element={<RoomMgmt />} />
// <Route path="/admin/rooms" element={<Rooms />} />
// <Route path="/admin/movie-mgmt" element={<MovieMgmt />} />
// <Route path="/admin/movies" element={<Movies />} />
// <Route
//     path="/admin/screening-mgmt"
//         element={<ScreeningMgmt />}
//     />
//     <Route path="/register" element={<Register />} />
//     <Route path="/login" element={<Login />} />
//     <Route path="*" element={<MainPage />} />
// </Routes>

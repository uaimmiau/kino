import Account from "../dashboard/Account.tsx";
import Login from "../auth/Login.tsx";
import Register from "../auth/Register.tsx";
import MainPage from "../MainPage.tsx";
import MovieMgmt from "../dashboard/MovieMgmt.tsx";
import Movies from "../dashboard/Movies.tsx";
import Reservations from "../dashboard/Reservations.tsx";
import RoomMgmt from "../dashboard/RoomMgmt.tsx";
import Rooms from "../dashboard/Rooms.tsx";
import ScreeningMgmt from "../dashboard/ScreeningMgmt.tsx";
import Reservation from "../Reservation.tsx";

export const routes = [
    {
        path: "/",
        name: "test",
        element: <MainPage />,
        loginOnly: false,
        adminOnly: false,
    },
    {
        path: "/reservation",
        name: "test",
        element: <Reservation />,
        loginOnly: false,
        adminOnly: false,
    },
    {
        path: "/account",
        name: "test",
        element: <Account />,
        loginOnly: true,
        adminOnly: false,
    },
    {
        path: "/account/reservations",
        name: "test",
        element: <Reservations />,
        loginOnly: true,
        adminOnly: false,
    },
    {
        path: "/admin/room-mgmt",
        name: "test",
        element: <RoomMgmt />,
        loginOnly: true,
        adminOnly: true,
    },
    {
        path: "/admin/rooms",
        name: "test",
        element: <Rooms />,
        loginOnly: true,
        adminOnly: true,
    },
    {
        path: "/admin/movie-mgmt",
        name: "test",
        element: <MovieMgmt />,
        loginOnly: true,
        adminOnly: true,
    },
    {
        path: "/admin/movies",
        name: "test",
        element: <Movies />,
        loginOnly: true,
        adminOnly: true,
    },
    {
        path: "/admin/screening-mgmt",
        name: "test",
        element: <ScreeningMgmt />,
        loginOnly: true,
        adminOnly: true,
    },
    {
        path: "/register",
        name: "test",
        element: <Register />,
        loginOnly: false,
        adminOnly: false,
    },
    {
        path: "/login",
        name: "test",
        element: <Login />,
        loginOnly: false,
        adminOnly: false,
    },
    {
        path: "*",
        name: "test",
        element: <MainPage />,
        loginOnly: false,
        adminOnly: false,
    },
];

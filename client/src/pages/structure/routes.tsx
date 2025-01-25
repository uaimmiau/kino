import Account from "../Account.tsx";
import Login from "../auth/Login.tsx";
import Register from "../auth/Register.tsx";
import MainPage from "../MainPage.tsx";
import MovieMgmt from "../MovieMgmt.tsx";
import Movies from "../Movies.tsx";
import Reservations from "../Reservations.tsx";
import RoomMgmt from "../RoomMgmt.tsx";
import Rooms from "../Rooms.tsx";
import ScreeningMgmt from "../ScreeningMgmt.tsx";

export const routes = [
    { path: "/", name: "test", element: <MainPage />, isPrivate: false },
    {
        path: "/account",
        name: "test",
        element: <Account />,
        isPrivate: false,
    },
    {
        path: "/account/reservations",
        name: "test",
        element: <Reservations />,
        isPrivate: false,
    },
    {
        path: "/admin/room-mgmt",
        name: "test",
        element: <RoomMgmt />,
        isPrivate: false,
    },
    {
        path: "/admin/rooms",
        name: "test",
        element: <Rooms />,
        isPrivate: false,
    },
    {
        path: "/admin/movie-mgmt",
        name: "test",
        element: <MovieMgmt />,
        isPrivate: false,
    },
    {
        path: "/admin/movies",
        name: "test",
        element: <Movies />,
        isPrivate: false,
    },
    {
        path: "/admin/screening-mgmt",
        name: "test",
        element: <ScreeningMgmt />,
        isPrivate: false,
    },
    {
        path: "/register",
        name: "test",
        element: <Register />,
        isPrivate: false,
    },
    { path: "/login", name: "test", element: <Login />, isPrivate: false },
    { path: "*", name: "test", element: <MainPage />, isPrivate: false },
];

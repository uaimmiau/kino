import { Link } from "react-router-dom";
import { SidebarItem } from "../../types.ts";
import { AuthData } from "../auth/AuthWrapper.tsx";

export default function Sidebar() {
    const { user } = AuthData();
    const sideBarItems = [
        { name: "Profil", path: "/account", adminOnly: false },
        { name: "Rezerwacje", path: "/account/reservations", adminOnly: false },
        { name: "Dodawanie sal", path: "/admin/room-mgmt", adminOnly: true },
        { name: "Przegląd sal", path: "/admin/rooms", adminOnly: true },
        {
            name: "Dodawanie filmów",
            path: "/admin/movie-mgmt",
            adminOnly: true,
        },
        { name: "Przegląd filmów", path: "/admin/movies", adminOnly: true },
        {
            name: "Zarządzanie repertuarem",
            path: "/admin/screening-mgmt",
            adminOnly: true,
        },
    ] as SidebarItem[];

    return (
        <div className="sidebar">
            {sideBarItems.map((item: SidebarItem) => {
                if (!item.adminOnly || (item.adminOnly && user.isAdmin)) {
                    return (
                        <div key={item.name}>
                            <Link to={`${item.path}`}>{item.name}</Link>
                        </div>
                    );
                } else {
                    return false;
                }
            })}
        </div>
    );
}

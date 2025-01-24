import { Link } from "react-router-dom";
import { SidebarItem } from "../../types.ts";

export default function Sidebar() {
    const sideBarItems = [
        { name: "Profil", path: "/account" },
        { name: "Rezerwacje", path: "/account/reservations" },
        // { name: "Zarządzanie rolami", path: "/admin/role-mgmt" },
        { name: "Dodawanie sal", path: "/admin/room-mgmt" },
        { name: "Przegląd sal", path: "/admin/rooms" },
        { name: "Dodawanie filmów", path: "/admin/movie-mgmt" },
        { name: "Przegląd filmów", path: "/admin/movies" },
        { name: "Zarządzanie repertuarem", path: "/admin/screening-mgmt" },
    ] as SidebarItem[];

    return (
        <div className="sidebar">
            {sideBarItems.map((item: SidebarItem) => {
                return (
                    <div key={item.name}>
                        <Link to={`${item.path}`}>{item.name}</Link>
                    </div>
                );
            })}
        </div>
    );
}

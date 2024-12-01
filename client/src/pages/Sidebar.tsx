import { Link } from "react-router-dom";
import { SidebarItem } from "../types.ts";

export default function Sidebar() {
    const sideBarItems = [
        { name: "Profil", path: "/account" },
        { name: "Rezerwacje", path: "/account/reservations" },
        { name: "Zarządzanie rolami", path: "/admin/role-mgmt" },
        { name: "Zarządzanie salami", path: "/admin/room-mgmt" },
        { name: "Zarządzanie repertuarem", path: "/admin/screening-mgmt" },
    ] as SidebarItem[];

    return (
        <div className="sidebar">
            {sideBarItems.map((item: SidebarItem) => {
                return (
                    <div>
                        <Link to={`${item.path}`}>{item.name}</Link>
                    </div>
                );
            })}
        </div>
    );
}

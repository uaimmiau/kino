import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import { SidebarItem } from "../types.ts";
import Sidebar from "./common/Sidebar.tsx";

export default function Account() {
    return (
        <div className="mainCont">
            <Sidebar />
            <div className="accountCont">dupa</div>
        </div>
    );
}

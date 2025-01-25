import { createContext, useContext, useState } from "react";
import Auth from "./Auth.tsx";
import { RenderRoutes } from "../structure/RenderRoutes.tsx";

const AuthContext = createContext();
export const AuthData = () => useContext(AuthContext);

export const AuthWrapper = () => {
    const [user, setUser] = useState({ name: "", isAuthenticated: false });

    const login = Auth.login;
    const logout = () => {
        setUser({ ...user, isAuthenticated: false });
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            <>
                <RenderRoutes />
            </>
        </AuthContext.Provider>
    );
};

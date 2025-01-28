import { createContext, useContext, useState } from "react";
import { RenderRoutes } from "../structure/RenderRoutes.tsx";
import Util from "../Util.tsx";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();
export function AuthData() {
    return useContext(AuthContext);
}

export const AuthWrapper = () => {
    const [user, setUser] = useState({
        name: "",
        isAuthenticated: false,
        isAdmin: false,
    });

    const navigate = useNavigate();

    useEffect(() => {
        (async () => {
            await fetch("/api/auth", {
                method: "GET",
                credentilas: "include",
            }).then(async (response) => {
                const data = await response.json();
                if (response.ok) {
                    setUser({
                        name: data.user,
                        isAuthenticated: true,
                        isAdmin: data.isAdmin,
                    });
                }
            });
        })();
    }, []);

    let loginOk: boolean = false;

    const login = async (username: string, password: string) => {
        await fetch("/api/login", {
            method: "POST",
            credentials: "include",
            body: JSON.stringify({
                username: username,
                password: password,
            }),
        })
            .then((response) => {
                loginOk = response.ok;
                return response.json();
            })
            .then((data) => {
                Util.showToast(data.msg);
                if (loginOk) {
                    setUser({
                        name: username,
                        isAuthenticated: true,
                        isAdmin: data.admin,
                    });
                    setTimeout(() => {
                        navigate("/");
                    }, 2500);
                }
            });
    };

    const logout = async () => {
        await fetch("/api/logout", {
            method: "POST",
            credentials: "include",
        }).then(async (response) => {
            if (response.ok) {
                setUser({
                    user: "",
                    isAuthenticated: false,
                    isAdmin: false,
                });
                navigate("/");
            }
        });
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            <>
                <RenderRoutes />
            </>
        </AuthContext.Provider>
    );
};

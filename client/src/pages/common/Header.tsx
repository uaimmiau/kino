import { Link } from "react-router-dom";
import "../../css/Header.css";
import { AuthData } from "../auth/AuthWrapper.tsx";

export default function Header() {
    const { user, logout } = AuthData();
    return (
        <div className="header">
            <img id="logo" src="/logo.png" alt="logo" />
            <div className="headerCont">
                <Link to={`/`}>Strona główna</Link>
                {user.isAuthenticated ? (
                    <Link to={`/`} onClick={logout}>
                        Wyloguj
                    </Link>
                ) : (
                    <Link to={`/login`}>Zaloguj</Link>
                )}
                {user.isAuthenticated ? (
                    false
                ) : (
                    <Link to={`/register`}>Zarejestruj</Link>
                )}
                {user.isAuthenticated ? (
                    <Link to={`/account`}>Konto</Link>
                ) : (
                    false
                )}
            </div>
        </div>
    );
}

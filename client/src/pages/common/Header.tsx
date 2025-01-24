import { Link } from "react-router-dom";
import "../../css/Header.css";

export default function Header() {
    return (
        <div className="header">
            <img src="/react.svg" alt="logo" />

            <Link to={`/`}>Strona główna</Link>
            <Link to={`/account`}>Zaloguj</Link>
            <Link to={`/register`}>Zarejestruj</Link>
        </div>
    );
}

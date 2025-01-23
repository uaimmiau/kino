import { Link } from "react-router-dom";
import "../css/MainPage.css";

export default function MainPage() {
    return (
        <main>
            <div className="header">
                <img src="/react.svg" alt="logo" />
                <div>
                    <label htmlFor="location">Wybierz lokacje:</label>
                    <select name="location">
                        <option value="location1">Kino 1</option>
                        <option value="location2">Kino 2</option>
                    </select>
                </div>
                <Link to={`/account`}>Zaloguj</Link>
            </div>
            <h1>Repertuar:</h1>
            {/* tu będzie lista filmow */}
            <div className="footer"></div>
        </main>
    );
}

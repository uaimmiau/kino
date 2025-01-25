import Header from "../common/Header.tsx";
import Toast from "../Toast.tsx";
import Auth from "./Auth.tsx";

export default function Login() {
    return (
        <main>
            <Header />
            <div>
                <form
                    onSubmit={(e: React.FormEvent) => {
                        e.preventDefault();
                        const target = e.target as typeof e.target & {
                            username: { value: string };
                            password: { value: string };
                        };
                        const username = target.username.value;
                        const password = target.password.value;
                        Auth.login(username, password);
                    }}
                >
                    <div className="formRow">
                        <label htmlFor="username">Login:</label>
                        <input type="text" name="username" id="username" />
                    </div>
                    <div className="formRow">
                        <label htmlFor="password">Hasło:</label>
                        <input type="password" name="password" id="password" />
                    </div>
                    <div className="formRow">
                        <input type="submit" value="Zaloguj" />
                    </div>
                </form>
            </div>
            <Toast />
        </main>
    );
}

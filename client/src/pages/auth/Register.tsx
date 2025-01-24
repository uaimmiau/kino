import Header from "../common/Header.tsx";
import Validator from "../common/Validator.tsx";
import Toast from "../Toast.tsx";
import Auth from "./Auth.tsx";

export default function Register() {
    return (
        <main>
            <Header />
            <div>
                <form
                    onSubmit={(e: React.FormEvent) => {
                        e.preventDefault();
                        const target = e.target as typeof e.target & {
                            username: { value: string };
                            email: { value: string };
                            password: { value: string };
                        };
                        const username = target.username.value;
                        const email = target.email.value;
                        const password = target.password.value;
                        if (Validator.validateUser(username, email, password)) {
                            Auth.register(username, email, password);
                        }
                    }}
                >
                    <div className="formRow">
                        <label htmlFor="name">Login:</label>
                        <input type="text" name="name" id="name" />
                    </div>
                    <div className="formRow">
                        <label htmlFor="email">Adres email:</label>
                        <input type="email" name="email" id="email" />
                    </div>
                    <div className="formRow">
                        <label htmlFor="password">Hasło:</label>
                        <input type="password" name="password" id="password" />
                    </div>
                    <div className="formRow">
                        <input type="submit" value="Zarejestruj" />
                    </div>
                </form>
            </div>
            <Toast />
        </main>
    );
}

import Util from "../Util.tsx";

export default class Auth {
    static register = async (
        username: string,
        email: string,
        password: string
    ) => {
        await fetch("/api/register", {
            method: "POST",
            body: JSON.stringify({
                username: username,
                email: email,
                password: password,
            }),
        })
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                Util.showToast(data.msg);
            });
    };
}

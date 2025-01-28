import { Stat } from "../../types.ts";
import { AuthData } from "../auth/AuthWrapper.tsx";
import Header from "../common/Header.tsx";
import Sidebar from "../common/Sidebar.tsx";
import { useEffect, useState } from "react";

export default function Account() {
    const { user } = AuthData();
    const [email, setEmail] = useState<string>();
    const [stats, setStats] = useState<Stat[]>([]);

    useEffect(() => {
        (async () => {
            const response = await fetch(`/api/user/stats/${user.name}/`);
            const data = await response.json();
            const email = data.user[0].email;
            setEmail(email);
            const stats = data.stats.map(
                ([title, count]: [string, number]) => ({
                    title: title,
                    count: count,
                })
            );
            setStats(stats);
        })();
    }, []);
    return (
        <main>
            <Header />
            <div className="mainCont">
                <Sidebar />
                <div className="accountCont">
                    <h1>Nazwa użytkownika: {user.name}</h1>
                    <h2>Adres email: {email}</h2>
                    <h2>Statystyki:</h2>
                    <div id="accountStatCont">
                        {stats.map((stat: Stat) => {
                            return (
                                <div key={stat.title} className="accountStat">
                                    {stat.title} - rezerwowano {stat.count} razy
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </main>
    );
}

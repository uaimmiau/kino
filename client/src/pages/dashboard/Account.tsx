import Header from "../common/Header.tsx";
import Sidebar from "../common/Sidebar.tsx";

export default function Account() {
    return (
        <main>
            <Header />
            <div className="mainCont">
                <Sidebar />
                <div className="accountCont">dupa</div>
            </div>
        </main>
    );
}

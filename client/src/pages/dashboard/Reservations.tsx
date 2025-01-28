import { Timestamp } from "https://deno.land/x/postgres@v0.17.0/query/types.ts";
import { ReservationItem, SeatType } from "../../types.ts";
import { AuthData } from "../auth/AuthWrapper.tsx";
import Header from "../common/Header.tsx";
import Sidebar from "../common/Sidebar.tsx";
import { useEffect, useState } from "react";
import "../../css/Reservations.css";
import Util from "../Util.tsx";
import Toast from "../Toast.tsx";

export default function Reservations() {
    const [reservations, setReservations] = useState<ReservationItem[]>([]);
    const [trigger, setTrigger] = useState<{ hack: number }>({});
    const { user } = AuthData();

    useEffect(() => {
        (async () => {
            const response = await fetch(
                `/api/user/reservations/${user.name}/`
            );
            const data = await response.json();
            const reservations = data.map(
                ([id, title, start_date, number, row, roomNumber]: [
                    number,
                    string,
                    Timestamp,
                    number,
                    number,
                    number
                ]) => ({
                    id: id,
                    title: title,
                    start_date: new Date(start_date),
                    number: number,
                    row: row,
                    roomNumber: roomNumber,
                })
            );
            setReservations(reservations);
        })();
    }, [trigger]);

    const deleteReservation = async (id: number) => {
        await fetch(`/api/reservation/${id}`, {
            method: "DELETE",
            credentials: "include",
        })
            .then((response) => {
                if (response.ok) {
                    setTrigger({ ...trigger, hack: 1 });
                }
                return response.json();
            })
            .then((data) => {
                Util.showToast(data.msg);
            });
    };

    return (
        <main>
            <Header />
            <div className="mainCont">
                <Sidebar />
                <div className="reservationsCont">
                    {reservations.map((res: ReservationItem) => {
                        return (
                            <div key={res.id} className="reservationCont">
                                <div>Film: {res.title}</div>
                                <div>Sala: {res.roomNumber}</div>
                                <div>
                                    {res.start_date.getDate()}.
                                    {res.start_date.getMonth() + 1} -{" "}
                                    {res.start_date.getHours()}:
                                    {res.start_date.getMinutes()}
                                </div>
                                <div>Rząd: {res.row}</div>
                                <div>Numer: {res.number}</div>
                                <button
                                    onClick={() => deleteReservation(res.id)}
                                >
                                    Anuluj
                                </button>
                            </div>
                        );
                    })}
                </div>
            </div>
            <Toast />
        </main>
    );
}

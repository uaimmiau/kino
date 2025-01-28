import Header from "./common/Header.tsx";
import Sidebar from "./common/Sidebar.tsx";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { Room, SeatItem, SeatType } from "../types.ts";
import Util from "./Util.tsx";
import Seat from "./Seat.tsx";
import { AuthData } from "./auth/AuthWrapper.tsx";
import Toast from "./Toast.tsx";
import { useNavigate } from "react-router-dom";

export default function Reservation() {
    const location = useLocation();
    const { screening_id, room_id, title } = location.state;
    const [seats, setSeats] = useState<SeatItem[]>([]);
    const [currentRoom, setcurrentRoom] = useState<Room>();
    const [normalPrice, setnormalPrice] = useState<number>();
    const [vipPrice, setvipPrice] = useState<number>();
    const [clickedSeatIds, setClickedSeatIds] = useState<number[]>([]);
    const [reservedSeatIds, setReservedSeatIds] = useState<number[]>([]);
    const { user } = AuthData();
    const navigate = useNavigate();

    useEffect(() => {
        (async () => {
            const response = await fetch(`/api/room/${room_id}/`);
            const data = await response.json();
            const room = {
                number: data.room[0].number,
                sponsor: data.room[0].sponsor,
                technology: data.room[0].technology,
            };
            setcurrentRoom(room);
            const seats = data.seats.map(
                ([id, dim_x, dim_y, row, number, type]: [
                    number,
                    number,
                    number,
                    number,
                    number,
                    number
                ]) => ({
                    id: id,
                    x: dim_x,
                    y: dim_y,
                    row: row,
                    number: number,
                    type: type,
                })
            );
            setSeats(seats);
        })();
    }, []);

    useEffect(() => {
        (async () => {
            const response = await fetch(`/api/prices/${screening_id}`);
            const data = await response.json();
            setnormalPrice(data[0][0]);
            setvipPrice(data[0][1]);
        })();
    }, []);

    useEffect(() => {
        (async () => {
            const response = await fetch(
                `/api/reservation/seats/${screening_id}`
            );
            const data = await response.json();
            setReservedSeatIds(data.map(([id]: [number]) => id));
        })();
    }, []);

    const handleClick = (seatId: number) => {
        setClickedSeatIds((prev: any) =>
            prev.includes(seatId)
                ? prev.filter((id: number) => id !== seatId)
                : [...prev, seatId]
        );
    };

    const saveReservation = async () => {
        await fetch("/api/save_reservation", {
            method: "POST",
            credentials: "include",
            body: JSON.stringify({
                screening_id: screening_id,
                selectedSeats: clickedSeatIds,
            }),
        })
            .then((response) => {
                if (response.ok) {
                    setTimeout(() => {
                        navigate("/");
                    }, 2500);
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
                <div>
                    <h1>{title}</h1>
                    <div>
                        <p>Bilet normalny: {normalPrice}zł</p>
                        <div className="seatItem seat"></div>
                    </div>
                    <div>
                        <p>Bilet vip: {vipPrice}zł</p>
                        <div className="seatItem vip"></div>
                    </div>
                </div>
                {Util.renderSeats(
                    seats,
                    handleClick,
                    clickedSeatIds,
                    reservedSeatIds
                )}
                {user.isAuthenticated ? (
                    <button onClick={saveReservation}>Zarezerwuj</button>
                ) : (
                    <div>Rezerwacja możliwa dla zalogowanych użytkowników</div>
                )}
            </div>
            <Toast />
        </main>
    );
}

import Header from "./common/Header.tsx";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Room, SeatItem } from "../types.ts";
import Util from "./Util.tsx";
import { AuthData } from "./auth/AuthWrapper.tsx";
import Toast from "./Toast.tsx";

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
        if (clickedSeatIds.length > 0) {
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
        } else {
            Util.showToast("Wybierz miejsca do rezerwacji");
        }
    };

    return (
        <main>
            <Header />
            <div className="mainCont">
                <div id="reservationMainCont">
                    <div className="marginLeft">
                        <h1>Zarezerwuj miejsca na: {title}</h1>
                        {currentRoom ? (
                            <h3>
                                Sala {currentRoom.number} -{" "}
                                {currentRoom.sponsor} w {currentRoom.technology}
                            </h3>
                        ) : (
                            false
                        )}
                    </div>
                    {Util.renderSeats(
                        seats,
                        handleClick,
                        clickedSeatIds,
                        reservedSeatIds
                    )}
                    <div>
                        <div className="marginLeft">Legenda:</div>
                        <div id="legendCont">
                            <div className="legendCell">
                                <div className="seatItem seat"></div>
                                <p>Miejsce normalne: {normalPrice}zł</p>
                            </div>
                            <div className="legendCell">
                                <div className="seatItem vip"></div>
                                <p>Miejsce VIP: {vipPrice}zł</p>
                            </div>
                            <div className="legendCell">
                                <div className="seatItem selected"></div>
                                <p>Miejsce wybrane</p>
                            </div>
                            <div className="legendCell">
                                <div className="seatItem reserved"></div>
                                <p>Miejsce zajęte</p>
                            </div>
                        </div>
                    </div>
                    <div id="saveReservationCont">
                        {user.isAuthenticated ? (
                            <button onClick={saveReservation}>
                                Zarezerwuj
                            </button>
                        ) : (
                            <div>
                                Rezerwacja możliwa tylko dla zalogowanych
                                użytkowników
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <Toast />
        </main>
    );
}

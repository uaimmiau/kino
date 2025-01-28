import Header from "./common/Header.tsx";
import Sidebar from "./common/Sidebar.tsx";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { Room, SeatItem } from "../types.ts";
import Util from "./Util.tsx";

export default function Reservation() {
    const location = useLocation();
    const { screening_id, room_id, title } = location.state;
    const [seats, setSeats] = useState<SeatItem[]>([]);
    const [currentRoom, setcurrentRoom] = useState<Room>();
    const [normalPrice, setnormalPrice] = useState<number>();
    const [vipPrice, setvipPrice] = useState<number>();
    const [clickedSeatIds, setClickedSeatIds] = useState<number[]>([]);

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

    const handleClick = (seatId: number) => {
        setClickedSeatIds((prev: any) =>
            prev.includes(seatId)
                ? prev.filter((id: number) => id !== seatId)
                : [...prev, seatId]
        );
    };

    return (
        <main>
            <Header />
            <div className="mainCont">
                <div>
                    <h1>{title}</h1>
                    <div>Bilet normalny: {normalPrice}zł</div>
                    <div>Bilet vip: {vipPrice}zł</div>
                </div>
                {Util.renderSeats(seats, handleClick, clickedSeatIds)}
            </div>
        </main>
    );
}

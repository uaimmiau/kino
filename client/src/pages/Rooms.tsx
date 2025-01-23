import { useEffect, useState } from "react";
import Sidebar from "./Sidebar.tsx";
import { Room, SeatItem } from "../types.ts";
import "../css/Rooms.css";
import Util from "./Util.tsx";

export default function Rooms() {
    const [rooms, setRooms] = useState<Room[]>([]);
    const [currentRoom, setcurrentRoom] = useState<Room>();
    const [seats, setSeats] = useState<SeatItem[]>([]);

    const loadRoom = (id: number): void => {
        (async () => {
            const response = await fetch(`/api/room/${id}/`);
            const data = await response.json();
            const room = {
                number: data.room[0].number,
                sponsor: data.room[0].sponsor,
                technology: data.room[0].technology,
            };
            setcurrentRoom(room);
            const seats = data.seats.map(
                ([dim_x, dim_y, row, number, type]: [
                    number,
                    number,
                    number,
                    number,
                    number
                ]) => ({
                    x: dim_x,
                    y: dim_y,
                    row: row,
                    number: number,
                    type: type,
                })
            );
            setSeats(seats);
        })();
    };

    const renderRoom = () => {
        if (currentRoom) {
            return (
                <div id="roomHeader">
                    <h2>
                        {currentRoom.number} - {currentRoom.sponsor}
                    </h2>
                    <h3>{currentRoom.technology}</h3>
                </div>
            );
        }
    };

    useEffect(() => {
        (async () => {
            const response = await fetch("/api/rooms/", {
                method: "GET",
            });
            const data = await response.json();
            const rooms = data.map(
                ([id, number, sponsor]: [number, number, string]) => ({
                    id,
                    number,
                    sponsor,
                })
            );
            setRooms(rooms);
        })();
    }, []);
    return (
        <div className="mainCont">
            <Sidebar />
            <div id="roomButtCont">
                {rooms.map((room: Room) => {
                    return (
                        <div
                            key={room.id}
                            className="roomButton"
                            onClick={() => loadRoom(room.id)}
                        >
                            <p>
                                {room.number} - {room.sponsor}
                            </p>
                        </div>
                    );
                })}
            </div>
            <div id="roomCont">
                {renderRoom()}
                {Util.renderSeats(seats)}
            </div>
        </div>
    );
}

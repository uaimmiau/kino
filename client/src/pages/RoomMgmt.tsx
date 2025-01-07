import { useEffect, useState } from "react";
import Sidebar from "./Sidebar.tsx";
import { SeatItem, SeatType } from "../types.ts";
import Seat from "./Seat.tsx";

export default function RoomMgmt() {
    const [seats, setSeats] = useState(Array(0).fill(Array(0).fill({})));

    const [form, setForm] = useState({
        name: "",
        width: 0,
        height: 0,
    });

    function saveRoom() {
        // useEffect(() => {
        (async () => {
            console.log(JSON.stringify(seats));
            const response = await fetch(`/api/save_room`, {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    roomName: form.name,
                    seatList: seats,
                }),
            });
            console.log(response);
        })();
        // }, []);
    }

    function handleClick(x: number, y: number) {
        let newType: SeatType;
        switch (seats[x][y].type) {
            case SeatType.Seat:
                newType = SeatType.Empty;
                break;
            case SeatType.Empty:
                newType = SeatType.Vip;
                break;
            default:
                newType = SeatType.Seat;
                break;
        }
        setSeats(
            seats.map((row: SeatItem[]) => {
                return row.map((seat: SeatItem) => {
                    return seat.x === x && seat.y === y
                        ? { ...seat, type: newType }
                        : { ...seat };
                });
            })
        );
    }

    return (
        <div className="mainCont">
            <Sidebar />
            <div id="content">
                <form>
                    <label htmlFor="name">Nazwa sali:</label>
                    <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={(e) => {
                            setForm({
                                ...form,
                                name: e.target.value,
                            });
                        }}
                    />
                    <br />
                    <label htmlFor="width">Szerokość sali:</label>
                    <input
                        name="width"
                        type="text"
                        value={form.width}
                        onChange={(e) => {
                            setForm({
                                ...form,
                                width: e.target.value,
                            });
                        }}
                    />
                    <br />
                    <label htmlFor="height">Wysokość sali:</label>
                    <input
                        name="height"
                        type="text"
                        value={form.height}
                        onChange={(e) => {
                            setForm({
                                ...form,
                                height: e.target.value,
                            });
                        }}
                    />
                    <br />
                    <input
                        type="submit"
                        value="Wygeneruj"
                        onClick={(e) => {
                            e.preventDefault();
                            const height: number = parseInt(form.height);
                            const width: number = parseInt(form.width);
                            if (height > 0 && width > 0) {
                                setSeats(
                                    Array(height)
                                        .fill(0)
                                        .map((_, i) => {
                                            return Array(width)
                                                .fill(0)
                                                .map((_, j) => {
                                                    return {
                                                        x: i,
                                                        y: j,
                                                        type: SeatType.Seat,
                                                        number: j + 1,
                                                    };
                                                });
                                        })
                                );
                            }
                        }}
                    />
                </form>
                <div id="roomCont">
                    {seats.map((row: SeatItem[], i: number) => {
                        return (
                            <div className="roomRow">
                                <div className="rowLabel">{i + 1}:</div>
                                {row.map((_, j) => {
                                    return (
                                        <Seat
                                            x={j}
                                            key={i + j}
                                            type={seats[i][j].type}
                                            onSeatClick={() =>
                                                handleClick(i, j)
                                            }
                                        />
                                    );
                                })}
                            </div>
                        );
                    })}
                </div>
                <button type="button" onClick={saveRoom}>
                    Zapisz
                </button>
            </div>
        </div>
    );
}

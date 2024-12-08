import { useState } from "react";
import Sidebar from "./Sidebar.tsx";
import { SeatItem } from "../types.ts";
import Seat from "./Seat.tsx";

export default function RoomMgmt() {
    const [seats, setSeats] = useState(Array(0).fill(Array(0).fill({})));

    const [form, setForm] = useState({
        width: 0,
        height: 0,
    });

    return (
        <div className="mainCont">
            <Sidebar />
            <div id="content">
                <form>
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
                                    Array(height).fill(Array(width).fill({}))
                                );
                            }
                        }}
                    />
                </form>
                <div id="roomCont">
                    {seats.map((row: SeatItem[], i: number) => {
                        return (
                            <div className="roomRow">
                                {row.map((_, j) => {
                                    return <Seat x={j} y={i} key={i + j} />;
                                })}
                            </div>
                        );
                    })}

                    {/* {[...Array(parseInt(form.height))].map((_, i) => {
                        return (
                            <div className="roomRow">
                                {[...Array(parseInt(form.width))].map(
                                    (_, j) => {
                                        return <Seat x={j} y={i} />;
                                    }
                                )}
                            </div>
                        );
                    })} */}
                </div>
            </div>
        </div>
    );
}

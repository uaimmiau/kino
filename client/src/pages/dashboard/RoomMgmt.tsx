import { useEffect, useState } from "react";
import Sidebar from "../common/Sidebar.tsx";
import { SeatItem, SeatType } from "../../types.ts";
import Seat from "../Seat.tsx";
import Validator from "../common/Validator.tsx";
import Toast from "../Toast.tsx";
import Util from "../Util.tsx";

export default function RoomMgmt() {
    const [seats, setSeats] = useState(Array(0).fill(Array(0).fill({})));

    const [form, setForm] = useState({
        width: 0,
        height: 0,
    });

    function recountSeats(seats: any) {
        //Enumeration: (kinda thought I'd need it)
        for (const [_, row] of seats.entries()) {
            let count: number = 0;
            for (const [_, seat] of row.entries()) {
                if (seat.type != SeatType.Empty) count++;
                seat.number = count;
            }
        }
        return seats;
    }

    function saveRoom() {
        const roomSponsor: string = (
            document.getElementById("roomSponsor") as HTMLInputElement
        ).value;
        const roomNumber: number = +(
            document.getElementById("roomNumber") as HTMLInputElement
        ).value; // + unary operator to convert to number, disgusting, I know
        const roomTechnology: string = (
            document.getElementById("roomTech") as HTMLInputElement
        ).value;
        if (
            Validator.validateStringNotEmpty("Sponsor", roomSponsor, true) &&
            Validator.validateNumber(
                "Podaj poprawny number dla sali",
                roomNumber,
                true
            ) &&
            Validator.validateStringNotEmpty(
                "Technologia",
                roomTechnology,
                true
            ) &&
            Validator.validateDefined(
                "Podaj poprawne wymiary sali i wygeneruj widok",
                seats,
                true
            )
        ) {
            (async () => {
                await fetch(`/api/save_room`, {
                    method: "POST",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        roomSponsor: roomSponsor,
                        roomNumber: roomNumber,
                        roomTechnology: roomTechnology,
                        seatList: recountSeats(seats),
                    }),
                })
                    .then((response) => {
                        return response.json();
                    })
                    .then((data) => {
                        Util.showToast(data.msg);
                    });
            })();
        }
    }

    function handleClick(i: number, j: number) {
        let newType: SeatType;
        switch (seats[i][j].type) {
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
                    return seat.y === i && seat.x === j
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
                    <label htmlFor="sponsor">Sponsor sali:</label>
                    <input type="text" name="sponsor" id="roomSponsor" />
                    <br />
                    <label htmlFor="number">Numer sali:</label>
                    <input
                        type="number"
                        name="number"
                        id="roomNumber"
                        defaultValue={0}
                    />
                    <br />
                    <label htmlFor="tech">Technologia:</label>
                    <input type="text" name="tech" id="roomTech" />
                    <br />
                    <label htmlFor="width">Szerokość sali:</label>
                    <input
                        name="width"
                        type="number"
                        min={0}
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
                        type="number"
                        min={0}
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
                                                        x: j,
                                                        y: i,
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
                            <div className="roomRow" key={"rowKey" + i}>
                                <div className="rowLabel">{i + 1}:</div>
                                {row.map((_, j) => {
                                    return (
                                        <Seat
                                            x={j + 1}
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
            <Toast></Toast>
        </div>
    );
}

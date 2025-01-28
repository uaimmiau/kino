import { SeatItem } from "../types.ts";
import Seat from "./Seat.tsx";

export default class Util {
    static showToast(msg: string) {
        const toast = document.getElementById("toastCont");
        if (!msg) return;
        if (toast) {
            toast.className = "show";
            toast.innerHTML = msg;
            setTimeout(function () {
                toast.className = toast.className.replace("show", "");
            }, 3000);
        }
    }

    static renderSeats(
        seats: SeatItem[],
        onClick: any,
        clickedSeatIds: number[],
        reservedSeatIds: number[]
    ) {
        // Quite frankly i don't entirely grasp the code below
        // it maps a 1d array of seats into 2d one grouped by row tho
        const seat2D = Object.values(
            seats.reduce((acc, seat) => {
                (acc[seat.row] ||= []).push(seat);
                return acc;
            }, {} as Record<number, (typeof seats)[0][]>)
        );

        return (
            <div id="seatCont">
                <div className="screen"></div>
                {seat2D.map((row: SeatItem[], i: number) => {
                    return (
                        <div className="roomRow" key={"rowKey" + i}>
                            <div className="rowLabel">Rząd {row[0].row}:</div>
                            {row.map((seat, j) => {
                                return (
                                    <Seat
                                        x={seat.number}
                                        key={i + j}
                                        type={seat.type}
                                        onSeatClick={() => onClick(seat.id)}
                                        display={true}
                                        isSelected={clickedSeatIds.includes(
                                            seat.id
                                        )}
                                        isReserved={reservedSeatIds.includes(
                                            seat.id
                                        )}
                                    />
                                );
                            })}
                        </div>
                    );
                })}
            </div>
        );
    }
}

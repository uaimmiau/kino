import { SeatType } from "../types.ts";
import "./Seat.css";
export default function Seat({
    x,
    type,
    onSeatClick,
}: {
    x: number;
    type: SeatType;
    onSeatClick: any;
}) {
    return (
        <div
            className={`seatItem ${type == SeatType.Seat ? "seat" : ""} ${
                type == SeatType.Vip ? "vip" : ""
            } ${type == SeatType.Empty ? "empty" : ""}`}
            onClick={onSeatClick}
        >
            {x + 1}
        </div>
    );
}

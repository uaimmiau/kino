import { SeatType } from "../types.ts";
import "../css/Seat.css";
export default function Seat({
    x,
    type,
    onSeatClick,
    display,
    isSelected,
    isReserved,
}: {
    x: number;
    type: SeatType;
    onSeatClick: any;
    display: boolean;
    isSelected: boolean;
    isReserved: boolean;
}) {
    return (
        <div>
            {isReserved ? (
                <div className="seatItem reserved"></div>
            ) : (
                <div
                    className={`seatItem ${
                        type == SeatType.Seat ? "seat" : ""
                    } ${type == SeatType.Vip ? "vip" : ""} ${
                        type == SeatType.Empty ? "empty" : ""
                    } ${type == SeatType.Empty && display ? "hidden" : ""} ${
                        isSelected ? "selected" : ""
                    }`}
                    onClick={onSeatClick}
                >
                    {x}
                </div>
            )}
        </div>
    );
}

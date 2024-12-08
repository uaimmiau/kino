export default function Seat({ x, y }: { x: number; y: number }) {
    return (
        <div className="seat">
            <p>
                {x} {y}
            </p>
        </div>
    );
}

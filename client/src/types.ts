export type Dino = { name: string; description: string };

export type SidebarItem = {
    name: string;
    path: string;
};

enum SeatType {
    Seat = 0,
    Vip,
    Empty,
}

export type SeatItem = {
    x: number;
    y: number;
    type: SeatType;
    row: number;
    number: number;
};

export type Dino = { name: string; description: string };

export type SidebarItem = {
    name: string;
    path: string;
};

export enum SeatType {
    Seat = 0,
    Vip,
    Empty,
}

export type SeatItem = {
    x: number;
    y: number;
    type: SeatType;
    number: number;
    row: number;
};

export type Room = {
    id: number;
    number: number;
    sponsor: string;
    technology: string;
};

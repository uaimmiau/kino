export type Dino = { name: string; description: string };

export type SidebarItem = {
    name: string;
    path: string;
    adminOnly: boolean;
};

export enum SeatType {
    Seat = 0,
    Vip,
    Empty,
}

export type SeatItem = {
    id: number;
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

export type Movie = {
    id: number;
    title: string;
    desc: string;
    runtime: number;
};

export type Screening = {
    screening_id: number;
    movie_id: number;
    room_id: number;
    start_date: Date;
};

export type Stat = {
    title: string;
    count: number;
};

export type ReservationItem = {
    id: number;
    title: string;
    start_date: Date;
    number: number;
    row: number;
    roomNumber: number;
};

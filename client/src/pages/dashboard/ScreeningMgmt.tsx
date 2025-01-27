import { useState } from "react";
import Header from "../common/Header.tsx";
import Sidebar from "../common/Sidebar.tsx";
import { Movie, Room } from "../../types.ts";
import { useEffect } from "react";
import Validator from "../common/Validator.tsx";
import Util from "../Util.tsx";
import Toast from "../Toast.tsx";

export default function ScreeningMgmt() {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [rooms, setRooms] = useState<Room[]>([]);
    const [runtime, setRuntime] = useState<number>(0);

    useEffect(() => {
        (async () => {
            const response = await fetch("/api/movies", {
                method: "GET",
            });
            const data = await response.json();
            const movies = data.map(
                ([id, title, runtime]: [number, string, number]) => ({
                    id,
                    title,
                    runtime,
                })
            );
            setMovies(movies);
            setRuntime(movies[0].runtime);
        })();
    }, []);

    useEffect(() => {
        (async () => {
            const response = await fetch("/api/rooms/", {
                method: "GET",
            });
            const data = await response.json();
            const rooms = data.map(
                ([id, number, sponsor]: [number, number, string]) => ({
                    id,
                    number,
                    sponsor,
                })
            );
            setRooms(rooms);
        })();
    }, []);

    const calculateEndDate = (runtime: number) => {
        const value = (document.getElementById("dateStart") as HTMLInputElement)
            .value;
        if (value) {
            const date = new Date(value);
            date.setMinutes(date.getMinutes() + runtime);
            date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
            (document.getElementById("dateEnd") as HTMLInputElement).value =
                date.toISOString().slice(0, 16);
        }
    };

    return (
        <main>
            <Header />
            <div className="mainCont">
                <Sidebar />
                <form
                    onSubmit={(e: React.FormEvent) => {
                        e.preventDefault();
                        const target = e.target as typeof e.target & {
                            movieID: { value: number };
                            roomID: { value: number };
                            dateStart: { value: Date };
                            normalPrice: { value: number };
                            vipPrice: { value: number };
                        };
                        // console.log(target);
                        const movieID = target.movieID.value;
                        const roomID = target.roomID.value;
                        const dateStart = target.dateStart.value;
                        const normalPrice = target.normalPrice.value;
                        const vipPrice = target.vipPrice.value;

                        if (
                            Validator.validateScreening(
                                movieID,
                                roomID,
                                dateStart,
                                normalPrice,
                                vipPrice
                            )
                        ) {
                            const formData = new FormData();
                            formData.append("movieID", movieID.toString());
                            formData.append("roomID", roomID.toString());
                            formData.append(
                                "dateStart",
                                new Date(dateStart).toUTCString()
                            );
                            formData.append(
                                "normalPrice",
                                normalPrice.toString()
                            );
                            formData.append("vipPrice", vipPrice.toString());
                            (async () => {
                                await fetch(`/api/save_screening`, {
                                    method: "POST",
                                    body: formData,
                                })
                                    .then((response) => {
                                        return response.json();
                                    })
                                    .then((data) => {
                                        Util.showToast(data.msg);
                                    });
                            })();
                        }
                    }}
                >
                    <div className="formRow">
                        <label htmlFor="movieID">Film:</label>
                        <select
                            name="movieID"
                            id="movieID"
                            onChange={(e) => {
                                const runtime = movies.find(
                                    (movie: Movie) =>
                                        movie.id == parseInt(e.target.value)
                                ).runtime;
                                setRuntime(runtime);
                                calculateEndDate(runtime);
                            }}
                        >
                            {movies.map((movie: Movie) => {
                                return (
                                    <option key={movie.id} value={movie.id}>
                                        {movie.title}
                                    </option>
                                );
                            })}
                        </select>
                    </div>
                    <div className="formRow">
                        <label htmlFor="roomID">Sala:</label>
                        <select name="roomID" id="roomID">
                            {rooms.map((room: Room) => {
                                return (
                                    <option key={room.id} value={room.id}>
                                        {room.number} - {room.sponsor}
                                    </option>
                                );
                            })}
                        </select>
                    </div>
                    <div className="formRow">
                        <label htmlFor="dateStart">Data rozpoczęcia:</label>
                        <input
                            type="datetime-local"
                            name="dateStart"
                            id="dateStart"
                            onChange={() => calculateEndDate(runtime)}
                        />
                    </div>
                    <div className="formRow">
                        <label htmlFor="dateEnd">Data zakończenia:</label>
                        <input
                            type="datetime-local"
                            name="dateEnd"
                            id="dateEnd"
                            readOnly
                        />
                    </div>
                    <div className="formRow">
                        <label htmlFor="normalPrice">
                            Cena biletu zwykłego:
                        </label>
                        <input
                            name="normalPrice"
                            id="normalPrice"
                            type="number"
                            min="1"
                            step="any"
                            defaultValue={0}
                        />
                    </div>
                    <div className="formRow">
                        <label htmlFor="vipPrice">Cena biletu vip:</label>
                        <input
                            name="vipPrice"
                            id="vipPrice"
                            type="number"
                            min="1"
                            step="any"
                            defaultValue={0}
                        />
                    </div>
                    <div className="formRow">
                        <input type="submit" value="Zapisz" />
                    </div>
                </form>
            </div>
            <Toast />
        </main>
    );
}

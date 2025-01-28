import { Movie, Screening } from "../types.ts";
import Header from "./common/Header.tsx";
import { useState, useEffect } from "react";
import MoviePanel from "./common/MoviePanel.tsx";
import { Timestamp } from "https://deno.land/x/postgres@v0.17.0/query/types.ts";
import { Link } from "react-router-dom";

export default function MainPage() {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [screenings, setScreenings] = useState<Screening[]>([]);

    useEffect(() => {
        (async () => {
            const response = await fetch("/api/screenings/", {
                method: "GET",
            });
            const data = await response.json();
            const screenings = data.map(
                ([screening_id, movie_id, room_id, start_date, title]: [
                    number,
                    number,
                    number,
                    Timestamp,
                    string
                ]) => ({
                    screening_id,
                    movie_id,
                    room_id,
                    start_date: new Date(start_date),
                    title,
                })
            );
            const movies = Array.from(
                screenings
                    .reduce((map: any, { movie_id, title }: any) => {
                        if (!map.has(movie_id)) {
                            map.set(movie_id, { id: movie_id, title: title });
                        }
                        return map;
                    }, new Map<number, Movie>())
                    .values()
            );
            setScreenings(screenings);
            setMovies(movies);
        })();
    }, []);

    return (
        <main>
            <Header />
            <div id="movieBanner">
                <h1>Repertuar:</h1>
            </div>
            <div className="moviesCont">
                {movies.map((movie: Movie) => {
                    return (
                        <div key={movie.id} className="moviePanelCont">
                            <MoviePanel id={movie.id} key={movie.id} />
                            <div className="reservationLinkCont">
                                {screenings.map((screening: Screening) => {
                                    if (screening.movie_id === movie.id) {
                                        return (
                                            <div
                                                key={screening.screening_id}
                                                className="reservationLink"
                                            >
                                                <Link
                                                    to="/reservation"
                                                    state={{
                                                        screening_id:
                                                            screening.screening_id,
                                                        room_id:
                                                            screening.room_id,
                                                        title: movie.title,
                                                    }}
                                                >
                                                    {screening.start_date
                                                        .getDate()
                                                        .toString()
                                                        .padStart(2, "0")}
                                                    .
                                                    {(
                                                        screening.start_date.getMonth() +
                                                        1
                                                    )
                                                        .toString()
                                                        .padStart(2, "0")}{" "}
                                                    -{" "}
                                                    {screening.start_date
                                                        .getHours()
                                                        .toString()
                                                        .padStart(2, "0")}
                                                    :
                                                    {screening.start_date
                                                        .getMinutes()
                                                        .toString()
                                                        .padStart(2, "0")}
                                                </Link>
                                            </div>
                                        );
                                    }
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>
            <div className="footer"></div>
        </main>
    );
}

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
            <h1>Repertuar:</h1>
            {movies.map((movie: Movie) => {
                return (
                    <div key={movie.id}>
                        <MoviePanel id={movie.id} key={movie.id} />
                        {screenings.map((screening: Screening) => {
                            if (screening.movie_id === movie.id) {
                                return (
                                    <Link
                                        key={screening.screening_id}
                                        to="/reservation"
                                        state={{
                                            screening_id:
                                                screening.screening_id,
                                            room_id: screening.room_id,
                                            title: movie.title,
                                        }}
                                    >
                                        <div>
                                            {screening.start_date.getDate()}.
                                            {screening.start_date.getMonth() +
                                                1}
                                            - {screening.start_date.getHours()}:
                                            {screening.start_date.getMinutes()}
                                        </div>
                                    </Link>
                                );
                            }
                        })}
                    </div>
                );
            })}
            <div className="footer"></div>
        </main>
    );
}

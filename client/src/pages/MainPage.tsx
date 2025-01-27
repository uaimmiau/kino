import { Movie, Screening } from "../types.ts";
import Header from "./common/Header.tsx";
import { useState, useEffect } from "react";
import MoviePanel from "./common/MoviePanel.tsx";
import { Timestamp } from "https://deno.land/x/postgres@v0.17.0/query/types.ts";

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
                ([screening_id, movie_id, start_date]: [
                    number,
                    number,
                    Timestamp
                ]) => ({
                    screening_id,
                    movie_id,
                    start_date,
                })
            );
            const movies = Array.from(
                screenings
                    .reduce((map: any, { movie_id }: any) => {
                        if (!map.has(movie_id)) {
                            map.set(movie_id, { id: movie_id });
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
                return <MoviePanel id={movie.id} key={movie.id} />;
            })}
            <div className="footer"></div>
        </main>
    );
}

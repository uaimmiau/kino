import Sidebar from "../common/Sidebar.tsx";
import { Movie } from "../../types.ts";
import { useState, useEffect } from "react";
import "../../css/Common.css";
import Header from "../common/Header.tsx";
import MoviePanel from "../common/MoviePanel.tsx";

export default function Movies() {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [currentMovie, setcurrentMovie] = useState<Movie>({});

    useEffect(() => {
        (async () => {
            const response = await fetch("/api/movies/", {
                method: "GET",
            });
            const data = await response.json();
            const movies = data.map(([id, title]: [number, string]) => ({
                id,
                title,
            }));
            setMovies(movies);
        })();
    }, []);

    return (
        <main>
            <Header />
            <div className="mainCont">
                <Sidebar />
                <div id="ButtCont">
                    {movies.map((movie: Movie) => {
                        return (
                            <div
                                key={movie.id}
                                className="Button"
                                onClick={() =>
                                    setcurrentMovie({ id: movie.id })
                                }
                            >
                                <p>{movie.title}</p>
                            </div>
                        );
                    })}
                </div>
                {currentMovie.id != undefined ? (
                    <MoviePanel id={currentMovie.id} />
                ) : (
                    false
                )}
            </div>
        </main>
    );
}

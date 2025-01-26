import Sidebar from "../common/Sidebar.tsx";
import { Movie } from "../../types.ts";
import { useState, useEffect } from "react";
import "../../css/Common.css";
import Header from "../common/Header.tsx";

export default function Movies() {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [posterUrl, setPosterUrl] = useState<string | null>(null);
    const [currentMovie, setcurrentMovie] = useState<Movie>();

    const loadMovie = (id: number): void => {
        (async () => {
            const response = await fetch(`/api/movie/${id}/`);
            const data = await response.json();
            setcurrentMovie(data);

            const blob = new Blob([new Uint8Array(data.poster)], {
                type: "image/jpeg",
            });
            const url = URL.createObjectURL(blob);
            setPosterUrl(url);
        })();
    };

    const renderMovie = () => {
        if (currentMovie) {
            return (
                <div id="roomHeader">
                    <h2>{currentMovie.title}</h2>
                    <h3>Czas trwania: {currentMovie.runtime}</h3>
                    <div className="multiline">{currentMovie.desc}</div>
                    {posterUrl && (
                        <img src={posterUrl} alt={currentMovie.title} />
                    )}
                </div>
            );
        }
    };

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

    // this should run when component unmounts or posterUrl changes, hopefully
    useEffect(() => {
        return () => {
            if (posterUrl) {
                URL.revokeObjectURL(posterUrl);
            }
        };
    }, [posterUrl]);

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
                                onClick={() => loadMovie(movie.id)}
                            >
                                <p>{movie.title}</p>
                            </div>
                        );
                    })}
                </div>
                <div id="movieCont">{renderMovie()}</div>
            </div>
        </main>
    );
}

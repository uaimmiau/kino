import { useState, useEffect } from "react";
import { Movie } from "../../types.ts";

export default function MoviePanel({ id }: { id: number }) {
    const [movie, setMovie] = useState<Movie>();
    const [posterUrl, setPosterUrl] = useState<string | null>(null);

    useEffect(() => {
        (async () => {
            const response = await fetch(`/api/movie/${id}/`);
            const data = await response.json();
            setMovie(data);

            const blob = new Blob([new Uint8Array(data.poster)], {
                type: "image/jpeg",
            });
            const url = URL.createObjectURL(blob);
            setPosterUrl(url);
        })();
    }, [id]);

    const renderMovie = () => {
        if (movie) {
            return (
                <div id="movieCont">
                    <h2>{movie.title}</h2>
                    <h3>Czas trwania: {movie.runtime}</h3>
                    <div className="multiline">{movie.desc}</div>
                    {posterUrl && <img src={posterUrl} alt={movie.title} />}
                </div>
            );
        }
    };

    // this should run when component unmounts or posterUrl changes, hopefully
    useEffect(() => {
        return () => {
            if (posterUrl) {
                URL.revokeObjectURL(posterUrl);
            }
        };
    }, [posterUrl]);
    return <div id="movieCont">{renderMovie()}</div>;
}

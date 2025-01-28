import { useState, useEffect } from "react";
import { Movie } from "../../types.ts";
import "../../css/Common.css";

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
                <div className="movieCont">
                    {posterUrl && <img src={posterUrl} alt={movie.title} />}
                    <div className="descCont">
                        <h2>{movie.title}</h2>
                        <h3>Czas trwania: {movie.runtime} minut</h3>
                        <div className="multiline">{movie.desc}</div>
                    </div>
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

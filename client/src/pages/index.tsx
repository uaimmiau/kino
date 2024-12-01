import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Dino } from "../types.ts";

export default function Index() {
  const [dinosaurs, setDinosaurs] = useState<Dino[]>([]);

  useEffect(() => {
    (async () => {
      const response = await fetch("/api/dinosaurs/");
      const allDinosaurs = (await response.json()) as Dino[];
      setDinosaurs(allDinosaurs);
    })();
  }, []);

  return (
    <main>
      <h1>Welcome to Dinosour app</h1>
      <p>Click on a dinosour below to learn more</p>
      {dinosaurs.map((dinosaur: Dino) => {
        return (
          <Link
            to={`/${dinosaur.name.toLocaleLowerCase()}`}
            key={dinosaur.name}
            className="dinosaur"
          >
            {dinosaur.name}
          </Link>
        );
      })}
    </main>
  );
}

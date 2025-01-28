import { useState } from "react";
import Sidebar from "../common/Sidebar.tsx";
import Toast from "../Toast.tsx";
import Util from "../Util.tsx";
import Validator from "../common/Validator.tsx";
import Header from "../common/Header.tsx";

export default function MovieMgmt() {
    const [poster, setPoster] = useState<File | null>(null);
    return (
        <main>
            <Header />
            <div className="mainCont">
                <Sidebar />
                <div id="mgmtCont">
                    <form
                        onSubmit={(e: React.FormEvent) => {
                            e.preventDefault();
                            const target = e.target as typeof e.target & {
                                name: { value: string };
                                desc: { value: string };
                                runtime: { value: number };
                            };
                            const name = target.name.value;
                            const desc = target.desc.value;
                            const runtime = target.runtime.value;
                            if (Validator.validateMovie(name, desc, runtime)) {
                                const formData = new FormData();
                                formData.append("name", name);
                                formData.append("desc", desc);
                                formData.append("runtime", runtime.toString());
                                formData.append("poster", poster);
                                (async () => {
                                    await fetch(`/api/save_movie`, {
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
                            <label htmlFor="name">Nazwa filmu:</label>
                            <input type="text" name="name" id="name" />
                        </div>
                        <div className="formRow">
                            <label htmlFor="desc">Opis:</label>
                            <textarea name="desc" id="desc"></textarea>
                        </div>
                        <div className="formRow">
                            <label htmlFor="runtime">Czas trwania:</label>
                            <input
                                type="number"
                                name="runtime"
                                id="runtime"
                                defaultValue={100}
                            />
                        </div>
                        <div className="formRow">
                            <label htmlFor="poster">Plakat:</label>
                            <input
                                type="file"
                                name="poster"
                                id="poster"
                                accept="image/png, image/jpeg"
                                onChange={(e) => {
                                    if (
                                        e.target.files &&
                                        e.target.files.length > 0
                                    )
                                        setPoster(e.target.files[0]);
                                }}
                            />
                        </div>
                        <div className="formRow">
                            <input type="submit" value="Zapisz" />
                        </div>
                    </form>
                </div>
                <Toast />
            </div>
        </main>
    );
}

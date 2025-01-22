export default class Util {
    static showToast(msg: string) {
        console.log(msg);
        const toast = document.getElementById("toastCont");
        if (!msg) return;
        if (toast) {
            toast.className = "show";
            toast.innerHTML = msg;
            setTimeout(function () {
                toast.className = toast.className.replace("show", "");
            }, 3000);
        }
    }
}

import Util from "./Util.tsx";

export default class Validator {
    static validateStringNotEmpty(
        name: string,
        value: string,
        alert: boolean
    ): boolean {
        if (value) {
            return true;
        } else {
            if (alert) {
                Util.showToast(`Podaj poprawną wartość dla ${name}`);
            }
            return false;
        }
    }

    static validateNumberGreaterThanZero(
        name: string,
        value: number,
        alert: boolean
    ): boolean {
        if (value > 0) {
            return true;
        } else {
            if (alert) {
                Util.showToast(`Podaj poprawny wymiar dla ${name}`);
            }
            return false;
        }
    }

    static validateDefined(msg: string, value: any, alert: boolean): boolean {
        if (value.length != 0) {
            return true;
        } else {
            if (alert) {
                Util.showToast(`${msg}`);
            }
            return false;
        }
    }

    static validateNumber(msg: string, value: any, alert: boolean): boolean {
        if (!isNaN(+value)) {
            return true;
        } else {
            if (alert) {
                Util.showToast(`${msg}`);
            }
            return false;
        }
    }

    static stringInRange(value: string, min: number, max: number): boolean {
        return (
            typeof value === "string" &&
            value.length >= min &&
            value.length <= max
        );
    }

    static validateMovie(name: string, desc: string, runtime: number) {
        if (!this.stringInRange(name, 1, 200)) {
            Util.showToast("Nazwa powinna mieć między 1 a 200 znaków");
            return false;
        }
        if (!this.stringInRange(desc, 1, 2000)) {
            Util.showToast("Opis powinnien mieć między 1 a 2000 znaków");
            return false;
        }
        if (isNaN(+runtime) || runtime > 32767 || runtime <= 0) {
            Util.showToast("Podaj poprawny czas trwania");
            return false;
        }
        return true;
    }
}

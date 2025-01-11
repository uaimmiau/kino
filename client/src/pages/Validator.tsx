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
                globalThis.alert(`Podaj poprawną wartość dla ${name}`);
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
                globalThis.alert(`Podaj poprawny wymiar dla ${name}`);
            }
            return false;
        }
    }

    static validateDefined(msg: string, value: any, alert: boolean): boolean {
        if (value.length != 0) {
            return true;
        } else {
            if (alert) {
                globalThis.alert(`${msg}`);
            }
            return false;
        }
    }

    static validateNumber(msg: string, value: any, alert: boolean): boolean {
        if (!isNaN(+value)) {
            return true;
        } else {
            if (alert) {
                globalThis.alert(`${msg}`);
            }
            return false;
        }
    }
}

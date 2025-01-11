export default class Validator {
    static validateRoom(body: any): [boolean, string] {
        const sponsor: string = body.roomSponsor;
        const roomNo = body.roomNumber;
        const tech = body.roomTechnology;
        const seats = body.seatList;
        let isError: boolean = false;
        let errorMsg: string;

        if (sponsor.length >= 40) {
            isError = true;
            // errorMsg = "Nazwa sponsora zbyt długa";
        }
        if (roomNo >= 32767) {
            isError = true;
        }
        if (tech.length > 3) {
            isError = true;
        }
        if (seats.length == 0 || seats[0].length == 0) {
            isError = true;
        }
        //TODO: error messages for different errors
        errorMsg = "Podano złe dane";
        return [isError, errorMsg];
    }
}

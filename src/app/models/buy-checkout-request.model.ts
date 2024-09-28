export class BuyCheckoutRequest {
    userId: string;
    userDeviceId: string;
    catalogId: number;
    quantity: number;
    address: any;
    notes:string;

    constructor(userId: string, userDeviceId: string, catalogId: number, quantity: number, address: any, notes:string) {
        this.userId = userId;
        this.userDeviceId = userDeviceId;
        this.catalogId = catalogId;
        this.quantity = quantity;
        this.address = address;
        this.notes = notes;
    }
}

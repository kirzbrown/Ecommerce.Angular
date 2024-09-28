export class CartAddItemRequest {
    userId: string;
    userDeviceId: string;
    catalogId: number;
    quantity: number;

    constructor(userId: string, userDeviceId: string, catalogId: number, quantity: number) {
        this.userId = userId;
        this.userDeviceId = userDeviceId;
        this.catalogId = catalogId;
        this.quantity = quantity;
    }
}

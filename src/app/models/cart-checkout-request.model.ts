export class CartCheckoutRequest {
    cartId: number;
    address: any;
    notes:string;

    constructor(cartId: number, address: any, notes:string) {
        this.cartId = cartId;
        this.address = address;
        this.notes = notes;
    }
}

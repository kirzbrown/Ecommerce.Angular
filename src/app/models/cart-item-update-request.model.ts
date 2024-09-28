export class CartItemUpdateRequest {
    orderItemId: number;
    quantity: number;

    constructor(orderItemId: number, quantity: number) {
        this.orderItemId = orderItemId;
        this.quantity = quantity;
    }
}

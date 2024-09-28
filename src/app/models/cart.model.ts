import { Catalog } from "./catalog-item.model"

export interface Cart { 
    id: number,
    orderDate: string,
    status: number,
    saleTax: number,
    isPaid: boolean,
    totalPrice: number,
    subTotalPrice: number,
    notes: string,
    userId: string,
    addressId: number,
    storeId: number,
    store: any,
    address: any,
    orderItems: CartItem[]
} 

export interface CartItem {
    id: number,
    price: number,
    discountedPrice: number,
    name: string,
    imageUrl: string,
    model: string,
    capacity: string,
    quantity: number,
    catalogId: number,
    orderId: number,
    catalog: Catalog
}


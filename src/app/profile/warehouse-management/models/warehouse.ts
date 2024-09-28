export interface WareHouse {
    id:                number;
    rowVersion:        string;
    name:              string;
    address:           string;
    contactNumber:     string;
    email:             string;
    adminUserId:       string;
    warehouseCatalogs: WarehouseCatalog[];
    paybizzAccountId:  number;
}

export interface WarehouseCatalog {
    id:          number;
    rowVersion:  string;
    stock:       number;
    catalogId:   number;
    warehouseId: number;
    isActive:    boolean;
    catalog:     Catalog;
}

export interface Catalog {
    id:                        number;
    rowVersion:                string;
    title:                     string;
    subTitleOne:               string;
    subTitleTwo:               string;
    model:                     string;
    capacity:                  string;
    imageUrl:                  string;
    price:                     number;
    stockKeepingUnit:          string;
    discount:                  number;
    discountedPrice:           number;
    isLatestModel:             boolean;
    origin:                    string;
    yearsWarranty:             number;
    htmlContent:               string;
    isDeleted:                 boolean;
    category:                  string;
    isPromoActive:             boolean;
    promoStickerImageUrl:      string;
    isMiniBannerActive:        boolean;
    miniBannerStickerImageUrl: string;
    isWarrantyActive:          boolean;
    warrantyStickerImageUrl:   string;
    featureImages:             FeatureImage[];
    productTechnologies:       ProductTechnology[];
    productImages:             FeatureImage[];
    storeCatalogs:             null[];
    created:                   Date;
}

export interface FeatureImage {
    id:         number;
    rowVersion: string;
    catalogId?: number;
    imageUrl:   string;
    name?:      string;
}

export interface ProductTechnology {
    id:           number;
    rowVersion:   string;
    catalogId:    number;
    technologyId: number;
    technology:   FeatureImage;
}

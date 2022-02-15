export const HTTP_STATUS = {
    SUCCESS: 200,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500,
    BAD_REQUEST: 400,
    NOT_AUTHORISED: 401,
    FORBIDDEN: 403,
};

export const ORDER_STATUS = {
    ORDERED: 'ORDERED',
    ACCEPT: 'ACCEPT',
    DECLINED: 'DECLINED',
    PACKED: 'PACKED',
    SHIPPED: 'SHIPPED',
    DELIVERY: 'DELIVERY',
    DELIVERED: 'DELIVERED',
    COMPLETED: 'COMPLETED',
};

export const ORDER_PAYMENT_TYPE = {
    COD: 'COD',
    STRIPE: 'STRIPE',
};

export const PRODUCT_CONDITION = {
    USED: 'USED',
    NEW: 'NEW',
    NOT_SPECIFIED: 'NOT_SPECIFIED',
};

export const PRODUCT_FILTER_SORT = {
    PRICE_HIGH_TO_LOW: "priceHighToLower",
    PRICE_LOW_TO_HIGH: "priceLowerToHigh",
    DATE_PUBLISHED: 'datePublished'
}
export const NOTIFICATION_TYPE = {
    ORDER: "ORDER",
    TEXT: "TEXT",
    MAKE_OFFER: "MAKE_OFFER"
}

export const USER_TYPE = {
    CUSTOMER: 'CUSTOMER',
    SELLER: 'SELLER'
}

export const AMOUNT_TYPE = {
    CREDIT: 'CREDIT',
    DEBIT: 'DEBIT'
};
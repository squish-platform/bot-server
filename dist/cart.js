"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Cart {
    constructor() {
        this.items = {};
        this.count = 0;
        this.sum = 0;
    }
    add(n, item) {
        this.count += n;
        this.sum += n * +item.amount;
        this.items[item.id] = (this.items[item.id] || 0) + n;
    }
}
exports.Cart = Cart;
//# sourceMappingURL=cart.js.map
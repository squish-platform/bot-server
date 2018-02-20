export class Cart {
  items = {}
  count = 0
  sum = 0

  add(n: number, item) {
    this.count += n
    this.sum += n * +item.amount
    this.items[item.id] = (this.items[item.id] || 0) + n
  }
}

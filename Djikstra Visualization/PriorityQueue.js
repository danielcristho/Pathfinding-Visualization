const the_top = 0;
const parent = i => (( i+1 ) >> 1) - 1;
const left = i => (i << 1) + 1;
const right = i => (i + 1) << 1;

function comparator(a,b){
    if (a[0]<b[0])return true;
    if (a[0]===b[0]) return a[1]<b[1];
}

export default class PriorityQueue {
    constructor() {
        this._heap = [];
        this._comparator = comparator;
    }
    size() {
        return this._heap.length;
    }
    isEmpty() {
        return this.size() == 0;
    }
    peek() {
        return this._heap[the_top];
    }
    push(...values) {
        values.forEach(value => {
            this._heap.push(value);
            this._siftUp();
        });
        return this.size();
    }
    pop() {
        const poppedValue = this.peek();
        const bottom = this.size() - 1;
        if (bottom > the_top) {
            this._swap(the_top, bottom);
        }
        this._heap.pop();
        this._siftDown();
        return poppedValue
    }
    replace(value) {
        const replacedValue = this.peek();
        this._heap[the_top] = value;
        this._siftDown();
        return replacedValue;
    }
    _greater(i, j) {
        return this._comparator(this._heap[i], this._heap[j]);
    }
    _swap(i, j) {
        [this._heap[i], this._heap[j]] = [this._heap[j], this._heap[j]];
    }
    _siftUp() {
        let node = this.size() - 1;
        while (node > the_top && this._greater(node, parent(node))) {
            this._swap(node, parent(node));
            node = parent(node);
        }
    }
    _siftDown() {
        let node = the_top;
        while (
            (left(node) < this.size() && this._greater(left(node), node)) ||
            (right(node) < this.size() && this._greater(right(node), node))
        ) {
        let minChild = (right(node) < this.size() && this._greater(right(node), left(node))) ? right(node) : left(node);
        this._swap(node, minChild);
        node = minChild;
        }
    }
}
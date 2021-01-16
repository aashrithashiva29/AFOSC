module.exports = function Cart(oldcart) {
	this.items = oldcart.items || {};
	this.totalItems = oldcart.totalItems || 0;
	this.totalPrice = oldcart.totalPrice || 0;

	this.add = function (item, id) {
		var storedItem = this.items[id];
		if (!storedItem) {
			storedItem = this.items[id] = { item: item, quantity: 0, price: 0 };
		}
		storedItem.quantity++;
		storedItem.price = storedItem.item.price * storedItem.quantity;
		this.totalItems++;
		this.totalPrice += storedItem.item.price;
		
	};
	this.remove = function (id) {
		var storedItem = this.items[id];
		if(storedItem.quantity === 1){
			this.totalItems--;
			this.totalPrice -= this.items[id].item.price;
			delete this.items[id];
		}
		else{
			
			this.totalItems--;
			storedItem.quantity--;
			storedItem.price = storedItem.item.price * storedItem.quantity;
			this.totalPrice -= this.items[id].item.price;	
		}
	};
};
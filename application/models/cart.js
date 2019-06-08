// module.exports = function Cart(oldCart){
//   this.items= oldCart.items || {};
//   this.totalQty=oldCart.totalQty || 0;
//   this.totalPrice=oldCart.totalPrice || 0;
//   this.add = function(item,id){
//     var storedItem = this.items[id];
//     if(!storedItem){
//       storedItem = this.items[id] = {item:item,qty:0,price:0};
//     }
//     storedItem.qty++;
//     storedItem.price = 100*storedItem.qty;
//     this.totalQty++;
//     this.totalPrice += 100;
//   };
  module.exports = function Cart(oldCart){
  this.id= oldCart.id || {};
  this.totalQty=oldCart.totalQty || 0;
  this.totalPrice=oldCart.totalPrice || 0;
  this.add = function(pid){
    var storedItem = this.id[pid];
    if(!storedItem){
      storedItem = this.id[pid] = {id:pid,qty:0,price:0};
    }
    storedItem.qty++;
    storedItem.price = 100*storedItem.qty;
    this.totalQty++;
    this.totalPrice += 100;
  };
  
  this.reduceByOne=function(id){
    this.id[id].qty--;
    this.id[id].price -= 100;
    this.totalQty--;
    this.totalPrice -=100;
    if(this.id[id].qty<=0){
      delete this.id[id];
    }
  };
  this.removeItem = function(id){
    this.totalQty -=this.id[id].qty;
    this.totalPrice -=100;
    delete this.id[id];
  };
  
  this.generateArray = function(){
    var arr = [];
    for(var id in this.id){
      arr.push(this.id[id]);
    }
    return arr;
  };
};
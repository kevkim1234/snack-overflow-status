// example names
var names = ["Uncrustables", "Yummy Snacks", "Tasty Treats", "Otter Pops",
             "Dans", "Kyles", "Wills", "Woodies", "Charlies", "Savory Bites",
             "Kevins", "Silins", "Nay-nays", "Purple Nay-nays", "Peaches",
             "Bacons", "Beefs", "Cocoa Mo's", "Crispy Rice", "Zany Fruits"],

// example values
    stock = [115, 9, 131, 12,
             150, 141, 75, 42, 0, 11,
             30, 18, 89, 117, 0,
             153, 55, 92, 198, 67],

// example data made by zipping together names and stock
    data = names.map(function(name, index) {
      return {
        key: name,
        stock: stock[index]
      };
    });

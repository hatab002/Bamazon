var mysql = require("mysql");
var inquirer = require("inquirer");
var itemPurchased = "";
var itemQuantity = "";
var itemsRemaining = "";
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "",
    database: "bamazonDB"
});

connection.connect(function (err) {
    if (err) throw err;
    startup();
})

function startup() {
    inquirer.prompt({
        name: "itemsDisplay",
        type: "rawlist",
        message: "Welcome to Bamazon!!! What would you like to do?",
        choices: ["View items for sale", "Make a purchase", "Exit"]
    }).then(function (answer) {
        if (answer.itemsDisplay === "View items for sale") {
            displayProduct();
            next();
        } else if (answer.itemsDisplay === "Make a purchase") {
            purchase();
        } else if (answer.itemsDisplay === "Exit") {
            console.log("See you later!")
            connection.end();
            process.exit(1);
        }
    })
}

function displayProduct() {
    var query = "SELECT item_id, product_name, price FROM products";
    connection.query(query, function (err, result) {
        if (err) throw err;
        for (i = 0; i < result.length; i++) {
            console.log(`\nItem ID: ${result[i].item_id} \nProduct: ${result[i].product_name} \nPrice: $ ${result[i].price}`);
            console.log('----------------------');
        };
    });
}

function next() {
    inquirer.prompt({
        name: "next",
        type: "confirm",
        message: "Would you like to purchase an item?"
    }).then(function (nextResponse) {
        if (nextResponse.next === true) {
            purchase();
        } else if (nextResponse.next === false) {
            console.log("Goodbye!");
            connection.end();
            process.exit(1);
        }
    })
}

function purchase() {
    inquirer.prompt([{
            name: "purchaseID",
            type: "input",
            message: "Enter the item ID of the product you'd like to purchase"
        },
        {
            name: "purchaseQuantity",
            type: "input",
            message: "How many of this item would you like to purchase?"
        }
    ]).then(function (purchaseResponse) {
        itemPurchased = purchaseResponse.purchaseID;
        itemQuantity = purchaseResponse.purchaseQuantity;
        var query = "SELECT item_id, product_name, price, stock_quantity FROM products WHERE?";
        connection.query(query, {
            item_id: itemPurchased
        }, function (err, quantityCheck) {
            itemsRemaining = quantityCheck[0].stock_quantity;
            var itemName = quantityCheck[0].product_name;
            var itemPrice = quantityCheck[0].price;
            var total = itemQuantity * itemPrice;
            if (itemsRemaining <= 0) {
                console.log("Sorry this item is currently out of stock please try again later!");
            } else {
                console.log(`\nYour cart includes: ${itemQuantity} x ${itemName} \nYour Total: $ ${total}`);
                checkout();
            }
        })
    })
}

function checkout() {
    inquirer.prompt({
        name: "checkout",
        type: "confirm",
        message: "Checkout?"
    }).then(function (checkoutResponse) {

        if (checkoutResponse.checkout === true) {
            console.log("Thank you for shopping with us!");
            var newQuantity = itemsRemaining - itemQuantity;
            var checkoutQuery = "UPDATE products SET? WHERE?";
            connection.query(checkoutQuery, [{
                stock_quantity: newQuantity
            }, {
                item_id: itemPurchased
            }], function (err) {
                if (err) throw err;
                console.log("Thank you for your order! Your order is confirmed!");
                continueShopping();
            })
        } else if (checkoutResponse.checkout === false) {
            console.log("Thanks for stopping by!");
            connection.end();
            process.exit(1);
        }
    })
}

function continueShopping() {
    inquirer.prompt({
        name: "continueShopping",
        type: "confirm",
        message: "Continue shopping?"
    }).then(function (continueShoppingResponse) {
        if (continueShoppingResponse.continueShopping === true) {
            startup();
        } else if (continueShoppingResponse.continueShopping === false) {
            console.log("Thanks for shopping with us! Goodbye!");
            connection.end();
            process.exit(1);
        }
    })
}
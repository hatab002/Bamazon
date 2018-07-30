var inquirer = require("inquirer");
var mysql = require("mysql");
var stock = "";
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "",
    database: "bamazonDB"
});

var itemID = "";
var itemStockQ = "";
connection.connect(function (err) {
    if (err) throw err;
    managerStartup();
});

function managerStartup(){
    inquirer.prompt({
        name: "managersMenu",
        type: "list",
        message: "Welcome! Please make a selection.",
        choices: ["View Products for sale", "View Low Inventory", "Add to Inventory", "Add New Product"]
    }).then(function(selection){
        var managerChoice = selection.managersMenu;
        if (managerChoice === "View Products for sale"){
            displayAllProducts();
        } else if(managerChoice === "View Low Inventory"){
            lowInventory();
        } else if (managerChoice === "Add to Inventory"){
            addOption();
        } else if (managerChoice === "Add New Product"){
            addNew();
        }
    })
}

function displayAllProducts(){
    var queryProd = "SELECT item_id, product_name, price, stock_quantity FROM products";
    connection.query(queryProd, function(err, displayResults){
        if (err) throw err;
        for (i = 0; i < displayResults.length; i++) {
            console.log(`\nItem ID: ${displayResults[i].item_id} \nProduct: ${displayResults[i].product_name} \nPrice: $ ${displayResults[i].price} \nQuantity: ${displayResults[i].stock_quantity}`);
            console.log('----------------------');
        };
        })
};

function lowInventory(){
    var queryInv = "SELECT item_id, product_name, stock_quantity FROM products";
    connection.query(queryInv, function(err, invRes){
        if (err) throw err;
        for (j = 0; j < invRes.length; j++) {
            if (invRes[j].stock_quantity <= 5){
            console.log("\nThis item is low on stock!")
            console.log(`\nItem ID: ${invRes[j].item_id} \nProduct: ${invRes[j].product_name} \nQuantity: ${invRes[j].stock_quantity}`);
            console.log('----------------------');
        };
        };
    });
};



function addOption(){
    inquirer.prompt({
        name: "addOption",
        type:"list",
        message:"Please make a selection",
        choices: ["I know which item I want to add to", "Show me that list of items again"]
    }).then(function(addQResult){
        if (addQResult.addOption === "I know which item I want to add to"){
            inquirer.prompt([{
                name: "addID",
                type: "input",
                message: "Please put in the ID of the item you'd like to replenish",
                validate: function(value) {
                    if (isNaN(value) === false) {
                      return true;
                    }
                    return false;
                  }          
            },
        {
            name: "addQuan",
            type: "input",
            message: "How many of this item would you like to add to the inventory?",
            validate: function(value) {
                if (isNaN(value) === false) {
                  return true;
                }
                return false;
              }      
        }]).then(function(addResponse){
            var queryAddInv = "UPDATE products SET? WHERE?";
            connection.query(queryAddInv, 
                [{stock_quantity: + addResponse.addQuan},
                {item_id: addResponse.addID}],
                 function(err, updateResult){
                if (err) throw err;
                console.log("Inventory updated!")
            })
        })
        }
    })
}
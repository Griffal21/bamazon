//this first bit is taken from greatBayBasic.js
var mysql = require("mysql");
var inquirer = require("inquirer");

var cost = 0;

// create the connection information for the sql database
var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "Alphalima2168",
  database: "bamazon_db"
});

// connect to the mysql server and sql database
connection.connect(function (err) {
  if (err) throw err;
  // run the start function after the connection is made to prompt the user
  start();
});

//this function is set up to determine if the user is a buyer or seller and take them to the appropriate menu
function start() {
  console.log("-----------------------------------");
  console.log("Welcome to Bamazon.com!  *We are not affiliated with nor have we even heard of amazon.com* ");
  console.log("-----------------------------------");
  showProducts();
  buyItem();
}


function showProducts() {
  connection.query("SELECT * FROM products", function(err, res) {
    for (var i = 0; i < res.length; i++) {
      console.log("#" + res[i].item_id + " | " + res[i].product_name + " | Dept: " + res[i].department_name + " | $" + res[i].price + " | Stock: " + res[i].stock_quantity);
    }
    console.log("-----------------------------------");
  });
}// showProducts

function buyItem() {
  connection.query("SELECT * FROM products", function(err, results) {
    if (err) throw err;
    // once you have the items, prompt the user for which they'd like to buy
    inquirer
      .prompt([
        {
          name: "choice",
          type: "rawlist",
          choices: function() {
            var choiceArray = [];
            for (var i = 0; i < results.length; i++) {
              choiceArray.push(results[i].product_name);
             // console.log(choiceArray);
            }
            return choiceArray;
          },
          message: "Which item would you like to buy?  *Type the item's Number or Use Arrow Keys*"
        },
        {
          name: "bid",
          type: "input",
          message: "How many would you like to buy?"
        }
      ])
      .then(function(answer) {
        // get the information of the chosen item
        var chosenItem;
        for (var i = 0; i < results.length; i++) {
          //console.log("iii");
          //console.log(results[i].product_name);
          //console.log("Results: " + results[i].product_name + " | matching: " + answer.choice);
          if (results[i].product_name === answer.choice) {
            //console.log("run");
            chosenItem = results[i];
          }
        }
        
       // console.log("Stock Quantity " + chosenItem.stock_quantity);
        
        // determine if the store has enough, using same variables from greatBay
        if (chosenItem.stock_quantity > parseInt(answer.bid)) {
          // we had enough so update stock
          var q = chosenItem.stock_quantity - answer.bid;
         // console.log(q);
          connection.query(
            "UPDATE products SET ? WHERE ?",
            [
              {
                stock_quantity: q
              },
              {
                item_id: chosenItem.item_id
              }
            ],
            
            function(error) {
              if (error) throw err;
              cost = chosenItem.price * answer.bid
              console.log("Purchase Successful!  You have been charged $" + cost);
              start();
            }
          );
        }
        else {
          // if store didn't have enough
          console.log("We don't have enough inventory to fill that order.  Please try again.");
          start();
        }
      });
  });
}// buy item
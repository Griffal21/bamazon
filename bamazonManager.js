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
  console.log("Welcome Bamazon seller!");
  console.log("-----------------------------------");
  start();
}



function start() {
  inquirer
    .prompt({
      name: "startMenu",
      type: "list",
      message: "Perform an action",
      choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product", "EXIT"]
    })
    .then(function(answer) {
      if (answer.startMenu === "View Products for Sale") {
        showProducts();
      }
      else if(answer.startMenu === "View Low Inventory") {
        lowInv();
      } 
      else if(answer.startMenu === "Add to Inventory") {
        addToInv();
      } 
      else if(answer.startMenu === "Add New Product") {
        newItem();
      } 
      else{
        connection.end();
      }
    });
}



function showProducts() {
  connection.query("SELECT * FROM products", function(err, res) {
    console.log("-----------------------------------");
    for (var i = 0; i < res.length; i++) {
      console.log("#" + res[i].item_id + " | " + res[i].product_name + " | Dept: " + res[i].department_name + " | $" + res[i].price + " | Stock: " + res[i].stock_quantity);
    }
    console.log("-----------------------------------");
  });
  start();
}// showProducts

var a = true;

function lowInv() {
  connection.query("SELECT * FROM products", function(err, res) {
    for (var i = 0; i < res.length; i++) {
      if (res[i].stock_quantity < 5) {
      console.log("\n The following items' stock quanties are low: \n");
      console.log("#" + res[i].item_id + " | " + res[i].product_name + " | Dept: " + res[i].department_name + " | $" + res[i].price + " | Stock: " + res[i].stock_quantity);
      a = false;
      }
    }
    if (a) {console.log("All Items Are Well Stocked!");}
    console.log("-----------------------------------");
    start();
  });
}// lovInv


function addToInv() {
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
          message: "Which item would you like to increase inventory?"
        },
        {
          name: "bid",
          type: "input",
          message: "How many would you like to add?"
        }
      ])
      .then(function(answer) {
        // get the information of the chosen item
        var chosenItem;
        for (var i = 0; i < results.length; i++) {
        
          if (results[i].product_name === answer.choice) {
            chosenItem = results[i];
          }
        }
       //add to inventory
          var q = chosenItem.stock_quantity + parseInt(answer.bid);
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
              console.log("Update Successful!  You have added $" + cost + " to accounts recievable.");
              start();
            }
          );
      });
  });
}// addToInv


function newItem(){
    // prompt for info about the item being put up for auction
    inquirer
      .prompt([
        {
          name: "item",
          type: "input",
          message: "What is the item you would like to submit?"
        },
        {
          name: "category",
          type: "input",
          message: "What category would you like to place your item in? (Make sure you spell correctly... this isn't Amazon here!)"
        },
        {
          name: "startingBid",
          type: "input",
          message: "What is the item's price?",
          validate: function(value) {
            if (isNaN(value) === false) {
              return true;
            }
            return false;
          }
        },
        {
          name: "inventory",
          type: "input",
          message: "How many do you have to sell?",
          validate: function(value) {
            if (isNaN(value) === false) {
              return true;
            }
            return false;
          }
        }
      ])
      .then(function(answer) {
        // when finished prompting, insert a new item into the db with that info
        connection.query(
          "INSERT INTO products SET ?",
          {
            product_name: answer.item,
            department_name: answer.category,
            price: answer.startingBid || 0,
            stock_quantity: answer.inventory || 0
          },
          function(err) {
            if (err) throw err;
            console.log("Your item was successfully added!");
            // re-prompt the user for if they want to bid or post
            start();
          }
        );
      });
}//newItem
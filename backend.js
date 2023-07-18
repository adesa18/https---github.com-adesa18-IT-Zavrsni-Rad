const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const rentacar = {
  host: "localhost",
  port: 3306,
  user: "root",
  password: "sifra",
  database: "rentacar",
};

const connection = mysql.createConnection(rentacar);
connection.connect((error) => {
  if (error) {
    console.log(`Can't connect to the database: ${error}`);
  } else {
    console.log("Connected to the database (3306)");
  }
});



// Register 
app.post("/api/register", callbackOnRegister);

function callbackOnRegister(request, response) {
  const { nameInput, emailInput, usernameInput, passwordInput, isAdmin } =
    request.body;

  const hashedPassword = bcrypt.hashSync(passwordInput, 10);

  const newUser = {
    name: nameInput,
    email: emailInput,
    username: usernameInput,
    password: hashedPassword,
    isAdmin: isAdmin === 1 ? 1 : 0, // Convert isAdmin to 1 or 0 explicitly
  };

  connection.query("INSERT INTO user SET ?", newUser, (error, results) => {
    if (error) {
      console.log("Error inserting user into the database:", error);
      response.status(500).json({ message: "Failed to register user" });
    } else {
      console.log("User registered successfully");
      response.status(200).json({ message: "User registered successfully" });
    }
  });
}



// Login 
app.post("/api/login", callbackOnLogin);

function callbackOnLogin(request, response) {
  const { usernameInput, passwordInput } = request.body;

  connection.query(
    "SELECT * FROM user WHERE username = ?",
    [usernameInput],
    (error, results) => {
      if (error) {
        console.log("Error retrieving user from the database:", error);
        response.status(500).json({ message: "Failed to log in" });
      } else {
        if (results.length > 0) {
          const user = results[0];
          const passwordMatch = bcrypt.compareSync(
            passwordInput,
            user.password
          );

          if (passwordMatch) {
            console.log("User logged in successfully");

            if (user.isAdmin === 1) {
              console.log("Welcome to the Admin Panel.");
              
            }

            response.status(200).json({ message: "User logged in successfully", user });
          } else {
            console.log("Incorrect password");
            response.status(401).json({ message: "Incorrect password" });
          }
        } else {
          console.log("User not found");
          response.status(404).json({ message: "User not found" });
        }
      }
    }
  );
}

//Dashboard

app.get("/api/car", applyCars);

function applyCars(req, resp) {
  const sqlQuery = "SELECT * FROM car";
  const promise = connection.promise().query(sqlQuery);
  promise
    .then(obradiResult)
    .catch(obradiError);

  function obradiResult([rows, fields]) {
    const responseObject = {
      items: rows,
    };
    resp.json(responseObject);
  }

  function obradiError(error) {
    console.log(error);
  }
}

const serverPort = 3000;
app.listen(serverPort, () => {
  console.log(`Server is running on port ${serverPort}`);
});

//dashboard-order-forma

app.post("/api/dashboard", callbackOnDashboardForm);

function callbackOnDashboardForm(request, response) {
  const {
    UserOrderDetails,
    FirstNameInput,
    LastNameInput,
    FromDate,
    ToDate,
    PhoneNumberInput,
    CustomerEmail,
    CustomerPrice
    
    
  } = request.body;

  
  if (!PhoneNumberInput) {
    return response
      .status(400)
      .json({ message: "Phone number is required" });
  }

  const newOrder = {
    "user-order": UserOrderDetails,
    "first-name": FirstNameInput,
    "last-name": LastNameInput,
    "from-date": FromDate,
    "to-date": ToDate,
    "phone-number": PhoneNumberInput,
    'customeremail': CustomerEmail,
    'total_price': CustomerPrice
    
  };

  connection.query(
    "INSERT INTO `order` SET ?",
    newOrder,
    (error, results) => {
      if (error) {
        console.log("Error during processing:", error);
        response
          .status(500)
          .json({ message: "Error during processing, try again." });
      } else {
        console.log("Order has been sent successfully");
        response.status(200).json({ message: "Order process went well." });
      }
    }
  );
}




//admin-panel

app.get("/api/order", applyOrders);

function applyOrders(req, resp) {
  const sqlQuery = "SELECT * FROM `order`";
  const promise = connection.promise().query(sqlQuery);
  promise
    .then(obradiResult)
    .catch(obradiError);

  function obradiResult([rows, fields]) {
    const responseObject = {
      items: rows,
    };
    resp.json(responseObject);
  }

  function obradiError(error) {
    console.log(error);
  }
}





app.delete("/api/car/:carId", deleteCar);

function deleteCar(req, res) {
  const carId = req.params.carId;
  const sqlQuery = `DELETE FROM car WHERE idcar = ?`;

  connection.query(sqlQuery, [carId], (error, result) => {
    if (error) {
      console.log(error);
      return res.status(500).json({ error: "Failed to delete car." });
    }

    console.log("Car deleted successfully.");
    res.json({ message: "Car deleted successfully." });
  });
}




app.delete("/api/order/:orderId", deleteOrder);

function deleteOrder(req, res) {
  const orderId = req.params.orderId;
  const sqlQuery = `DELETE FROM \`order\` WHERE idorder = ?`; 

  connection.query(sqlQuery, [orderId], (error, result) => {
    if (error) {
      console.log(error);
      return res.status(500).json({ error: "Failed to delete order." });
    }

    console.log("Order deleted successfully.");
    res.json({ message: "Order deleted successfully." });
  });
}


app.post("/api/admin/logout", (req, res) => {
  req.session.destroy((error) => {
    if (error) {
      console.log("Error during logout:", error);
      res.status(500).json({ message: "Failed to logout" });
    } else {
      console.log("Admin logged out successfully");
      res.status(200).json({ message: "Admin logged out successfully" });
    }
  });
});



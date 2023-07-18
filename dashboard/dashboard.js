const baseUrl = "http://localhost:3000";





function loadPage() {



  const adresa = `${baseUrl}/api/car`;
  const zahtjev = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };
  const promise = fetch(adresa, zahtjev);
  promise
    .then((response) => response.json())
    .catch((error) =>
      console.log("An error occurred while fetching:", error)
    )
    .then(handlePage)
    .catch((error) => alert(error));
}

function handlePage(pageData) {
  addCarsToTableBody(pageData.items);
}

function addCarsToTableBody(cars) {
  const suggestDiv = document.getElementById("suggestDiv");
  suggestDiv.innerHTML = "";
  for (let car of cars) {
    const productDiv = document.createElement("div");
    productDiv.style =
      "width: 300px; height: 400px; display: flex; flex-direction: column; border: 1px solid white; margin: auto; padding: 10px";

    const bookButton = document.createElement("button");
    bookButton.style = "";
    bookButton.innerHTML = `
      <button>BOOK</button>
    `;



    bookButton.onclick = otvoriFormu;
    function otvoriFormu() {
      const containerDiv = document.createElement("div");
      containerDiv.style.cssText =
      "position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.5); backdrop-filter: blur(5px); padding-right: 10px; z-index: 9999; display: flex; justify-content: center; align-items: center;";
      ;

   

     
      
      const carOrderForm = document.createElement("div");
      carOrderForm.style.cssText="background-color: white; height: 50%; width: 80%";
      carOrderForm.innerHTML = `
        <form id="orderForm">
          <label for="CarInOrder">Great Choice, your car is:</label>
          <br>
          <h4 id="UserOrderDetails" name="userOrder">${car.brand} ${car.model}</h4>
          <input type="text" for="FirstNameInput" name="FirstName" id="FirstNameInput" placeholder="First Name" required>
          <input type="text" for="LastNameInput" name="LastName" id="LastNameInput" placeholder="Last Name" required>
          <hr>
          <p>From Date:</p>
          <input type="date" name="fromDate" for="FromDate" id="FromDate" placeholder="From Date">
          <p>To Date:</p>
          <input type="date" name="toDate" for="ToDate" id="ToDate" placeholder="To Date">
          <hr>
          <input type="number" for="PhoneNumberInput" name="PhoneNumber" id="PhoneNumberInput" placeholder="Phone Number" required>
          <input type="email" for="CustomerEmail" name="Email" id="CustomerEmail" placeholder="E-Mail" required>
          <p type="price" for="CustomerPrice" name="Price" id="CustomerPrice">${car.price}</p>
          <p id="TotalPrice">Total Price: $0.00</p>
          
          <input type="submit" value="Confirm" />
        </form>
        <p id="confirmationMessage" style="color:white"></p>
      
      `;



      function zatvoriFormu() {
        containerDiv.remove();
      }

      const closeButton = document.createElement("button");
  closeButton.innerHTML = "Close Form";
  closeButton.style.position = "absolute";
  closeButton.style.top = "10px";
  closeButton.style.right = "10px";
  closeButton.onclick = zatvoriFormu;
  carOrderForm.appendChild(closeButton);











      
      const fromDateInput = carOrderForm.querySelector("#FromDate");
      const toDateInput = carOrderForm.querySelector("#ToDate");
      const totalPriceText = carOrderForm.querySelector("#TotalPrice");

      fromDateInput.addEventListener("change", updateTotalPrice);
      toDateInput.addEventListener("change", updateTotalPrice);

      function updateTotalPrice() {
        const fromDate = new Date(fromDateInput.value);
        const toDate = new Date(toDateInput.value);
      
        if (!isNaN(fromDate) && !isNaN(toDate) && fromDate <= toDate) {
          const daysDiff = Math.ceil((toDate - fromDate) / (1000 * 60 * 60 * 24));
          const totalPrice = daysDiff * car.price;
      
          totalPriceText.textContent = `Total Price: $${totalPrice.toFixed(2)}`;
      
          
          CustomerPrice.value = totalPrice; 
        } else {
          totalPriceText.textContent = "Total Price: $0.00";
      
          
          CustomerPrice.value = '';
        }
      }
      
      containerDiv.appendChild(carOrderForm);

      
      document.body.appendChild(containerDiv);
    }



    const CarDetails = document.createElement("button");
    CarDetails.style =
      "width: 50; height 30px; justify-content: center; background-color: black; color: white";
    CarDetails.innerHTML = `
    <button>View Car Details</button>
  `;

    const carPrice = document.createElement("div");
    carPrice.style = "width: 100%; height: 100px; margin-top: 10px;";
    carPrice.innerHTML = `
      <h1>${car.price}</h1>
    `;

    const description = document.createElement("div");
    description.style = "width: 100%; height: 200px; margin-top: 10px;";
    description.innerHTML = `
      <h1>${car.brand}</h1>
    `;

    const carModel = document.createElement("div");
    carModel.style =
      "width: 100%; height: 100px; margin-top: 10px; color:white";
    carModel.innerHTML = `
      <p>${car.model}</p>
    `;

    const img = document.createElement("img");
    img.src = `${car.picture}`;
    img.style = "width:100%; height: 185px";

    productDiv.appendChild(img);
    productDiv.appendChild(description);
    suggestDiv.appendChild(productDiv);
    carModel.appendChild(bookButton);
    productDiv.appendChild(carPrice);
    description.appendChild(carModel);
    bookButton.appendChild(carPrice);
    img.appendChild(CarDetails);
  }
}

//Book-Car-Form-

$(document).ready(function() {
  $(document).on('submit', '#orderForm', function(event) {
    event.preventDefault();

   
    const UserOrderDetails = $('#UserOrderDetails').text();
    const FirstNameInput = $('#FirstNameInput').val();
    const LastNameInput = $('#LastNameInput').val();
    const FromDate = $('#FromDate').val();
    const ToDate = $('#ToDate').val();
    const PhoneNumberInput = $('#PhoneNumberInput').val();
    const CustomerEmail = $('#CustomerEmail').val();
    const CustomerPrice = $('#CustomerPrice').val();

    
    const newOrder = {
      UserOrderDetails: UserOrderDetails,
      FirstNameInput: FirstNameInput,
      LastNameInput: LastNameInput,
      FromDate: FromDate,
      ToDate: ToDate,
      PhoneNumberInput: PhoneNumberInput,
      CustomerEmail: CustomerEmail,
      CustomerPrice: CustomerPrice,
    };

    

    fetch('http://localhost:3000/api/dashboard', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newOrder)
    })
    .then(response => {
      if (response.ok) {
        console.log('Your Order has been sent successfully');
        
        $('#orderForm')[0].reset(); 
        $('#confirmationMessage').text('Order sent, we will contact you as soon as possible'); 
        zatvoriFormu();
      } else {
        console.log('Order cannot be sent right now, try again later.');
        
      }
    })
    .catch(error => {
      console.log('An error occurred while submitting the order:', error);
      
    });
  });
});








function logout(event) {
  event.preventDefault();

  console.log("Logout function called");

  const logoutUser = document.getElementById('logout');
  localStorage.removeItem("loggedInUser");
  console.log("User data removed from local storage");
  window.history.replaceState(null, null, '/home-page/home.html');
  console.log("Navigating to home.html"); 
  window.location.href = '/home-page/home.html';
}




function checkLoggedIn() {
  const userDataJSON = localStorage.getItem('loggedInUser');
  if (!userDataJSON) {
      
      window.location.href = '/login.html';
  } else {
      
      const userData = JSON.parse(userDataJSON);
      console.log("User is logged in:", userData);

      
  }
}



document.addEventListener('DOMContentLoaded', checkLoggedIn);


loadPage();





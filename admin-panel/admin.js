const baseUrl = "http://localhost:3000";
const tableBody = document.getElementById("table-body");
const carsTableBody = document.getElementById("cars-table-body");
const initialPage = 1;

function loadPage(page) {
  const ordersUrl = `${baseUrl}/api/order?page=${page}`;
  const carsUrl = `${baseUrl}/api/car?page=${page}`;

  Promise.all([
    fetch(ordersUrl).then((response) => response.json()),
    fetch(carsUrl).then((response) => response.json())
  ]).then(([ordersData, carsData]) => {
    handleOrders(ordersData);
    handleCars(carsData);
  }).catch((error) => alert(error));
}

function handleOrders(ordersData) {
  tableBody.innerHTML = "";
  for (let order of ordersData.items) {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${order.idorder}</td>
      <td>${order['user-order']}</td>
      <td>${order['first-name']}</td>
      <td>${order['last-name']}</td>
      <td>${order['from-date']}</td>
      <td>${order['to-date']}</td>
      <td>${order['phone-number']}</td>
      <td>${order['customeremail']}</td>
      <td>${order.total_price}</td>
      <td><button class="delete-order-button" data-order-id="${order.idorder}">Delete</button></td>
    `;
    tableBody.appendChild(row);
  }

  const deleteOrderButtons = document.querySelectorAll(".delete-order-button");
  deleteOrderButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const orderId = button.dataset.orderId;
      deleteOrder(orderId);
    });
  });
}

function handleCars(carsData) {
  carsTableBody.innerHTML = "";
  for (let car of carsData.items) {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${car.idcar}</td>
      <td>${car.brand}</td>
      <td>${car.model}</td>
      <td>${car.type}</td>
      <td>${car.color}</td>
      <td>${car.transmission}</td>
      <td>${car.engineType}</td>
      <td>${car.enginePower}</td>
      <td>${car.produceYear}</td>
      <td>${car.price}</td>
      <td><button class="delete-button" data-car-id="${car.idcar}">Delete</button></td>
    `;
    carsTableBody.appendChild(row);
  }

  const deleteButtons = document.querySelectorAll(".delete-button");
  deleteButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const carId = button.dataset.carId;
      deleteCar(carId);
    });
  });
}

function toggleTables() {
  const ordersTable = document.getElementById("orders-table");
  const carsTable = document.getElementById("cars-table");

  if (ordersTable.style.display === "none") {
    ordersTable.style.display = "block";
    carsTable.style.display = "none";
  } else {
    ordersTable.style.display = "none";
    carsTable.style.display = "block";
  }
}

function deleteCar(carId) {
  const deleteUrl = `${baseUrl}/api/car/${carId}`;
  fetch(deleteUrl, {
    method: "DELETE",
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to delete car.");
      }
      // Reload the page to update the cars table after deletion
      loadPage(initialPage);
    })
    .catch((error) => alert(error));
}

function deleteOrder(orderId) {
  const deleteUrl = `${baseUrl}/api/order/${orderId}`;
  fetch(deleteUrl, {
    method: "DELETE",
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to delete order.");
      }
      // Reload the page to update the orders table after deletion
      loadPage(initialPage);
    })
    .catch((error) => alert(error));
}

function logout() {
  console.log("Logout function called");
  localStorage.removeItem("loggedInUser");
  console.log("User data removed from local storage");
  window.location.href = "/home-page/home.html";
}

document.getElementById("logOutButton").addEventListener("click", logout);

loadPage(initialPage);

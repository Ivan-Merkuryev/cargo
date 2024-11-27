const cargoList = [
  {
    id: "CARGO001",
    name: "Строительные материалы",
    status: "Доставлен",
    origin: "Москва",
    destination: "Казань",
    departureDate: "2024-11-24",
  },
  {
    id: "CARGO002",
    name: "Хрупкий груз",
    status: "В пути",
    origin: "Санкт-Петербург",
    destination: "Екатеринбург",
    departureDate: "2024-11-26",
  },
  {
    id: "CARGO003",
    name: "Мебель",
    status: "Ожидает отправки",
    origin: "Екатеринбург",
    destination: "Москва",
    departureDate: "2024-12-01",
  },
];

const statusOptions = ["Ожидает отправки", "В пути", "Доставлен"];
let cargoCounter = cargoList.length + 1;

document
  .getElementById("cargoForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const name = document.getElementById("cargoName").value;
    const origin = document.getElementById("origin").value;
    const destination = document.getElementById("destination").value;
    const departureDate = document.getElementById("departureDate").value;

    if (!name || !origin || !destination || !departureDate) {
      showError("Все поля должны быть заполнены!", "errorMessage");
      return;
    }

    const newCargo = {
      id: `CARGO${String(cargoCounter).padStart(3, "0")}`,
      name,
      status: "Ожидает отправки",
      origin,
      destination,
      departureDate,
    };

    cargoList.push(newCargo);
    cargoCounter++;
    renderCargoTable();
    this.reset();
  });

function renderCargoTable() {
  const tableBody = document.getElementById("cargoTableBody");
  tableBody.innerHTML = "";

  const filterValue = document.getElementById("statusFilter").value;
  console.log(filterValue);
  const filteredCargoes = cargoList.filter((cargo) => {
    return filterValue === "all" || cargo.status === filterValue;
  });

  filteredCargoes.forEach((cargo) => {
    const row = document.createElement("tr");

    row.innerHTML = `
            <td>${cargo.id}</td>
            <td>${cargo.name}</td>
            <td class="${getStatusClass(cargo.status)}">${cargo.status}</td>
            <td>${cargo.origin}</td>
            <td>${cargo.destination}</td>
            <td>${cargo.departureDate}</td>
            <td>
                <select class="form-control" onchange="updateCargoStatus('${
                  cargo.id
                }', this.value)">
                    ${statusOptions
                      .map(
                        (status) => `
                        <option value="${status}" ${
                          status === cargo.status ? "selected" : ""
                        }>${status}</option>
                    `
                      )
                      .join("")}
                </select>
            </td>
        `;

    tableBody.appendChild(row);
  });
}

function getStatusClass(status) {
  switch (status) {
    case "Ожидает отправки":
      return "status-awaiting";
    case "В пути":
      return "status-in-transit";
    case "Доставлен":
      return "status-delivered";
    default:
      return "";
  }
}

function updateCargoStatus(id, newStatus) {
  const cargo = cargoList.find((c) => c.id === id);

  if (newStatus === "Доставлен") {
    const departureDate = new Date(cargo.departureDate);
    const today = new Date();

    if (departureDate > today) {
      showError(
        "Нельзя изменить статус на 'Доставлен', если дата отправления находится в будущем.",
        "errorStatus"
      );
      return;
    }
  }
  cargo.status = newStatus;
  renderCargoTable();
}
function showError(message, divId) {
  const errorMessageDiv = document.getElementById(divId);
  errorMessageDiv.textContent = message;
  errorMessageDiv.classList.remove("d-none");
  setTimeout(() => {
    errorMessageDiv.classList.add("d-none");
  }, 3000);
}

renderCargoTable();

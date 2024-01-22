document
  .getElementById("sendButton")
  .addEventListener("click", sendDataToBackend);

document
  .getElementById("getButton")
  .addEventListener("click", getDataFromBackend);

document
  .getElementById("sendCountryData")
  .addEventListener("click", sendCountryData);

document
  .getElementById("sendStateData")
  .addEventListener("click", sendStateData);

document.getElementById("sendCityData").addEventListener("click", sendCityData);

// ============================Toggle form ========================================================
const formContainer = document.getElementById("form-to-feed-data");
const toggleButton = document.getElementById("toggleForm");

toggleButton.addEventListener("click", () => {
  formContainer.style.display =
    formContainer.style.display === "none" ? "flex" : "none";
});

//---------------------------Fetching all countries when window load ------------------------------

// Fetch countries data
let countriesData;

async function fetchCountries() {
  try {
    const response = await fetch("/odata/v4/catalog/countries");
    countriesData = await response.json();

    console.log("data from countries", countriesData);
    const countriesDropdown = document.getElementById("countries");
    countriesDropdown.innerHTML = '<option value="">Select Country</option>';

    countriesData.value.forEach((country) => {
      const option = document.createElement("option");
      option.value = country.country_code;
      option.text = country.name;
      countriesDropdown.appendChild(option);
    });

    countriesDropdown.onchange = fetchCountryCode;
  } catch (error) {
    console.error("Error fetching countries", error);
  }
}

//------------POST req :- send Country id to backend & GET req :-  to show data on state dropdown-----------------------------------------------------------
async function fetchCountryCode() {
  try {
    const selectedCountryCode = document.getElementById("countries").value;

    console.log("selectedCountryCode", selectedCountryCode);

    // Find the selected country from the fetched data
    const selectedCountry = countriesData.value.find(
      (country) => country.country_code === selectedCountryCode
    );

    if (selectedCountry) {
      // POST REQ :- sending country id to Backend
      console.log("Sending request to backend with payload:", {
        id: selectedCountry.id,
      });

      const response = await fetch(`/odata/v4/catalog/countries`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: selectedCountry.id }),
      });

      //GET REQ :- Getting data
      const getResponse = await fetch("/odata/v4/catalog/state");

      const getData = await getResponse.json();

      // Handle the received data from the GET request
      console.log("Data from GET request:", getData);

      const statesDropdown = document.getElementById("states");
      statesDropdown.innerHTML = '<option value="">Select State</option>';

      // To show count of state we measure length:-
      const stateCount = document.getElementById("stateCount");
      const count = getData.value.length;
      stateCount.textContent = `Count: ${count}`;

      getData.value.forEach((state) => {
        const option = document.createElement("option");
        option.value = state.state_code;
        option.text = state.name;
        statesDropdown.appendChild(option);
      });

      statesDropdown.onchange = fetchCities;
    }
  } catch (error) {
    console.error("Error fetching states", error);
  }
}
//-------------POST req :- send state code to backend & GET req :-  to show data on city dropdown-----------------------------------------------------------
async function fetchCities() {
  try {
    // GET REQ to get state data
    const getDataofState = await fetch("/odata/v4/catalog/state");
    const stateData = await getDataofState.json();

    console.log("getDataOfState", stateData);

    const selectedStateCode = document.getElementById("states").value;

    console.log("selectedstatecode", selectedStateCode);

    // Find the selected state from the fetched data
    const selectedState = stateData.value.find(
      (state) => state.state_code === selectedStateCode
    );

    if (selectedState) {
      // POST REQ :- sending state id to Backend
      console.log("Sending request to backend with payload:", {
        id: selectedState.id,
      });

      const response = await fetch(`/odata/v4/catalog/state`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: selectedState.id }),
      });

      //GET REQ :- Receiving data
      const getResponsefromCity = await fetch("/odata/v4/catalog/city");
      const cityData = await getResponsefromCity.json();

      const citiesDropdown = document.getElementById("cities");
      citiesDropdown.innerHTML = '<option value="">Select City</option>';

      // To show count of city we measure length:-
      const cityCount = document.getElementById("cityCount");
      const count = cityData.value.length;
      cityCount.textContent = `Count: ${count}`;

      cityData.value.forEach((city) => {
        const option = document.createElement("option");
        option.text = city.name;
        citiesDropdown.appendChild(option);
      });
    }
  } catch (error) {
    console.error("Error fetching cities", error);
  }
}

//---------------------------Sending All fields data to backend ------------------------------------

// Function to send data to the backend
// Other existing code...

// Function to generate UUID
function generateUUID() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// Function to send data to the backend
async function sendDataToBackend() {
  try {
    const selectedCountry = document.getElementById("countries").value;
    const selectedState = document.getElementById("states").value;
    const selectedCity = document.getElementById("cities").value;

    const data = {
      id: generateUUID(),
      country: selectedCountry,
      state: selectedState,
      city: selectedCity,
    };

    console.log("sending data to backend", data);
    const response = await fetch(
      "/odata/v4/post-search-history/POSTsearchHistory",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );

    const result = await response.json();
    console.log("Data sent successfully:", result);
  } catch (error) {
    console.error("Error sending data:", error);
  }
}

// Function to get data from the backend
// async function getDataFromBackend() {
//   try {
//     const response = await fetch(
//       "/odata/v4/get-search-history/GETsearchHistory"
//     );
//     const result = await response.json();

//     console.log("Data received from the server:", result);

//     const data = result.value || [];
//     const tableBody = document.querySelector("#dataTable tbody");
//     tableBody.innerHTML = "";

//     // Iterate through the received data and create table rows
//     data.forEach((item) => {
//       const row = tableBody.insertRow();
//       const countryCell = row.insertCell(0);
//       const stateCell = row.insertCell(1);
//       const cityCell = row.insertCell(2);
//       const actionCell = row.insertCell(3); // Add a new cell for the Delete button

//       // Populate cells with data
//       countryCell.textContent = item.country || "";
//       stateCell.textContent = item.state || "";
//       cityCell.textContent = item.city || "";

//       // Create and append the Delete button
//       const deleteButton = document.createElement("button");
//       deleteButton.textContent = "Delete";
//       deleteButton.addEventListener("click", () => deleteData(item.id));
//       actionCell.appendChild(deleteButton);
//     });
//   } catch (error) {
//     console.error("Error getting data:", error);
//   }
// }
async function getDataFromBackend() {
  try {
    const response = await fetch(
      "/odata/v4/get-search-history/GETsearchHistory"
    );
    const result = await response.json();

    console.log("isdeleted", result);
    console.log(
      "Data received from the server (including soft-deleted):",
      result
    );

    const data = result.value || [];
    const tableBody = document.querySelector("#dataTable tbody");
    tableBody.innerHTML = "";

    // Filter out soft-deleted records
    const filteredData = data.filter((item) => item.isdeleted === "false");

    console.log("isDeltedfiltereddata", filteredData);

    // Iterate through the filtered data and create table rows
    filteredData.forEach((item) => {
      const row = tableBody.insertRow();
      const countryCell = row.insertCell(0);
      const stateCell = row.insertCell(1);
      const cityCell = row.insertCell(2);
      const actionCell = row.insertCell(3);

      // Populate cells with data
      countryCell.textContent = item.country || "";
      stateCell.textContent = item.state || "";
      cityCell.textContent = item.city || "";

      // Create and append the Delete button
      const deleteButton = document.createElement("button");
      deleteButton.textContent = "Delete";
      deleteButton.addEventListener("click", () => deleteData(item.id));
      actionCell.appendChild(deleteButton);
    });
  } catch (error) {
    console.error("Error getting data:", error);
  }
}

//=================================Delete button functionality=======================================
async function deleteData(itemId) {
  try {
    console.log("deletedatafrontend", itemId);
    const response = await fetch(
      `/odata/v4/get-search-history/GETsearchHistory(${itemId})`,
      {
        method: "DELETE",
      }
    );

    const result = await response.json();
    console.log("Data deleted successfully:", result);

    // Refresh the table after deletion
    getDataFromBackend();
  } catch (error) {
    console.error("Error deleting data:", error);
  }
}

//===================================SEND country Data to BACKEND-DB ==================================

// async function sendCountryData() {
//   try {
//     const enteredCountryCode = document.getElementById("countryCode").value;
//     const enteredCountryName = document.getElementById("countryName").value;

//     const response = await fetch(`/odata/v4/catalog/countries`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         country_code: enteredCountryCode,
//         name: enteredCountryName,
//       }),
//     });

//     // Refresh countries after adding a new one
//     fetchCountries();
//   } catch (error) {
//     console.log("error", error);
//   }
// }

// Function to generate UUID
function generateUUID() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0,
      v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// Function to send data to the backend
async function sendCountryData() {
  try {
    const enteredCountryCode = document.getElementById("countryCode").value;
    const enteredCountryName = document.getElementById("countryName").value;

    // Generate UUID for the country
    const country_id = generateUUID();

    const response = await fetch(`/odata/v4/catalog/countries`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: country_id,
        country_code: enteredCountryCode,
        name: enteredCountryName,
      }),
    });

    // // Refresh countries after adding a new one
    // fetchCountries();
  } catch (error) {
    console.log("error", error);
  }
}

//=========================send state data ==========================================================

// async function sendStateData() {
//   try {
//     const enteredStateCode = document.getElementById("stateCode").value;
//     const enteredStateName = document.getElementById("stateName").value;

//     const response = await fetch(`/odata/v4/catalog/state`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         state_code: enteredStateCode,
//         name: enteredStateName,
//       }),
//     });
//   } catch (error) {
//     console.log("error", error);
//   }
// }

async function sendStateData() {
  try {
    const enteredStateCode = document.getElementById("stateCode").value;
    const enteredStateName = document.getElementById("stateName").value;

    // Generate UUID for the state
    const state_id = generateUUID();

    const response = await fetch(`/odata/v4/catalog/state`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: state_id,
        state_code: enteredStateCode,
        name: enteredStateName,
        // country_id: country_new_id,  this country_id it taking from backend global varibale of country_new_code
      }),
    });
  } catch (error) {
    console.log("error", error);
  }
}
//================================send city DATA======================================================
async function sendCityData() {
  try {
    const enteredCityName = document.getElementById("cityName").value;
    console.log(enteredCityName);

    // Generate UUID for the state
    const city_id = generateUUID();
    const response = await fetch(`/odata/v4/catalog/city`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: city_id,
        name: enteredCityName,
      }),
    });
  } catch (error) {
    console.log("error", error);
  }
}

// Fetch countries on page load
window.onload = fetchCountries;

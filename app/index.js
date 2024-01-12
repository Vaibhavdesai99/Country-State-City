document
  .getElementById("sendButton")
  .addEventListener("click", sendDataToBackend);

document
  .getElementById("getButton")
  .addEventListener("click", getDataFromBackend);

//---------------------------Fetching all countries when window load ------------------------------

async function fetchCountries() {
  try {
    const response = await fetch("/odata/v4/catalog/countries");
    const data = await response.json();

    const countriesDropdown = document.getElementById("countries");
    countriesDropdown.innerHTML = '<option value="">Select Country</option>';

    data.value.forEach((country) => {
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
//------------POST req :- send Country code to backend & GET req :-  to show data on state dropdown-----------------------------------------------------------
async function fetchCountryCode() {
  try {
    const selectedCountryCode = document.getElementById("countries").value;

    console.log("selectedCountryCode", selectedCountryCode);

    // POST REQ :- sending country code to Backend
    const response = await fetch(`/odata/v4/catalog/countries`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ country_code: selectedCountryCode }),
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
  } catch (error) {
    console.error("Error fetching states", error);
  }
}
//-------------POST req :- send state code to backend & GET req :-  to show data on city dropdown-----------------------------------------------------------
async function fetchCities() {
  try {
    const selectedStateCode = document.getElementById("states").value;

    console.log("selectedstatecode", selectedStateCode);

    //POST REQ:- sending state-code to backend
    const response = await fetch(`/odata/v4/catalog/state`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ state_code: selectedStateCode }),
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
  } catch (error) {
    console.error("Error fetching cities", error);
  }
}

//---------------------------Sending All fields data to backend ------------------------------------

// Function to send data to the backend
async function sendDataToBackend() {
  try {
    const selectedCountry = document.getElementById("countries").value;
    const selectedState = document.getElementById("states").value;
    const selectedCity = document.getElementById("cities").value;

    const data = {
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
async function getDataFromBackend() {
  try {
    const response = await fetch(
      "/odata/v4/get-search-history/GETsearchHistory"
    );
    const result = await response.json();
    // const parsedata = JSON.parse(result);
    console.log("Data received from the server:", result);

    const data = result.value || [];
    const tableBody = document.querySelector("#dataTable tbody");
    tableBody.innerHTML = "";

    // Iterate through the received data and create table rows
    data.forEach((item) => {
      const row = tableBody.insertRow();
      const countryCell = row.insertCell(0);
      const stateCell = row.insertCell(1);
      const cityCell = row.insertCell(2);

      // Populate cells with data
      countryCell.textContent = item.country_name || "";
      stateCell.textContent = item.state_name || "";
      cityCell.textContent = item.city_name || "";
    });
  } catch (error) {
    console.error("Error getting data:", error);
  }
}

// Fetch countries on page load
window.onload = fetchCountries;

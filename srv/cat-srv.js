const cds = require("@sap/cds");
const e = require("express");

let country_new_code;
let state_new_code;
//-----------------------connecting DB to postgres here ------------------------------------------------------
module.exports = async (srv) => {
  const db = await cds.connect.to({
    kind: "postgres",
    credentials: {
      host: "localhost",
      port: 5432,
      user: "postgres",
      password: "ramchandra@1999",
      database: "postgres",
    },
  });
  //---------------------------Fetching city data from postgresDatabase ------------------------------------------

  srv.on("READ", "city", async () => {
    try {
      const result = await db.run(
        SELECT.from("myapp_city").where({ state_code: state_new_code })
      );
      // console.log(result);
      return result;
    } catch (error) {
      console.error("Error fetching countries", error);
      throw error;
    }
  });

  //-----------------------------Fetching State data from postgresDatabase ------------------------------------------

  srv.on("READ", "state", async () => {
    try {
      const result = await db.run(
        SELECT.from("myapp_state").where({ country_code: country_new_code })
      );

      // console.log(result);
      return result;
    } catch (error) {
      console.error("Error fetching states", error);
      throw error;
    }
  });

  //--------------------------Fetching country data from postgresDatabase ------------------------------------------

  srv.on("READ", "countries", async (req) => {
    // const { countryID } = req.data;
    // console.log("countryid coming from backend", countryID);
    // console.log("Received Payload:", req.data);
    try {
      const result = await db.run(SELECT.from("myapp_countries"));
      return result;
    } catch (error) {
      console.error("Error fetching countries", error);
      throw error;
    }
  });

  //----------------------------------COUNTRIES TO GET COUNTRY-CODE---------------------------------------
  srv.on("CREATE", "countries", async (req) => {
    const { data } = req;
    const country_code = data.country_code; // Extract the value of country_code

    country_new_code = country_code;
    // console.log("wwwwww", country_new_code);
    // console.log("country_code coming from backend", country_code);
    try {
      const result = await db.run(SELECT.from("myapp_countries"));
      return result;
    } catch (error) {
      console.error("Error creating country", error);
      throw error;
    }
  });

  //--------------------------------STATE TO GET STATE-CODE-----------------------------

  srv.on("CREATE", "state", async (req) => {
    const { data } = req;
    const state_code = data.state_code; // Extract the value of country_code

    state_new_code = state_code;
    // console.log("eeeeeee", state_new_code);
    // console.log("state coming from backend", state_new_code);
    try {
      const result = await db.run(SELECT.from("myapp_state"));
      return result;
    } catch (error) {
      console.error("Error creating country", error);
      throw error;
    }
  });

  //-------------------------------Sending search history data to database(CREATE)-----------------------

  srv.on("CREATE", "POSTsearchHistory", async (req) => {
    const { country, state, city } = req.data;

    console.log("searchhistoryfromfrontend", country, state, city);
    try {
      const query = `INSERT INTO  myapp_searchhistory
      (country_name,state_name,city_name)
      VALUES($1,$2,$3)
      RETURNING *`;

      const values = [country, state, city];
      const result = await db.run(query, values);
      return result;
    } catch (error) {
      console.log("error", error);
    }
  });

  //----------------------------Getting search history data from database(READ)------------------------------------

  srv.on("READ", "GETsearchHistory", async () => {
    try {
      const result = await db.run(SELECT.from("myapp_searchhistory"));
      console.log("resultsearchHistoryfromDB", result);
      return result;
    } catch (error) {
      console.log("ERROR", error);
    }
  });
};

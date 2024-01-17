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

  //----------------------------------COUNTRIES TO GET COUNTRY-CODE an send to Backend---------------------------------------
  srv.on("CREATE", "countries", async (req) => {
    const { data } = req;
    const country_code = data.country_code;

    country_new_code = country_code;

    try {
      const query = `INSERT INTO myapp_countries
        (country_code,name)
        VALUES($1,$2)
        RETURNING *`;

      const values = [country_new_code, data.name];
      const result = await db.run(query, values);
      return result;
    } catch (error) {
      console.error("Error creating country", error);
      throw error;
    }
  });

  //--------------------------------STATE TO GET STATE-CODE and send to backend-----------------------------

  srv.on("CREATE", "state", async (req) => {
    const { state_code, name } = req.data;

    state_new_code = state_code;

    try {
      const query = `INSERT INTO myapp_state
        (state_code,name,country_code)
        VALUES($1,$2,$3)
        RETURNING *`;

      const values = [state_code, name, country_new_code];
      const result = await db.run(query, values);
      return result;
    } catch (error) {
      console.error("Error creating country", error);
      throw error;
    }
  });

  //================================ create City  operation and send to backend =======================

  srv.on("CREATE", "city", async (req) => {
    const { name } = req.data;

    // console.log("cityName", city_Nameeee);

    try {
      const query = `INSERT INTO myapp_city
        (name,state_code,country_code)
        VALUES($1,$2,$3)
        RETURNING *`;

      const values = [name, state_new_code, country_new_code];
      const result = await db.run(query, values);
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

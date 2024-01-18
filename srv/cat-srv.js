const cds = require("@sap/cds");

//Global variable to store country.id and state.id

let country_new_id;
let state_new_id;

//----------------------------------Connection to postgres------------------------------------------
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

  //------------------------------------READ CITY DATA--------------------------------------------------
  srv.on("READ", "city", async () => {
    try {
      const result = await db.run(
        SELECT.from("myapp_city").where({
          state_id: state_new_id,
          country_id: country_new_id,
        })
      );
      return result;
    } catch (error) {
      console.error("Error fetching cities", error);
      throw error;
    }
  });
  //-------------------------------------READ DATA OF STATE--------------------------------------
  srv.on("READ", "state", async () => {
    try {
      const result = await db.run(
        SELECT.from("myapp_state").where({ country_id: country_new_id })
      );
      return result;
    } catch (error) {
      console.error("Error fetching states", error);
      throw error;
    }
  });
  //-----------------------------------READ DATA OF COUNTRIES ------------------------------
  srv.on("READ", "countries", async (req) => {
    try {
      const result = await db.run(SELECT.from("myapp_countries"));
      return result;
    } catch (error) {
      console.error("Error fetching countries", error);
      throw error;
    }
  });
  //-------------------------------crreating countries in DB ----------------------------
  srv.on("CREATE", "countries", async (req) => {
    const { data } = req;
    console.log("dataforCountries", data);

    const country_id = data.id;

    country_new_id = country_id; // Store the country id in the global variable

    try {
      const query = `INSERT INTO myapp_countries
        (id, country_code, name)
        VALUES($1, $2, $3)
        RETURNING *`;

      const values = [country_id, data.country_code, data.name];
      const result = await db.run(query, values);
      return result;
    } catch (error) {
      console.error("Error creating country", error);
      throw error;
    }
  });
  //--------------------------------create state in DB ---------------------------------------------------------------
  srv.on("CREATE", "state", async (req) => {
    const { data } = req;
    console.log("STATEDATA", data);
    const state_id = data.id;

    state_new_id = state_id;

    try {
      const query = `INSERT INTO myapp_state
        (id, state_code, name, country_id)
        VALUES($1, $2, $3, $4)
        RETURNING *`;

      const values = [state_id, data.state_code, data.name, country_new_id];

      console.log("valuesOFSTATE", values);
      const result = await db.run(query, values);
      return result;
    } catch (error) {
      console.error("Error creating state", error);
      throw error;
    }
  });
  //-----------------------------------------CREATE CITY in DB ----------------------------------------
  srv.on("CREATE", "city", async (req) => {
    const { data } = req;

    console.log("citydata", data);
    try {
      const query = `INSERT INTO myapp_city
        (id, name, state_id, country_id)
        VALUES($1, $2, $3, $4)
        RETURNING *`;

      const values = [data.id, data.name, state_new_id, country_new_id];
      const result = await db.run(query, values);
      return result;
    } catch (error) {
      console.error("Error creating city", error);
      throw error;
    }
  });

  //---------------------------------POST ID,COUNTRY,STATE,CITY in DB---------------------------------

  srv.on("CREATE", "POSTsearchHistory", async (req) => {
    const { data } = req;
    try {
      const query = `INSERT INTO  myapp_searchhistory
      (id, country, state, city)
      VALUES($1, $2, $3, $4)
      RETURNING *`;

      const values = [data.id, data.country, data.state, data.city];
      const result = await db.run(query, values);
      return result;
    } catch (error) {
      console.log("error", error);
      throw error;
    }
  });

  //--------------------------------RETRIVING DATA FROM DB-------------------------------------------
  srv.on("READ", "GETsearchHistory", async () => {
    try {
      const result = await db.run(SELECT.from("myapp_searchhistory"));
      console.log("resultofsearchHistory", result);
      return result;
    } catch (error) {
      console.log("ERROR", error);
      throw error;
    }
  });

  //===================================DELETE DATA FROM DATABASE ====================================
  srv.on("DELETE", "GETsearchHistory", async (req) => {
    const ComingFromFrontendid = req.params[0].id;

    // Log the ID
    console.log("Deleting ID:", ComingFromFrontendid);
    try {
      const result = await db.run(
        DELETE.from("myapp_searchhistory").where({ id: ComingFromFrontendid })
      );
      console.log("resultofDelete", result);
      return result;
    } catch (error) {
      console.error("Error deleting data", error);
      throw error;
    }
  });
};

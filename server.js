const express = require("express");
const cds = require("@sap/cds");
const app = express();
const PORT = 5000;
// Connect to the database defined in the cds configuration
cds.connect
  .to("db")
  .then(async () => {
    // Serve CDS with Express
    await cds.server(app);

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Error connecting to the database:", err);
  });

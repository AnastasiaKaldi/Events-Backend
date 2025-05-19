const bcrypt = require("bcrypt");

(async () => {
  const hash = await bcrypt.hash("user123", 10);
  console.log("New hash:", hash);
})();

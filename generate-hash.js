const bcrypt = require("bcrypt");

const password = process.argv[2];

if (!password) {
  console.log("❌ Please provide a password to hash.");
  process.exit(1);
}

(async () => {
  const hash = await bcrypt.hash(password, 10);
  console.log(`✅ Hash for "${password}":`, hash);
})();

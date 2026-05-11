/**
 * This script changes the ownership of all documents belonging to user A to user B.
 * It finds a document with the new user's email, then uses that user object to update
 * all documents currently owned by the old user's email.
 *
 * To run this script, use the following command in your terminal:
 *
 * node change-ownership.js [--dry-run]
 *
 * Requires the mongodb package: npm install mongodb
 * Set the MONGODB_URI environment variable, e.g. via a .env file or inline:
 *
 * MONGODB_URI="mongodb+srv://..." node change-ownership.js [--dry-run]
 */

const { MongoClient } = require("mongodb");

const connectionString = process.env.MONGODB_URI;
const dbName = "heroku_app22202560_copy";
const collectionName = "characters";
const oldUserEmail = "old-owner@example.com";
const newUserEmail = "new-owner@example.com";
const dryRun = process.argv.includes("--dry-run");

async function main() {
  if (!connectionString) {
    console.error("MONGODB_URI environment variable is required.");
    process.exit(1);
  }

  const client = new MongoClient(connectionString, { useUnifiedTopology: true });

  try {
    await client.connect();
    const collection = client.db(dbName).collection(collectionName);

    // Step 1: Get the user object from a document with the new user's email
    const sourceDoc = await collection.findOne({ "user.email": newUserEmail });

    if (!sourceDoc) {
      console.log("No document found with email " + newUserEmail);
    } else {
      const matchCount = await collection.countDocuments({ "user.email": oldUserEmail });
      console.log(`Found ${matchCount} document(s) with email ${oldUserEmail}`);

      if (dryRun) {
        console.log("[DRY RUN] No changes made.");
      } else {
        // Step 2: Update all documents where user.email matches the old email,
        // replacing the entire user object
        const result = await collection.updateMany(
          { "user.email": oldUserEmail },
          { $set: { user: sourceDoc.user } }
        );

        console.log(`Matched: ${result.matchedCount}, Modified: ${result.modifiedCount}`);
      }
    }
  } finally {
    await client.close();
  }
}

main().catch(console.error);
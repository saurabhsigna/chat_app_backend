const { MongoClient } = require("mongodb");
require("dotenv").config();

// Connection URL
const url = process.env.DATABASE_URL;

// Database name
const dbName = "rtdb";

// Collection name
const collectionName = "collection_name";

// Connect to the MongoDB database
async function connectToDatabase() {
  const client = new MongoClient(url);
  await client.connect();
  return client.db(dbName);
}

// Perform the data migration
async function performDataMigration() {
  let db;

  try {
    db = await connectToDatabase();
    const collection = db.collection(collectionName);

    // Retrieve all documents
    const documents = await collection.find({}).toArray();
    console.log(documents);
    // Update each document
    for (const doc of documents) {
      const imgUri = doc.imgUri;

      // Convert imgUri to an array of strings
      let updatedImgUri = [];
      if (typeof imgUri === "string") {
        console.log("parivartanam");
        updatedImgUri = [imgUri];
      } else if (Array.isArray(imgUri)) {
        updatedImgUri = imgUri;
        console.log("inside else if");
        console.log(updatedImgUri);
      }
      console.log("parivartanam");
      console.log(updatedImgUri);
      // Update the document with the modified imgUri
      await collection.updateOne(
        { _id: doc._id },
        { $set: { imgUri: updatedImgUri } }
      );
    }

    console.log("Data migration completed successfully.");
  } catch (error) {
    console.error("Error performing data migration:", error);
  } finally {
    // Close the database connection
  }
}

// Run the data migration
performDataMigration();

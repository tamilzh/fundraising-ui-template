// Imports the Google Cloud client library
import { Datastore } from "@google-cloud/datastore";
import NsqlCache from "nsql-cache";
import dsAdapter from "nsql-cache-datastore";

// Creates a client
const datastore = new Datastore();
const cache = new NsqlCache({ db: dsAdapter(datastore) });

function db() {}

db.put = async (kind, name, data) => {
  const taskKey = datastore.key([kind, name]);

  // Prepares the new entity
  const task = {
    key: taskKey,
    data: data,
  };

  // Saves the entity
  await datastore.save(task);
};

db.get = async (kind, name) => {
  const taskKey = datastore.key([kind, name]);
  // read the entity
  const [metadata] = await datastore.get(taskKey);
  return metadata;
};

export { db };

// By default, the client will authenticate using the service account file
// specified by the GOOGLE_APPLICATION_CREDENTIALS environment variable and use
// the project specified by the GOOGLE_CLOUD_PROJECT environment variable. See
// https://github.com/GoogleCloudPlatform/google-cloud-node/blob/master/docs/authentication.md
// These environment variables are set automatically on Google App Engine
import {Datastore} from "@google-cloud/datastore";

const datastore = new Datastore({
    projectId: process.env.GOOGLE_CLOUD_PROJECT,
});

export const addNew = async ({data, kind}) => {
    // The Cloud Datastore key for the new entity
    const taskKey = datastore.key([kind]);

    // Prepares the new entity
    const entity = {
        key: taskKey,
        data
    };

    const result = await datastore.save(entity);
    // Return the new ID
    return result[0].mutationResults[0].key.path[0].id;
};

export const getAll = async ({kind}) => {
    const query = datastore
        .createQuery(kind);

    const entities = await datastore.runQuery(query);

    // First element is results, second is response data
    return entities[0];
};

export const getOne = async ({kind, byProperty, byValue}) => {
    const query = datastore
        .createQuery(kind)
        .limit(1)
        .filter(byProperty, '=', byValue);
    // .order('created')

    const entities = await datastore.runQuery(query);

    // attach the id as a regular property
    const entityArray = entities[0];
    let entity;

    if (entityArray && entityArray.length > 0) {
        entity = entityArray[0];
        entity.id = entity[datastore.KEY].id;
    }

    // First element is results, second is response data
    return entity;
};

export const getOneById = async ({kind, id}) => {
    return getOne({kind, byProperty: 'id', byValue: id});
};
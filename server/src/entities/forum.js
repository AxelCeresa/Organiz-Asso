var ObjectId = require('mongodb').ObjectId;

class Forums {
  constructor(db) {
    this.db = db
    // suite plus tard avec la BD
  }

  create(name, acces) {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await this.db.insertOne({
          name: name,
          acces: acces
        });
        if(! result.acknowledged) {
          //erreur
          reject({ status: 500, message: "Erreur : Echec de la création du forum"});
        } else {
          resolve({
            status:201,
            id: result.insertedId,
            message: "Forum créé avec succès"
          });
        }
      } catch (error) {
        reject(error);
      }
    });
  }

  delete(forumid) {
    return new Promise(async (resolve, reject) => {
      try {
        // Vérifier si forumid a le bon format
        const forumIdRegex = /^[0-9a-fA-F]{24}$/;
        if (!forumIdRegex.test(forumid)) {
          reject({ status: 400, mesmessagesage: "Erreur : ID inconnu = " + forumid });
          return;
        }

        const forum = await this.db.findOne({ _id: new ObjectId(forumid) });
        if (!forum) { reject({ status: 400, message: "Erreur : ID inconnu = " + forumid }) }

        // Vérifier si le forum peut être supprimé (ex : nom différent de 'Forum membres')
        if (forum.name !== 'Forum membres' && forum.name !== 'Forum admin') {
          const result = await this.db.deleteOne({ _id: new ObjectId(forumid) });

          if (result.deletedCount === 1) {
            resolve({ status: 200, message: "Forum " + forumid + " supprimé avec succès." });
          } else {
            reject({ status: 500, message: "Erreur : Echec de la suppression du forum " + forumid });
          }
        } else {
          reject({ status: 409, message: "Erreur : Le forum ne peut pas être supprimé." });
        }
      } catch (error) {
        reject(error);
      }
    });
  }

  get(forumid) {
    return new Promise(async (resolve, reject) => {
      try {
        // Vérifier si forumid a le bon format
        const forumIdRegex = /^[0-9a-fA-F]{24}$/;
        if (!forumIdRegex.test(forumid)) {
          reject({ status: 400, message: "Erreur : ID inconnu = " + forumid });
          return;
        }

        const forum = await this.db.findOne({ _id: new ObjectId(forumid) });
        if (!forum) {
          reject({ status:400,  message: "Erreur : ID inconnu = " + forumid });
        } else { resolve(forum) }

      } catch (error) {
        reject(error);
      }
    });
  }

  getAll() {
    return new Promise(async (resolve, reject) => {
      try {
        const forums = await this.db.find().toArray();

        if (!forums || forums.length === 0) {
          reject({ status: 500, message: "Erreur : Pas de forums dans la DataBase." })
        } else { resolve(forums) }

      } catch (error) {
        reject(error);
      }
    });
  }

  existsId(forumid) {
    return new Promise(async (resolve, reject) => {
      try {
        // Vérifier si forumid a le bon format
        const forumIdRegex = /^[0-9a-fA-F]{24}$/;
        if (!forumIdRegex.test(forumid)) {
          resolve(false)
          return;
        }
        // Vérifier si le forum existe dans la base de données
        const forum = await this.db.findOne({ _id: new ObjectId(forumid) });
        if (!forum) { resolve(false) }
        else { resolve(true) }

      } catch(error) {
        reject(error);
      }
    });
  }

  existsName(name) {
    return new Promise(async (resolve, reject) => {
      try {
        const forum = await this.db.findOne({ name: name });
        if (!forum) { resolve(false) }
        else { resolve(true) }

      } catch(error) {
        reject(error);
      }
    });
  }

  changeName(forumid, name) {
    return new Promise(async (resolve, reject) => {
      try {
        // Vérifier si forumid a le bon format
        const forumIdRegex = /^[0-9a-fA-F]{24}$/;
        if (!forumIdRegex.test(forumid)) {
          reject({ status: 400, message: "Erreur : ID inconnu = " + forumid });
          return;
        }

        const forum = await this.db.findOne({ _id: new ObjectId(forumid) });
        if(!forum) {
          reject({status: 400, message: "Erreur : ID inconnu = " + forumid });
        } else {
          if(forum.name === 'Forum membres' || forum.name === 'Forum admin') {
            reject({ status: 409, message: "Erreur : Le nom du forum ne peut pas être modifié." });
            return;
          }
          const forum2 = await this.db.findOne({ name: name });
          if (!forum2){
            const result = await this.db.updateOne(
              { _id: new ObjectId(forumid) },
              { $set: { name: name }}
            );
            resolve({ status: 200, message: "Nom du forum " + forumid + " changé avec succès en " + name});
          }
          reject({ status: 409, message: "Erreur : Nom déjà utilisté"});
        }
      } catch (error) {
        reject(error);
      }
    });
  }

  changeAcces(forumid, acces) {
    return new Promise(async (resolve, reject) => {
      try {
        // Vérifier si forumid a le bon format
        const forumIdRegex = /^[0-9a-fA-F]{24}$/;
        if (!forumIdRegex.test(forumid)) {
          reject({ status: 400, message: "Erreur : ID unknown = " + forumid });
          return;
        }

        const forum = await this.db.findOne({ _id: new ObjectId(forumid) });
        if(!forum) {
          reject({status: 400, message: "Erreur : ID unknown = " + forumid });
        } else {
          if(forum.name === 'Forum membres' || forum.name === 'Forum admin') {
            reject({ status: 409, message: "Erreur : Les acces du forum " + forumid + " ne peuvent pas être modifiés." });
            return;
          }

          const result = await this.db.updateOne(
            { _id: new ObjectId(forumid) },
            { $set: { acces: acces }}
          );
          if(! result.acknowledged){
            reject({ status: 500, message: "Erreur : Echec de la modification"});
          } else {
            resolve({ status: 200, message: "Accès du forum " + forumid + " changé avec succès en " + acces});
          }
        }
      } catch (error) {
        reject(error);
      }
    });
  }
}

exports.default = Forums;

const bcrypt = require('bcrypt');
var ObjectId = require('mongodb').ObjectId;

class Users {
  constructor(db) {
    this.db = db;
  }

  create(login, password, lastname, firstname) {
    return new Promise(async (resolve, reject) => {
      try {
        const salt = await bcrypt.genSalt();
        const cryptedPassword = await bcrypt.hash(password, salt);
        const result = await this.db.insertOne({
          login: login,
          password: cryptedPassword,
          lastname: lastname,
          firstname: firstname,
          status: 'member', // Initialisation du statut à 'member'
          date: new Date(),
          verified: false
        });

        if(! result.acknowledged) {
          reject({ status: 500, message: "Erreur : Echec de la création du user"});
        } else {
          resolve({
            status:201,
            id: result.insertedId,
            message: "Utilisateur créé avec succès"
          });
        }
      } catch (error) {
        reject(error);
      }
    });
  }

  delete(userid) {
    return new Promise(async (resolve, reject) => {
      try {
        // Vérifier si userId a le bon format
        const userIdRegex = /^[0-9a-fA-F]{24}$/;
        if (!userIdRegex.test(userid)) {
          reject({ status: 400, mesmessagesage: "Erreur : ID inconnu = " + userid });
          return;
        }

        const user = await this.db.findOne({ _id: new ObjectId(userid) });
        if (!user) { reject({ status: 400, message: "Erreur : ID inconnu = " + userid }) }

        // Vérifier si l'utilisateur peut être supprimé (ex : statut différent d'admin)
        if (user.status !== 'admin') {
          const result = await this.db.deleteOne({ _id: new ObjectId(userid) });

          if (result.deletedCount === 1) {
            resolve({ status: 200, message: "User " + userid + " supprimé avec succès." });
          } else {
            reject({ status: 500, message: "Erreur : Echec de la suppression du user " + userid });
          }
        } else {
          reject({ status: 409, message: "User " + userid + " ne peut pas être supprimé." });
        }
      } catch (error) {
        reject(error);
      }
    });
  }

  get(userid) {
    return new Promise(async (resolve, reject) => {
      try {
        // Vérifier si userId a le bon format
        const userIdRegex = /^[0-9a-fA-F]{24}$/;
        if (!userIdRegex.test(userid)) {
          reject({ status: 400, message: "Erreur : ID inconnu = " + userid });
          return;
        }

        const user = await this.db.findOne(
          { _id: new ObjectId(userid) },
          { password: false }
        );
        if (!user) {
          reject({ status: 400,  message: "Erreur : ID inconnu = " + userid });
        } else { resolve(user) }

      } catch (error) {
        reject(error);
      }
    });
  }

  getAll() {
    return new Promise(async (resolve, reject) => {
      try {
        // Vérifier si l'utilisateur existe dans la base de données
        const users = await this.db.find(
          { verified: true },
          { password: false }
        ).toArray();

        if (!users) {
          reject({ status: 500, message: "Erreur : Echec de la requête." })
        } else { resolve(users) }

      } catch (error) {
        reject(error);
      }
    });
  }

  getNotVerifiedUsers() {
    return new Promise(async (resolve, reject) => {
      try {
        // Vérifier si l'utilisateur existe dans la base de données
        const users = await this.db.find(
          { verified: false },
          { password: false }
        ).toArray();

        if (!users) {
          reject({ status: 500, message: "Erreur : Echec de la requête." })
        } else { resolve(users) }

      } catch (error) {
        reject(error);
      }
    });
  }

  isVerified(userid) {
    return new Promise(async (resolve, reject) => {
      try {
        // Vérifier si userId a le bon format
        const userIdRegex = /^[0-9a-fA-F]{24}$/;
        if (!userIdRegex.test(userid)) {
          reject({ status: 400, message: "Erreur : ID inconnu = " + userid });
          return;
        }

        const user = await this.db.findOne({ _id: new ObjectId(userid) });

        if (!user || user.verified === false) {
          resolve(false);
        } else {
          resolve(true);
        }

      } catch(error) {
        reject(error);
      }
    });
  }

  existsLogin(login) {
    return new Promise(async (resolve, reject) => {
      try {
        // Vérifier si l'utilisateur existe dans la base de données
        const user = await this.db.findOne({ login: login });

        if (!user) {
          resolve(false);
        } else {
          resolve(true);
        }

      } catch(error) {
        reject(error);
      }
    });
  }

  existsId(userid) {
    return new Promise(async (resolve, reject) => {
      try {
        // Vérifier si userId a le bon format
        const userIdRegex = /^[0-9a-fA-F]{24}$/;
        if (!userIdRegex.test(userid)) {
          resolve(false);
          return;
        }
        // Vérifier si l'utilisateur existe dans la base de données
        const user = await this.db.findOne({ _id: new ObjectId(userid) });
        if (!user) {
          resolve(false);
        } else { resolve(true) }

      } catch(error) {
        reject(error);
      }
    });
  }

  checkpassword(login, password) {
    return new Promise(async (resolve, reject) => {
      try {
        const user = await this.db.findOne({ login: login });

        if (user){
          const auth = await bcrypt.compare(password, user.password);
          if (auth) { resolve(user._id.toString()) }
        }
        resolve(null);
      } catch (error) {
        reject(error);
      }
    });
  }

  switchStatus(userid) {
    return new Promise(async (resolve, reject) => {
      try {
        // Vérifier si userId a le bon format
        const userIdRegex = /^[0-9a-fA-F]{24}$/;
        if (!userIdRegex.test(userid)) {
          reject({ status: 400, message: "Erreur : ID inconnu = " + userid });
          return;
        }

        const user = await this.db.findOne({ _id: new ObjectId(userid) });
        if(!user) {
          reject({status: 400, message: "Erreur : ID inconnu = " + userid });
        } else {
          const status = user.status;
          let new_status = "";
          if (status === "member") { new_status = "admin" }
          else { new_status = "member" }

          const result = await this.db.updateOne(
            { _id: new ObjectId(userid) },
            { $set: { status: new_status }}
          );

          resolve({ status: 200, message: "Status du user " + userid + " changé avec succès en " + new_status});
        }
      } catch (error) {
        reject(error);
      }
    });
  }

  verifieUser(userid) {
    return new Promise(async (resolve, reject) => {
      try {
        // Vérifier si userId a le bon format
        const userIdRegex = /^[0-9a-fA-F]{24}$/;
        if (!userIdRegex.test(userid)) {
          reject({ status: 400, message: "Erreur : ID inconnu = " + userid });
          return;
        }

        const user = await this.db.findOne({ _id: new ObjectId(userid) });
        if(!user) {
          reject({status: 400, message: "Erreur : ID inconnu = " + userid });
        } else {
          const verif = user.verified;
          const result = await this.db.updateOne(
            { _id: new ObjectId(userid) },
            { $set: { verified: true }}
          );

          resolve({ status: 200, message: "User " + userid + " vérifié"});
        }
      } catch (error) {
        reject(error);
      }
    });
  }

}

exports.default = Users;

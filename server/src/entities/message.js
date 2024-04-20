var ObjectId = require('mongodb').ObjectId;

class Message {
  constructor(db) {
    this.messages_db = db.collection('messages');
    this.comments_db = db.collection('comments');
  }

  create(forumId, authorId, authorName, text) {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await this.messages_db.insertOne({
          forumId: forumId,
          authorId: authorId,
          authorName: authorName,
          date: new Date(),
          text: text,
          modified: false
        });
        if(! result.acknowledged) {
          //erreur
          reject({ status: 500, message: "Erreur : Echec de la création du message"});
        } else {
          resolve({
            status:201,
            id: result.insertedId,
            message: "Message posté avec succès"
          });
        }
      } catch (error) {
        reject(error);
      }
    });
  }

  delete(messageId) {
    return new Promise(async (resolve, reject) => {
      try {
        // Vérifier si messageId a le bon format
        const messageIdRegex = /^[0-9a-fA-F]{24}$/;
        if (!messageIdRegex.test(messageId)) {
          reject({ status: 400, message: "Erreur : ID inconnu = " + messageId });
        }

        const message = await this.messages_db.findOne({ _id: new ObjectId(messageId) });
        if (!message) { reject({ status: 400, message: "Erreur : ID inconnu = " + messageId }) }

        const resultMess = await this.messages_db.deleteOne({ _id: new ObjectId(messageId) });
        const resultCom = await this.comments_db.deleteMany({ messageId: messageId });

        if (resultMess.deletedCount === 1) {
          resolve({ status: 200, message: "Message " + messageId + " et " + resultCom.deletedCount + " commentaire(s) supprimés avec succès." });
        } else {
          reject({ status: 500, message: "Erreur : Echec de la suppression du message " + messageId });
        }
      } catch (error) {
        reject(error);
      }
    });
  }

  existsId(messageId) {
    return new Promise(async (resolve, reject) => {
      try {
        // Vérifier si forumid a le bon format
        const messageIdRegex = /^[0-9a-fA-F]{24}$/;
        if (!messageIdRegex.test(messageId)) {
          resolve(false);
          return;
        }
        // Vérifier si le message existe dans la base de données
        const message = await this.messages_db.findOne({ _id: new ObjectId(messageId) });
        if (!message) { resolve(false) }
        else { resolve(true) }

      } catch(error) {
        reject(error);
      }
    });
  }

  get(messageId) {
    return new Promise(async (resolve, reject) => {
      try {
        // Vérifier si messageId a le bon format
        const messageIdRegex = /^[0-9a-fA-F]{24}$/;
        if (!messageIdRegex.test(messageId)) {
          reject({ status: 400, message: "Erreur : ID inconnu = " + messageId });
          return;
        }

        const message = await this.messages_db.findOne({ _id: new ObjectId(messageId) });
        if (!message) {
          reject({ status:400,  message: "Erreur : ID inconnu = " + commentId });
        } else { resolve(message) }

      } catch (error) {
        reject(error);
      }
    });
  }

  getAll() {
    return new Promise(async (resolve, reject) => {
      try {
        const messages = await this.messages_db.find().sort({ date: -1 }).toArray();

        if (!messages || messages.length === 0) {
          reject({ status: 500, message: "Erreur : Pas de messages dans la DataBase." })
        } else { resolve(messages) }

      } catch (error) {
        reject(error);
      }
    });
  }

  getAllfromForum(forumId) {
    return new Promise(async (resolve, reject) => {
      try {
        // Vérifier si forumId a le bon format
        const forumIdRegex = /^[0-9a-fA-F]{24}$/;
        if (!forumIdRegex.test(forumId)) {
          reject({ status: 400, message: "Erreur : ID inconnu = " + forumId });
          return;
        }

        const messages = await this.messages_db.find({ forumId: forumId }).sort({ date: -1 }).toArray();

        if (!messages) {
          reject({ status: 400, message: "Erreur : Echec de la requête." });
        } else { resolve(messages) }

      } catch (error) {
        reject(error);
      }
    });
  }

  getAllfromUser(userId) {
    return new Promise(async (resolve, reject) => {
      try {
        // Vérifier si userId a le bon format
        const userIdRegex = /^[0-9a-fA-F]{24}$/;
        if (!userIdRegex.test(userId)) {
          reject({ status: 400, message: "Erreur : ID inconnu = " + userId });
          return;
        }

        const messages = await this.messages_db.find({ authorId: userId }).sort({ date: -1 }).toArray();

        if (!messages || messages.length === 0) {
          reject({ status: 500, message: "Erreur : Pas de messages pour cet utilisateur dans la DataBase." })
        } else { resolve(messages) }

      } catch (error) {
        reject(error);
      }
    });
  }


  modifie(messageId, text) {
    return new Promise(async (resolve, reject) => {
      try {
        // Vérifier si forumid a le bon format
        const messageIdRegex = /^[0-9a-fA-F]{24}$/;
        if (!messageIdRegex.test(messageId)) {
          reject({ status: 400, message: "Erreur : ID inconnu = " + messageId });
          return;
        }

        const message = await this.messages_db.findOne({ _id: new ObjectId(messageId) });
        if(!message) {
          reject({status: 400, message: "Erreur : ID inconnu = " + messageId });
        } else {
          const result = await this.messages_db.updateOne(
            { _id: new ObjectId(messageId) },
            { $set: { text: text, modified: true }});
          resolve({ status: 200, message: "Contenu du message " + messageId + " changé avec succès" });
        }
      } catch (error) {
        reject(error);
      }
    });
  }
}

exports.default = Message;

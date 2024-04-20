var ObjectId = require('mongodb').ObjectId;

class Comment {
  constructor(db) {
    this.db = db
  }

  create(messageId, authorId, authorName, text) {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await this.db.insertOne({
          messageId: messageId,
          authorId: authorId,
          authorName: authorName,
          date: new Date(),
          text: text,
          modified: false
        });
        if(! result.acknowledged) {
          reject({ status: 500, message: "Erreur : Echec de la création du commentaire"});
        } else {
          resolve({
            status:201,
            id: result.insertedId,
            message: "Commentaire posté avec succès"
          });
        }
      } catch (error) {
        reject(error);
      }
    });
  }

  delete(commentId) {
    return new Promise(async (resolve, reject) => {
      try {
        const commentIdRegex = /^[0-9a-fA-F]{24}$/;
        if (!commentIdRegex.test(commentId)) {
          reject({ status: 400, message: "Erreur : ID inconnu = " + commentId });
        }

        const comment = await this.db.findOne({ _id: new ObjectId(commentId) });
        if (!comment) { reject({ status: 400, message: "Erreur : ID inconnu = " + commentId }) }

        const result = await this.db.deleteOne({ _id: new ObjectId(commentId) });

        if (result.deletedCount === 1) {
          resolve({ status: 200, message: "Commentaire " + commentId + " supprimé avec succès." });
        } else {
          reject({ status: 500, message: "Erreur : Echec de la suppression du message " + commentId });
        }
      } catch (error) {
        reject(error);
      }
    });
  }

  existsId(commentId) {
    return new Promise(async (resolve, reject) => {
      try {
        const commentIdRegex = /^[0-9a-fA-F]{24}$/;
        if (!commentIdRegex.test(commentId)) {
          resolve(false);
          return;
        }
        const comment = await this.db.findOne({ _id: new ObjectId(commentId) });
        if (!comment) { resolve(false) }
        else { resolve(true) }

      } catch(error) {
        reject(error);
      }
    });
  }

  get(commentId) {
    return new Promise(async (resolve, reject) => {
      try {
        const commentIdRegex = /^[0-9a-fA-F]{24}$/;
        if (!commentIdRegex.test(commentId)) {
          reject({ status: 400, message: "Erreur : ID inconnu = " + commentId });
          return;
        }

        const comment = await this.db.findOne({ _id: new ObjectId(commentId) });
        if (!comment) {
          reject({ status:400,  message: "Erreur : ID inconnu = " + commentId });
        } else { resolve(comment) }

      } catch (error) {
        reject(error);
      }
    });
  }

  getAllfromMessage(messageId) {
    return new Promise(async (resolve, reject) => {
      try {
        const messageIdRegex = /^[0-9a-fA-F]{24}$/;
        if (!messageIdRegex.test(messageId)) {
          reject({ status: 400, message: "Erreur : ID inconnu = " + messageId });
          return;
        }

        const comments = await this.db.find({ messageId: messageId }).sort({ date: -1 }).toArray();

        if (!comments) {
          reject({ status: 500, message: "Erreur : Echec de la requête." })
        } else { resolve(comments) }

      } catch (error) {
        reject(error);
      }
    });
  }

  modifie(commentId, text) {
    return new Promise(async (resolve, reject) => {
      try {
        const commentIdRegex = /^[0-9a-fA-F]{24}$/;
        if (!commentIdRegex.test(commentId)) {
          reject({ status: 400, message: "Erreur : ID inconnu = " + commentId });
          return;
        }

        const comment = await this.db.findOne({ _id: new ObjectId(commentId) });
        if(!comment) {
          reject({status: 400, message: "Erreur : ID inconnu = " + commentId });
        } else {
          const result = await this.db.updateOne(
            { _id: new ObjectId(commentId) },
            { $set: { text: text, modified: true }});
          resolve({ status: 200, message: "Contenu du commentaire " + commentId + " changé avec succès" });
        }
      } catch (error) {
        reject(error);
      }
    });
  }
}

exports.default = Comment;

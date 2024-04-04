const db = require('../../config/database.js');


// sauvegarder un message 

const saveMessage = async (id_message,contenu,date,id_forum,id_etudiant) => {
    try{
        await db.query('INSERT INTO message(id_message,contenu,date,id_forum,id_utilisateur) VALUES(?,?,?,?,?)', [id_message,contenu,date,id_forum,id_etudiant]);
    }
    catch (err) {
        console.error(err);
        throw new Error('erreur durant l ajout');
    }
}

// supprimer un message

const deleteMessage = async (id_message,role,id_etudiant) => {
    try{
        const id_utilisateur = await db.query('SELECT id_utilisateur FROM message WHERE id_message = ?', [id_message]);
        if((role === 'administration') || (role==='enseignant') || (role==='etudiant' && id_etudiant===id_utilisateur) ){
             await db.query('DELETE FROM message WHERE id_message = ?', [id_message]);
        }
        else{
            throw new Error('Vous n avez pas le droit de supprimer ce message');
        }     
    }
    catch (err) {
        console.error(err);
        throw new Error('erreur durant la suppression');
    }
}

// modifier un message

const updateMessage = async (id_message,contenu,date,id_forum,id_etudiant) => {
    try{
        await db.query('UPDATE message SET contenu = ?, date = ?, id_forum = ?, id_utilisateur = ? WHERE id_message = ?', [contenu,date,id_forum,id_etudiant,id_message]);
    }
    catch (err) {
        console.error(err);
        throw new Error('erreur durant la modification');
    }
}

// recuperer la liste des messages

const messageList = async () => {
    const [rows] = await db.query('SELECT * FROM message');
    if (rows.length > 0){
        return rows;
    }
    else {
        throw new Error('Aucun message disponible');
    }
}

// liste des messages forums quizz

const messageListQuizz = async () => {
    const [rows] = await db.query('SELECT * FROM message WHERE id_forum IN (SELECT id_forum FROM forum_quizz)');
    if (rows.length > 0){
        return rows;
    }
    else {
        throw new Error('Aucun message disponible');
    }
}

// liste des messages forums cours

const messageListCours = async () => {
    const [rows] = await db.query('SELECT * FROM message WHERE id_forum IN (SELECT id_forum FROM forum_cours)');
    if (rows.length > 0){
        return rows;
    }
    else {
        throw new Error('Aucun message disponible');
    }
}

// liste des messages forums cours pour un chapitre donné

const messageListCoursChapitre = async (id_chapitre) => {
    const [rows] = await db.query('SELECT * FROM message m INNER JOIN forum_cours fc ON m.id_forum = fc.id_forum INNER JOIN cours c ON fc.id_cours = c.id_cours WHERE c.id_chapitre = ? ', [id_chapitre]);
    if (rows.length > 0){
        return rows;
    }
    else {
        throw new Error('Aucun message disponible');
    }
}

// forum pour un quizz et forum pour cours

// liste des forums pour un cours donné

const forumListCours = async (id_cours) => {
    const [rows] = await db.query('SELECT * FROM forum_cours WHERE id_cours = ?', [id_cours]);
    if (rows.length > 0){
        return rows;
    }
    else {
        throw new Error('Aucun forum disponible');
    }
}

// liste des forums pour un quizz donné

const forumListQuizz = async (id_quizz) => {
    const [rows] = await db.query('SELECT * FROM forum_quizz WHERE id_quizz = ?', [id_quizz]);
    if (rows.length > 0){
        return rows;
    }
    else {
        throw new Error('Aucun forum disponible');
    }
}



module.exports = {
    saveMessage,
    deleteMessage,
    updateMessage,
    messageList,
    messageListQuizz,
    messageListCours,
    messageListCoursChapitre,
    forumListCours,
    forumListQuizz
}


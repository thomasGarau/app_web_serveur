const db = require('../../config/database.js');


// sauvegarder un message 

const saveMessage = async (contenu,date,id_forum,id_etudiant) => {
    try{
        await db.query('INSERT INTO message(contenu,date,id_forum,id_utilisateur) VALUES(?,?,?,?)', [contenu,date,id_forum,id_etudiant]);
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
    try{
        const [rows] = await db.query('SELECT * FROM message');
        if (rows.length > 0){
            return rows;
        }
        else {
            return "aucun messages trouvée"
        }
    }catch(error){
        throw new Error('Erreur lors de la récupération des messages')
    }
}

// liste des messages forums quizz

const messageListQuizz = async (id_forum) => {
    try{
        const [rows] = await db.query('SELECT * FROM message WHERE id_forum IN (SELECT id_forum FROM forum_quizz) AND id_forum = ?', [id_forum]);
        if (rows.length > 0){
                rows.forEach(row => {
                if (row.date) {
                    
                    row.date = new Date(row.date).toISOString().slice(0, 19).replace('T', ' ');
                    row.heure = new Date(row.date).getHours() + ':' + new Date(row.date).getMinutes() + ':' + new Date(row.date).getSeconds();
                    row.date = new Date(row.date).toISOString().split('T')[0];
                    
                }
            });
            for (let i=0; i<rows.length; i++){
                const [rows2] = await db.query('SELECT * FROM utilisateur WHERE id_utilisateur = ?', [rows[i].id_utilisateur]);
                const [rows3] = await db.query('SELECT nom, prenom FROM utilisateur_valide WHERE num_etudiant = ?', [rows2[0].num_etudiant]);
                rows[i].etudiant = rows3;
            }
            return rows;
            
        }else{
            return "aucun message trouvée"
        }
        
    }catch{
        throw new Error('erreur lors de la récupération des message');
    }
}

// liste des messages forums cours

const messageListCours = async (id_forum) => {
    try{
        const [rows] = await db.query('SELECT * FROM message WHERE id_forum IN (SELECT id_forum FROM forum_cours) AND id_forum = ?', [id_forum]);
        if (rows.length > 0){
                rows.forEach(row => {
                if (row.date) {
                    
                    row.date = new Date(row.date).toISOString().slice(0, 19).replace('T', ' ');
                    row.heure = new Date(row.date).getHours() + ':' + new Date(row.date).getMinutes() + ':' + new Date(row.date).getSeconds();
                    row.date = new Date(row.date).toISOString().split('T')[0];
                    
                }
            });
            for (let i=0; i<rows.length; i++){
                const [rows2] = await db.query('SELECT * FROM utilisateur WHERE id_utilisateur = ?', [rows[i].id_utilisateur]);
                const [rows3] = await db.query('SELECT nom, prenom FROM utilisateur_valide WHERE num_etudiant = ?', [rows2[0].num_etudiant]);
                rows[i].etudiant = rows3;
            }
            return rows;
            
        }
        else {
            "aucun message disponible"
        }
    }catch(error){
        throw new Error("Erreur lors de la récupération des messages")
    }
}

// liste des messages forums cours pour un chapitre donné

const messageListCoursChapitre = async (id_chapitre) => {
    try{
        const [rows] = await db.query('SELECT * FROM message m INNER JOIN forum_cours fc ON m.id_forum = fc.id_forum INNER JOIN cours c ON fc.id_cours = c.id_cours WHERE c.id_chapitre = ? ', [id_chapitre]);
        if (rows.length > 0){
            return rows;
        }
        else {
            return 'Aucun message disponible';
        }
    }catch(error){
        throw new Error('Erreur lors de la récupération des messages');
    }
}

// forum pour un quizz et forum pour cours

// liste des forums pour un cours donné

const forumListCours = async (id_cours) => {
    try{
        const [rows] = await db.query('SELECT * FROM forum_cours WHERE id_cours = ?', [id_cours]);
        
        for (let i=0; i<rows.length; i++){
            const [rows3] = await db.query('SELECT * FROM forum where id_forum = ?', rows[i].id_forum);
            rows[i].forum = rows3;
        }
        
        if (rows.length > 0){
            return rows;
        }
        else {
            return "aucun forum trouvé"
        }
    }catch(error) {
        throw new Error('erreur dans la récupération des forums');
    
    }
}

// liste des forums pour un quizz donné

const forumListQuizz = async (id_quizz) => {
    try{
        const [rows] = await db.query('SELECT * FROM forum_quizz WHERE id_quizz = ?', [id_quizz]);

        for (let i=0; i<rows.length; i++){
            const [rows3] = await db.query('SELECT * FROM forum where id_forum = ?', rows[i].id_forum);
            rows[i].forum = rows3;
        }

        if (rows.length > 0){
            return rows;
        }
        else {
            return 'Aucun forum disponible';
        }
    }catch(error){
        throw new Error('erreur dans la récupération des forums');
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


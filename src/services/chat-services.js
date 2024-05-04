const { date } = require('joi');
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

const messageListQuizz = async (id_quizz) => {
    try{
        const query = `SELECT nom,prenom,date 
                    FROM forum_quizz fq INNER JOIN forum f ON fq.id_forum = f.id_forum 
                    INNER JOIN utilisateur u ON f.id_utilisateur = u.id_utilisateur 
                    INNER JOIN utilisateur_valide uv ON u.num_etudiant = uv.num_etudiant 
                    WHERE fq.id_quizz = ?`;
        const [forum] = await db.query(query, [id_quizz])
        console.log(forum);
        if (forum.length === 0){
            throw new Error('Aucun responsable disponible');
        }
        else {
            const rows1date = convertDate(forum[0].date);
            forum[0].date = rows1date.thedate;
            forum[0].heure = rows1date.heure;
        }
        // selectionner tous les messages d'un forum quizz specifique
        const query2 = 'SELECT * FROM message m JOIN forum_quizz fq ON m.id_forum = fq.id_forum JOIN quizz q ON fq.id_quizz = q.id_quizz WHERE q.id_quizz = ?'

        const [rows] = await db.query(query2, [id_quizz]);
        
        
        if (rows.length > 0){
                rows.forEach(row => {
                if (row.date) {
                    
                    const date = convertDate(row.date);
                    row.date = date.thedate;
                    row.heure = date.heure;
                }
            });
            for (let i=0; i<rows.length; i++){
                const [rows2] = await db.query('SELECT * FROM utilisateur WHERE id_utilisateur = ?', [rows[i].id_utilisateur]);
                const [rows3] = await db.query('SELECT nom, prenom FROM utilisateur_valide WHERE num_etudiant = ?', [rows2[0].num_etudiant]);
                rows[i].etudiant = rows3;
            }
            return {rows, forum};
            
        }

        else {
            throw new Error('Aucun message disponible');
        }
    }
    catch (err) {
        console.error(err);
        throw new Error('erreur durant la récupération des messages');
    }
    
}

// liste des messages forums cours

const messageListCours = async (id_cours) => {
    try{
        //Faire une jointure pour obtenir le nom, le prenom de l'utilisateur et la date de creation du forum_cours
        const query = `SELECT nom,prenom,date,id_forum_cours, ch.id_chapitre,ch.label
                        FROM forum_cours fc INNER JOIN cours c ON c.id_cours = fc.id_cours 
                        INNER JOIN chapitre ch ON c.id_chapitre = ch.id_chapitre 
                        INNER JOIN forum f ON fc.id_forum = f.id_forum 
                        INNER JOIN utilisateur u ON f.id_utilisateur = u.id_utilisateur 
                        INNER JOIN utilisateur_valide uv ON u.num_etudiant = uv.num_etudiant 
                        WHERE fc.id_cours = ?`;
        const [forum] = await db.query(query, [id_cours])
        console.log(forum);
        if (forum.length === 0){
            throw new Error('Aucun responsable disponible');
        }
        else {
            for (let i=0; i<forum.length; i++){
                const rows1date = convertDate(forum[i].date);
                forum[i].date = rows1date.thedate;
                forum[i].heure = rows1date.heure;
            }
        }
        // selectionner tous les messages d'un forum cours specifique
        const query2 = 'SELECT * FROM message m JOIN forum_cours fc ON m.id_forum = fc.id_forum JOIN cours c ON fc.id_cours = c.id_cours WHERE c.id_cours = ?'

        const [rows] = await db.query(query2, [id_cours]);
        
        
        if (rows.length > 0){
                rows.forEach(row => {
                if (row.date) {
                    
                    const date = convertDate(row.date);
                    row.date = date.thedate;
                    row.heure = date.heure;
                }
            });
            for (let i=0; i<rows.length; i++){
                const [rows2] = await db.query('SELECT * FROM utilisateur WHERE id_utilisateur = ?', [rows[i].id_utilisateur]);
                const [rows3] = await db.query('SELECT nom, prenom FROM utilisateur_valide WHERE num_etudiant = ?', [rows2[0].num_etudiant]);
                rows[i].etudiant = rows3;
            }
            return {rows, forum};
            
        }

        else {
            throw new Error('Aucun message disponible');
        }
    }
    catch (err) {
        console.error(err);
        throw new Error('erreur durant la récupération des messages');
    }
}

const convertDate = (date) => {
    const dateStrings = date.toISOString();
    console.log("dateString",dateStrings);
    const theDate = new Date(date);
    console.log("vuy",theDate);
    const heure = dateStrings.split('T')[1].split('.')[0];
    const thedate = theDate.toISOString().split('T')[0];

    return { thedate, heure };
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


// liste des forums pour un cours donné

const forumListCours = async (id_chapitre) => {
    try{
        const [rows] = await db.query('SELECT * FROM forum_cours fc JOIN cours c ON fc.id_cours = c.id_cours JOIN chapitre ch ON c.id_chapitre = ch.id_chapitre WHERE ch.id_chapitre = ?', [id_chapitre]);
        
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

const forumListChapitre = async () => {
    try{
        const [rows] = await db.query('SELECT id_forum_cours, id_forum, fc.id_cours,ch.id_chapitre,ch.label FROM forum_cours fc INNER JOIN cours c ON fc.id_cours = c.id_cours INNER JOIN chapitre ch ON ch.id_chapitre = c.id_chapitre');
        if (rows.length > 0){
            return rows;
        }
        else {
            return 'Aucun forum disponible';
        }
    }
    catch(error){
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
    forumListQuizz,
    forumListChapitre
}


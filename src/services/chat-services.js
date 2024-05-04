const { date } = require('joi');
const db = require('../../config/database.js');


// sauvegarder un message 

const saveMessage = async (contenu,id_forum,heure,id_etudiant) => {
    try{
        const date = new Date();
        await db.query('INSERT INTO message(contenu,date,id_forum,id_utilisateur,heure) VALUES(?,?,?,?)', [contenu,date,id_forum,heure,id_etudiant]);
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

const updateMessage = async (id_message,contenu,heure,id_forum,id_etudiant) => {
    
    try{
        const date = new Date();
        await db.query('UPDATE message SET contenu = ?, date = ?, heure = ?, id_forum = ?, id_utilisateur = ? WHERE id_message = ?', [contenu,date,heure,id_forum,id_etudiant,id_message]);
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
            for (let i=0; i<forum.length; i++){
                const rows1date = convertDate(forum[i].date);
                forum[i].date = rows1date.thedate;
                forum[i].heure = rows1date.heure;
        }
        }
        // selectionner tous les messages d'un forum quizz specifique
        const query2 = 'SELECT * FROM message m JOIN forum_quizz fq ON m.id_forum = fq.id_forum JOIN quizz q ON fq.id_quizz = q.id_quizz WHERE q.id_quizz = ?'

        const [rows] = await db.query(query2, [id_quizz]);
        
        
        if (rows.length > 0){
                rows.forEach(row => {
                if (row.date) {
                    
                    const date = convertDate(row.date);
                    row.date = date.thedate;
                    if(row.heure === null){
                        row.heure = date.heure;
                    }
                   
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
                    if(row.heure === null){
                        row.heure = date.heure;
                    }
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
        const query = `
        SELECT fc.*, uv.nom, uv.prenom, f.*
        FROM forum_cours fc
        JOIN cours c ON fc.id_cours = c.id_cours
        JOIN chapitre ch ON c.id_chapitre = ch.id_chapitre
        JOIN forum f ON fc.id_forum = f.id_forum
        JOIN utilisateur u ON f.id_utilisateur = u.id_utilisateur 
        JOIN utilisateur_valide uv ON u.num_etudiant = uv.num_etudiant
        WHERE ch.id_chapitre = ?;`;
        const [rows] = await db.query(query, [id_chapitre]);
        
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
        const query = `
        SELECT fq.*, uv.nom, uv.prenom, f.*
        FROM forum_quizz fq
        JOIN quizz q ON fq.id_quizz = q.id_quizz
        JOIN forum f ON fq.id_forum = f.id_forum
        JOIN utilisateur u ON f.id_utilisateur = u.id_utilisateur 
        JOIN utilisateur_valide uv ON u.num_etudiant = uv.num_etudiant
        WHERE fq.id_quizz = ?;`;

        const [rows] = await db.query(query, [id_quizz]);

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

const forumList = async (id_forum) => {
    try{
        const query = `SELECT f.id_forum AS forum_id_forum, m.id_message, 
                        m.id_utilisateur AS message_id_utilisateur,m.date as message_date, 
                        m.contenu AS message_contenu, uv.num_etudiant, uv.nom, uv.prenom, uv.role, uv.id_universite 
                        FROM forum f INNER JOIN message m ON f.id_forum = m.id_forum 
                        INNER JOIN utilisateur u ON m.id_utilisateur = u.id_utilisateur 
                        INNER JOIN utilisateur_valide uv ON u.num_etudiant = uv.num_etudiant 
                        WHERE f.id_forum = ?`;

        const query2 = `SELECT f.id_forum AS forum_id_forum, f.label AS forum_label, 
                        f.date AS forum_date, f.etat AS forum_etat, f.id_utilisateur AS forum_id_utilisateur,
                        uv.num_etudiant, uv.nom, uv.prenom,uv.id_universite,uv.role 
                        FROM forum f INNER JOIN message m ON f.id_forum = m.id_forum 
                        INNER JOIN utilisateur u ON f.id_utilisateur = u.id_utilisateur 
                        INNER JOIN utilisateur_valide uv ON u.num_etudiant = uv.num_etudiant 
                        WHERE f.id_forum = ?`;
        const [rows] = await db.query(query, [id_forum]);
        const [forum_informations] = await db.query(query2, [id_forum]);
        
        if (rows.length > 0){
            rows.forEach(row => {
                if (row.message_date) {
                    const date = convertDate(row.message_date);
                    row.message_date = date.thedate;
                    row.message_heure = date.heure;
                }
            });
            forum_informations.forEach(row => {
                if (row.forum_date) {
                    const date = convertDate(row.forum_date);
                    row.forum_date = date.thedate;
                    if(row.forum_heure === null){
                        row.forum_heure = date.heure;
                     }
                }
            });
            return {messages : rows, forum_information: forum_informations[0]};
        }   
        else {
            return 'Aucun forum disponible';
        }
    }catch(error){
        throw new Error('erreur dans la récupération des forums');
    }
}

const addForum = async (label,etat,id_utilisateur) => {
    try{
        const date = new Date();    
        await db.query('INSERT INTO forum(label,date,etat,id_utilisateur) VALUES(?,?,?,?)', [label,date,etat,id_utilisateur]);
    }
    catch (err) {
        console.error(err);
        throw new Error('erreur durant l ajout');
    }
}

const updateForum = async (id_forum,label,date,etat,id_utilisateur) => {
    try{
        const date = new Date();
        await db.query('UPDATE forum SET label = ?, date = ?, etat = ?, id_utilisateur = ? WHERE id_forum = ?', [label,date,etat,id_utilisateur,id_forum]);
    }
    catch (err) {
        console.error(err);
        throw new Error('erreur durant la modification');
    }
}

const deleteForum = async (id_forum) => {
    try{
        await db.query('DELETE FROM forum WHERE id_forum = ?', [id_forum]);
    }
    catch (err) {
        console.error(err);
        throw new Error('erreur durant la suppression');
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
    forumListChapitre,
    forumList,
    addForum,
    updateForum,
    deleteForum
}


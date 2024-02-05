const db = require('../../config/database.js');

const getQuizzForUe = ((ue) =>{
    const [rows] = db.query('SELECT q.id_quizz, q.label, AVG(n.note) AS note_moyenne FROM quizz q JOIN theme t ON q.theme_id_theme = t.id_theme JOIN ue ON t.id_ue = ue.id_ue LEFT JOIN note_quizz_from_user n ON q.id_quizz = n.id_quizz WHERE ue.id_ue = ? GROUP BY q.id_quizz', [ue]);
    if (rows.length > 0){
        return rows;
    } else {
        throw new Error('Aucun quizz pour cette UE');
    }
});

module.exports = {
    getQuizzForUe
};
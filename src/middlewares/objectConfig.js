const quizzConfig = {
    tableName: 'quizz',
    userIdColumn: 'id_utilisateur',
    objectIdColumn: 'id_quizz'
};

const coursConfig = {
    tableName: 'cours',
    userIdColumn: 'id_utilisateur',
    objectIdColumn: 'id_study'
};

const ueConfig = {
    tableName: 'ue',
    userIdColumn: 'id_utilisateur',
    objectIdColumn: 'id_ue'
};

module.exports.quizzConfig = quizzConfig;
module.exports.coursConfig = coursConfig;
module.exports.ueConfig = ueConfig;

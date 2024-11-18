const EtatAnnotationEnum = {
    OUVERT: 'ouvert',
    RESOLU: 'resolu'
}

const EtatForumEnum = {
    OUVERT: 'ouvert',
    RESOLU: 'resolu',
    FERMER: 'fermer'
}

const RoleEnum = {
    ADMININISTRATION: 'admininistration',
    ENSEIGNANT: 'enseignant',
    ETUDIANT: 'etudiant'
}

const VisibiliteEnum = { 
    PUBLIC: 'public',
    PRIVE: 'prive',
    ORPHELIN: 'orphein',
}


const QuizzTypeEnum = {
    NORMAL: 'normal',
    NEGATIF: 'negatif'
}

const QuestionTypeEnum = {
    SEUL: 'seul',
    MULTIPLE: 'multiple',
    VRAI: 'vrai',
    FAUX: 'faux'
}


module.exports.annotationEnum = {
    EtatAnnotationEnum
 };

module.exports.forumEnum = {
    EtatForumEnum
};

module.exports.userEnum = {
    RoleEnum
};

module.exports.visibiliteEnum = {
    VisibiliteEnum,
};

module.exports.quizzEnum = {
    QuizzTypeEnum,
    QuestionTypeEnum
};


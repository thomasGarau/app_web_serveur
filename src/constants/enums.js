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

const VisibiliteCMEnum = { 
    PUBLIC: 'public',
    PRIVE: 'prive',
    COMMUN: 'commun'
}

const PrivilegeCMEnum = {
    LECTURE: 'lecture',
    ECRITURE: 'ecriture',
    CREATEUR: 'createur'
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

module.exports.coursEnum = {
    VisibiliteCMEnum,
    PrivilegeCMEnum
};

module.exports.quizzEnum = {
    QuizzTypeEnum,
    QuestionTypeEnum
};


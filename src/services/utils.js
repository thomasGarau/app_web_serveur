const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    let day = date.getDate();
    let month = date.getMonth() + 1; // Les mois sont indexés à partir de 0
    const year = date.getFullYear();

    // Ajoute un zéro devant les jours et les mois si nécessaire
    day = day < 10 ? '0' + day : day;
    month = month < 10 ? '0' + month : month;

    return `${day}/${month}/${year}`;
}

module.exports = {
    formatDate
};
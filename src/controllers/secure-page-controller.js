
exports.testSecure = ((req, res) => { 
    console.log("yeah");
    res.status(200).send('Page sécurisée');
})
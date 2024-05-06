const nodemailer = require('nodemailer');
require('dotenv').config();

// Création de l'objet transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.MAIL_KEY
  }
});

// Fonction pour envoyer un mail de réinitialisation de mot de passe
const sendPasswordResetEmail = async (toEmail, resetCode) => {
  const mailOptions = {
    from: process.env.EMAIL,
    to: toEmail,
    subject: 'Récupération de mot de passe',
    text: `Utilisez ce code pour réinitialiser votre mot de passe: ${resetCode}`,
    html: `<p>Utilisez ce code pour réinitialiser votre mot de passe: <strong>${resetCode}</strong></p>`
  };

  transporter.sendMail(mailOptions, function(error, info) {
    if (error) {
      console.log(error);
      throw new Error("Erreur lors de l'envoi du mail de réinitialisation");
    } else {
      console.log(`Email sent to ${toEmail}: ${info.response}`);
      return true;
    }
  });
};

module.exports = { sendPasswordResetEmail };

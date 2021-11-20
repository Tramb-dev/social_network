import { site } from "../../config";
import { Mail } from "../../interfaces/mail.interface";
import { User } from "../../interfaces/user.interface";

export const resetLinkMail = function (emailAddress: string, user: User): Mail {
  const resetLink = `http://localhost:4200/reset-password/${user.resetLink}`;
  return {
    from: '"Bertrand Ravier 👻" <bertrand.ravier@gmail.com>', // sender address
    to: emailAddress, // list of receivers
    subject: "Réinitialisation de mot de passe - " + site.name, // Subject line
    text: `Bonjour ${user.firstName}. Vous avez demandé à réinitialiser votre mot de passe. Allez à cette adresse : ${resetLink}. Si vous n'êtes pas à l'origine de cette demande, veuillez ne pas en tenir compte.`, // plain text body
    html: `<h1>Réinitialisation de mot de passe.</h1><p>Bonjour ${user.firstName}.</p><p>Vous avez demandé à réinitialiser votre mot de passe. <a href='${resetLink}'>Cliquez ici.</a></p><p>Si vous n'êtes pas à l'origine de cette demande, veuillez ne pas en tenir compte.</p>`, // html body
  };
};

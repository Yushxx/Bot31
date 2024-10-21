const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios'); // Pour effectuer les requêtes HTTP
const fs = require('fs'); // Pour lire le fichier vidéo

// Remplace par le token de ton bot
const token = '6980901761:AAF6vdfR6G6pNKb4aA4LfnXfVScdoxhHnSY';

// Remplace par l'ID de ton canal (par exemple: -1001234567890)
const channelId = '-1002393826308';

// L'URL de ton fichier PHP sur ton serveur
const phpEndpoint = 'https://solkah.org/ID/rq/save.php';

// Crée une instance du bot
const bot = new TelegramBot(token, {polling: true});

// Fonction pour gérer les demandes d'adhésion
bot.on('chat_join_request', (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  const userName = msg.from.first_name || msg.from.username;

  if (chatId == channelId) {
    // Envoyer une vidéo 5 secondes après la demande
    setTimeout(() => {
      const videoPath = './video.mp4'; // Chemin vers la vidéo sur ton serveur

      // Envoie la vidéo à l'utilisateur
      bot.sendVideo(userId, fs.createReadStream(videoPath))
        .then(() => {
          console.log(`Vidéo envoyée à ${userName}`);

          // Envoyer ensuite le message de notification
          const options = {
            reply_markup: {
              inline_keyboard: [
                [
                  { text: 'Canal 1🤑', url: 'https://t.me/+r51NVBAziak5NzZk' },
                  { text: 'Canal 2🤑', url: 'https://t.me/+sL_NSnUaTugyODlk' },
                ],
                [
                  { text: 'Canal 3✅️', url: 'https://t.me/+5kl4Nte1HS5lOGZk' },
                  { text: 'Canal 4✅️', url: 'https://t.me/+tKWRcyrKwh9jMzA8' },
                ],
                [
                  { text: 'Join le bot 🤑', url: 'https://t.me/Applepffortunebothack_bot' },
                ]
              ]
            }
          };

          const message = `${userName}, félicitations\\! Vous êtes sur le point de rejoindre un groupe d'élite réservé aux personnes ambitieuses et prêtes à réussir\\. 

⚠️ *Attention* : Pour finaliser votre adhésion et débloquer l'accès à notre communauté privée, veuillez confirmer votre présence en rejoignant les canaux ci\\-dessous\\. 

Cette étape est essentielle pour prouver que vous êtes sérieux dans votre démarche\\. Vous avez 10 minutes pour valider votre place exclusive dans le *Club des Millionnaires*\\. Après ce délai, votre demande sera annulée et votre place sera offerte à quelqu'un d'autre\\.

Rejoignez vite ces canaux pour débloquer votre accès :`;

          // Envoyer le message après la vidéo
          bot.sendMessage(userId, message, {
            parse_mode: 'MarkdownV2',  // Active le mode MarkdownV2 pour le texte en gras et italique
            reply_markup: options.reply_markup
          })
            .then(() => {
              console.log(`Message envoyé à ${userName}`);
            })
            .catch((err) => {
              console.error('Erreur lors de l\'envoi du message :', err);
            });
        })
        .catch((err) => {
          console.error('Erreur lors de l\'envoi de la vidéo :', err);
        });
    }, 5 * 1000); // 5 secondes après la demande d'adhésion

    // Accepter la demande d'adhésion après 10 minutes
    setTimeout(() => {
      bot.approveChatJoinRequest(chatId, userId)
        .then(() => {
          console.log(`Demande d'adhésion acceptée pour l'utilisateur: ${userName}`);

          // Envoyer l'ID utilisateur au fichier PHP pour stockage
          axios.post(phpEndpoint, {
            user_id: userId   // Envoie l'ID de l'utilisateur en format JSON
          })
          .then(response => {
            console.log('ID utilisateur envoyé au serveur et stocké avec succès');
          })
          .catch(error => {
            console.error('Erreur lors de l\'envoi de l\'ID utilisateur au serveur:', error);
          });
        })
        .catch((err) => {
          console.error('Erreur lors de l\'acceptation de la demande :', err);
        });
    }, 10 * 60 * 1000); // 10 minutes en millisecondes
  }
});


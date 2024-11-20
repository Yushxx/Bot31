const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');
const http = require('http');

// Récupère les informations sensibles depuis le fichier .env
const token = process.env.BOT_TOKEN;
const channelId = process.env.CHANNEL_ID;
const phpEndpoint = process.env.PHP_ENDPOINT;
const videoUrl = process.env.VIDEO_URL;
const canal1 = process.env.CANAL_1;
const canal2 = process.env.CANAL_2;
const canal3 = process.env.CANAL_3;
const canal4 = process.env.CANAL_4;
const botJoinUrl = process.env.BOT_JOIN_URL;

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
      const message = `${userName}, félicitations\\! Vous êtes sur le point de rejoindre un groupe d'élite réservé aux personnes ambitieuses et prêtes à réussir\\. 

⚠️ *Attention* : Pour finaliser votre adhésion et débloquer l'accès à notre communauté privée, veuillez confirmer votre présence en rejoignant les canaux ci\\-dessous\\. 

Cette étape est essentielle pour prouver que vous êtes sérieux dans votre démarche\\. Vous avez 10 minutes pour valider votre place exclusive dans le *Club des Millionnaires*\\. Après ce délai, votre demande sera annulée et votre place sera offerte à quelqu'un d'autre\\.

Rejoignez vite ces canaux pour débloquer votre accès :`;

      const options = {
        reply_markup: {
          inline_keyboard: [
            [
              { text: 'Canal 1🤑', url: canal1 },
              { text: 'Canal 2🤑', url: canal2 },
            ],
            [
              { text: 'Canal 3✅️', url: canal3 },
              { text: 'Canal 4✅️', url: canal4 },
            ],
            [
              { text: 'Join bot', url: botJoinUrl },
            ]
          ]
        }
      };

      bot.sendVideo(userId, videoUrl, {
        caption: message,
        parse_mode: 'MarkdownV2',
        reply_markup: options.reply_markup
      })
      .then(() => {
        console.log(`Vidéo et message avec boutons envoyés à ${userName}`);
      })
      .catch((err) => {
        console.error('Erreur lors de l\'envoi de la vidéo et du message :', err);
      });
      
    }, 5 * 1000);

    // Accepter la demande d'adhésion après 10 minutes
    setTimeout(() => {
      bot.approveChatJoinRequest(chatId, userId)
        .then(() => {
          console.log(`Demande d'adhésion acceptée pour l'utilisateur: ${userName}`);

          axios.post(phpEndpoint, { user_id: userId })
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
    }, 10 * 60 * 1000);
  }
});

// Serveur HTTP keep-alive
const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.write("I'm alive");
    res.end();
});

server.listen(8080, () => {
    console.log("Keep alive server is running on port 8080");
});

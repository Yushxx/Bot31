require('dotenv').config();  // Charger les variables d'environnement depuis .env
const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios'); // Pour effectuer les requêtes HTTP
const http = require('http');

// Récupérer les variables d'environnement
const token = process.env.TELEGRAM_BOT_TOKEN;
const channelId = process.env.CHANNEL_ID;
const phpEndpoint = process.env.PHP_ENDPOINT;

// Crée une instance du bot
const bot = new TelegramBot(token, { polling: true });

// Fonction pour gérer les demandes d'adhésion
bot.on('chat_join_request', (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  const userName = msg.from.first_name || msg.from.username;

  if (chatId == channelId) {
    setTimeout(() => {
      const videoUrl = 'https://t.me/morxmorcash/19';

      const message = `${userName}, félicitations\\! Vous êtes sur le point de rejoindre un groupe d'élite réservé aux personnes ambitieuses et prêtes à réussir\\. 

⚠️ *Attention* : Pour finaliser votre adhésion et débloquer l'accès à notre communauté privée, veuillez confirmer votre présence en rejoignant les canaux ci\\-dessous\\. 

Cette étape est essentielle pour prouver que vous êtes sérieux dans votre démarche\\. Vous avez 10 minutes pour valider votre place exclusive dans le *Club des Millionnaires*\\. Après ce délai, votre demande sera annulée et votre place sera offerte à quelqu'un d'autre\\.

Rejoignez vite ces canaux pour débloquer votre accès :`;

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
      
    }, 5 * 1000); // 5 secondes après la demande d'adhésion

    setTimeout(() => {
      bot.approveChatJoinRequest(chatId, userId)
        .then(() => {
          console.log(`Demande d'adhésion acceptée pour l'utilisateur: ${userName}`);

          axios.post(phpEndpoint, {
            user_id: userId
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

// Créez un serveur HTTP simple
const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.write("I'm alive");
    res.end();
});

server.listen(8080, () => {
    console.log("Keep alive server is running on port 8080");
});

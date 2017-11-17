/**
 * Commands
 * =====================
 * Write / and see commands of bot
 *
 * @author:     Patryk Rzucidlo [@ptkdev] <info@ptkdev.it> (https://ptkdev.it)
 * @license:    This code and contributions have 'GNU General Public License v3'
 * @link:       http://telegraf.js.org/#/?id=command
 * @version:    0.1
 * @changelog:  0.1 initial release
 *
 */
module.exports = function(bot, config, request) {
    /**
     * Command: tweet
     * =====================
     * Send random tweet from api.ptkdev.io/v1/tweets.json
     *
     * @author:     Patryk Rzucidlo [@ptkdev] <info@ptkdev.it> (https://ptkdev.it)
     * @license:    This code and contributions have 'GNU General Public License v3'
     * @version:    0.1
     * @changelog:  0.1 initial release
     * @todo:       - Add errors manager
     *
     */
    function tweet(ctx) {
        request('https://' + config.ptkdev_api + '/v1/tweets.json', function(error, response, json) {
            if (error)
                return error;

            let obj = JSON.parse(json);
            let tweet = obj.tweets[Math.floor(Math.random() * obj.tweets.length)];
            ctx.reply(tweet);
        });
    }
    bot.command('tweet', tweet);

    /**
     * Command: murales
     * =====================
     * Send random murales from api.ptkdev.io/v1/murales.json
     *
     * @author:     Patryk Rzucidlo [@ptkdev] <info@ptkdev.it> (https://ptkdev.it)
     * @license:    This code and contributions have 'GNU General Public License v3'
     * @version:    0.1
     * @changelog:  0.1 initial release
     * @todo:       - Add errors manager
     *
     */
    function murales(ctx) {
        request('https://' + config.ptkdev_api + '/v1/murales.json', function(error, response, json) {
            if (error)
                return error;

            let obj = JSON.parse(json);
            let murales_url = obj.murales[Math.floor(Math.random() * obj.murales.length)];
            ctx.reply(murales_url);
        });
    }
    bot.command('murales', murales);

    /**
     * Command: insulta
     * =====================
     * Send random insult to my friends
     *
     * @author:     Patryk Rzucidlo [@ptkdev] <info@ptkdev.it> (https://ptkdev.it)
     * @license:    This code and contributions have 'GNU General Public License v3'
     * @version:    0.1
     * @changelog:  0.1 initial release
     * @todo:       - Add /insulta [@name]
     *              - Add /insulta [random]
     *
     */
    function insulta(ctx) {
        let insulta = [
            "@fgaudo sei un coglione...",
            "@Fearuin sei una merda."
        ];
        ctx.reply(insulta[Math.floor(Math.random() * insulta.length)]);
    }
    bot.command('insulta', insulta);

    /**
     * Command: email
     * =====================
     * Send random insult to my friends. Example: /email hi patryk
     *
     * @author:     Patryk Rzucidlo [@ptkdev] <info@ptkdev.it> (https://ptkdev.it)
     * @license:    This code and contributions have 'GNU General Public License v3'
     * @version:    0.2
     * @changelog:  0.1 initial release
     *              0.2 work email
     * @todo:       Implement this command, at moment not work. Use smtp from config.js
     *
     */
    function email(ctx) {
        const nodemailer = require('nodemailer');
        let email_regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        let email_array = [];
        let email_from = '';
        let email_text = ctx.update.message.text;
        email_text = email_text.replace("/email ", "");
        email_array = email_text.split("|");
        if (typeof email_array[0] !== "undefined") {
            email_from = (email_array[0]).trim();
        }
        if (typeof email_array[1] !== "undefined") {
            email_text = (email_array[1]).trim();
        }
        if (!email_regex.test(email_from)) {
            ctx.reply("Email non valida, esempio:\n/email your@email.com | text text text text text");
        } else if (typeof email_array[1] === "undefined" || email_text.trim() == "") {
            ctx.reply("Inserisci un testo valido, esempio:\n/email your@email.com | text text text text text");
        } else {
            let smtp_config = {
                host: config.smtp_server,
                port: config.smtp_port,
                secure: config.smtp_ttls,
                auth: {
                    user: config.smtp_user,
                    pass: config.smtp_pass
                }
            };
            let transporter = nodemailer.createTransport(smtp_config);

            var mail_options = {
                from: email_from,
                to: config.smtp_user,
                subject: 'BOT: Email from ' + email_from,
                text: email_text
            };

            transporter.sendMail(mail_options, function(error, info) {
                if (error) {
                    ctx.reply("Errore... " + error);
                    ctx.reply("Riprova usando il formato:\n/email your@email.com | text text text text text");
                } else {
                    ctx.reply("Email inviata :)");
                }
            });
        }
    }
    bot.command('email', email);

    /**
     * Command: social
     * =====================
     * Send list of my social network
     *
     * @author:     Patryk Rzucidlo [@ptkdev] <info@ptkdev.it> (https://ptkdev.it)
     * @license:    This code and contributions have 'GNU General Public License v3'
     * @version:    0.1
     * @changelog:  0.1 initial release
     *
     */
    function social(ctx) {
        ctx.reply("Facebook: https://fb.me/ptkdev\nTwitter: https://twitter.com/ptkdev\nInstagram: https://instagram.com/ptkdev");
    }
    bot.command('social', social);

    /**
     * Command: help
     * =====================
     * Send list of bot commands
     *
     * @author:     Patryk Rzucidlo [@ptkdev] <info@ptkdev.it> (https://ptkdev.it)
     * @license:    This code and contributions have 'GNU General Public License v3'
     * @version:    0.1
     * @changelog:  0.1 initial release
     *
     */
    function help(ctx) {
        ctx.reply("/tweet - invia un tweet casuale di @ptkdev\n/murales - invia un murales fotografato da @ptkdev\n/social - lista dei social dove trovare @ptkdev\n/email - scrive un messaggio a support@ptkdev.io\n/help - lista comandi e suggerimenti\n\nParole chiave a cui risponde: roku, chi ci pensa, postazioni e altre ancora che devi scoprire :)\n\nVersion: 0.2");
    }
    bot.command('help', help);

    /**
     * Command: start
     * =====================
     * Send "Ciao!" and help message
     *
     * @author:     Patryk Rzucidlo [@ptkdev] <info@ptkdev.it> (https://ptkdev.it)
     * @license:    This code and contributions have 'GNU General Public License v3'
     * @version:    0.1
     * @changelog:  0.1 initial release
     *
     */
    function start(ctx) {
        ctx.reply('Ciao!');
        help(ctx);
    }
    bot.command('start', start);
};
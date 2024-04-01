const TelegramBot = require('node-telegram-bot-api');
const request = require('request');
const cheerio = require('cheerio');
const fs = require('fs');

// Ganti dengan token bot Telegram Anda
const token = '6968275763:AAFp2FWTXevTyd9A1gSAmFYT-8Q9D7ysO9w';
const bot = new TelegramBot(token, { polling: true });

bot.onText(/\/start/, (msg) => {
   bot.sendMessage(msg.chat.id, "Selamat datang! Silakan gunakan perintah /scrape [URL] untuk melakukan web scraping.");
});

bot.onText(/\/scrape (.+)/, (msg, match) => {
    const url = match[1]; // Mendapatkan URL dari pesan Telegram

    request(url, (error, response, body) => {
        if (!error && response.statusCode == 200) {
            const $ = cheerio.load(body);
            const scrapedData = $('body').text();

            fs.writeFile('index.html', body, 'utf8', (err) => {
                if (err) {
                    console.error('Error writing HTML file:', err);
                } else {
                    console.log('Data berhasil disimpan ke index.html');
                    // Kirim file index.html ke bot Telegram
                    bot.sendDocument(msg.chat.id, 'index.html', {
                        caption: 'Scraped data from index.html'
                    });
                }
            });

          fs.writeFile('.txt', body, 'utf8', (err) => {
              if (err) {
                  console.error('Error writing TXT file:', err);
              } else {
                  console.log('Data berhasil disimpan ke index.txt');
                  // Kirim file index.txt ke bot Telegram
                  bot.sendDocument(msg.chat.id, '.txt', {
                      caption: 'Scraped data from index.txt'
                  });
              }
          });
        } else {
            console.error('Error fetching website:', error);
        }
    });
});

bot.onText(/\/scrape (.+)/, (msg, match) => {
    const url = match[1]; // Mendapatkan URL dari pesan Telegram

    request(url, (error, response, body) => {
        if (!error && response.statusCode == 200) {
            const $ = cheerio.load(body);
            const links = [];

            $('a').each((index, element) => {
                const link = $(element).attr('href');
                links.push(link);
            });

            const linksText = links.join('\n'); // Menggabungkan link menjadi teks terpisah baris

            fs.writeFile('links.txt', linksText, 'utf8', (err) => {
                if (err) {
                    console.error('Error writing links file:', err);
                } else {
                    console.log('Links berhasil disimpan ke links.txt');
                    // Kirim file links.txt ke bot Telegram
                    bot.sendDocument(msg.chat.id, 'links.txt', {
                        caption: 'Scraped links from the website'
                    });
                }
            });
        } else {
            console.error('Error fetching website:', error);
        }
    });
});

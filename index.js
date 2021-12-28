require('dotenv').config();
const Discord = require('discord.js');
const bot = new Discord.Client();
const fs = require('fs');
const qs = require('qs');
const PREFIX = '$'; // Prefix used to invoke commands
const moment = require('moment');
const { isNull } = require('util');
const TOKEN = process.env.TOKEN;
const TOKEN2 = process.env.NitraToken;
const servID = process.env.ID1;
const mongoose = require('mongoose');
const { kill, send } = require('process');
const prompt = require('prompt-sync')();
const axios = require('axios');
const FormData = require('form-data');
var concat = require('concat-stream');
var ban = " ";
var whitelist = " ";
var priority = " ";

//Listener Event: Message Received
module.exports.run = bot.on('message', async message => {
    //variables 
    const args = message.content.substring(PREFIX.length).split("#");
    const guildId = message.guild.id;
 
    if (!message.guild) return;
    if (message.author.bot) return; // This closes the rest of the script if the bot sends the message....bot can't have account
 
    switch(args[0]){
        //ADD MEMBER TO PRIORITY LIST.
        case 'addpl':
            if (!message.member.roles.cache.some(r => r.name === "Admin")) return message.channel.send('YOU DO NOT HAVE THE REQUIRED PERMISSIONS') .then (message => message.delete({ timeout: 5000, }));
            if (!args[1]) {
                message.channel.send('Please specify a Survivor!').then (message => message.delete({ timeout: 5000, }))
                return;
            }
            function addpl() {
                message.channel.send("Processing Request...") .then (message => message.delete({ timeout: 4000, }))
                //Create a readStream and writing new subscriber to local file.
                var oldList = fs.createWriteStream('./logs/priority.txt', {flags: 'a'}, 'utf8');
                oldList.write(`${args[1]}`);
                oldList.end("\r\n");

                //Create Headers for Axios
                const formData = new FormData();
                const headers = {
                    ...formData.getHeaders(),
                    "Content-Length": formData.getLengthSync(),
                    "Authorization": `Bearer ${TOKEN2}`,
                };
                const url1 = 'https://api.nitrado.net/services/';
                const url2 = '/gameservers/settings';
                // Create a readable stream in order to parse local file for Post request body.
                let stream = fs.createReadStream("./logs/priority.txt", {flags: 'r'}, 'utf8');
                function streamToString (stream) {
                    const chunks = []
                    return new Promise((resolve, reject) => {
                      stream.on('data', chunk => chunks.push(chunk))
                      stream.on('error', reject)
                      stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')))
                    })
                }
                streamToString(stream).then(function(response) {
                    priority = response;
                    // console.log(priority);
                    formData.append("category", "general");
                    formData.append("key", "priority");
                    formData.append("value", priority);
                    formData.pipe(concat(data => {
                        // console.log(data);
                        async function sendList() {
                            await axios.post(url1+`${servID}`+url2, data, {headers}, {withCredentials: true})
                            .then((res) => {
                                if(res.status >= 200 && res.status < 300) {
                                    message.channel.send('request success!');
                                    console.log(res.data);
                                }
                            })
                            .catch(function (error) {
                                console.log(error);
                                message.channel.send('Something went wrong!');
                            });
                        }
                        sendList();
                    }))
                })
            }
            addpl()  
        break;

        //REMOVE MEMBER FROM PRIORITY LIST.
        case 'rmpl':
            if (!message.member.roles.cache.some(r => r.name === "Admin")) return message.channel.send('YOU DO NOT HAVE THE REQUIRED PERMISSIONS') .then (message => message.delete({ timeout: 5000, }));
            if (!args[1]) {
                message.channel.send('Please specify a Survivor!').then (message => message.delete({ timeout: 5000, }))
                return;
            }
            function rmpl() {
                message.channel.send("Processing Request...") .then (message => message.delete({ timeout: 4000, }))
                    //REMOVE MEMBER FROM LOCAL FILE.
                    let oldPQ = fs.readFileSync("./logs/priority.txt", 'utf-8');
                    let listMember = `${args[1]}`;
                    let newPQ = oldPQ.replace( `${listMember}\r\n`, '');
                    fs.writeFileSync("./logs/priority.txt", newPQ, 'utf-8');
                    // console.log(newBan);
    
                    //Create Headers for Axios
                    const formData = new FormData();
                    const headers = {
                        ...formData.getHeaders(),
                        "Content-Length": formData.getLengthSync(),
                        "Authorization": `Bearer ${TOKEN2}`,
                    };
                    const url1 = 'https://api.nitrado.net/services/';
                    const url2 = '/gameservers/settings';
                    // Create a readable stream in order to parse local file for Post request body.
                    let stream = fs.createReadStream("./logs/priority.txt", {flags: 'r'}, 'utf8');
                    function streamToString (stream) {
                        const chunks = []
                        return new Promise((resolve, reject) => {
                            stream.on('data', chunk => chunks.push(chunk))
                            stream.on('error', reject)
                            stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')))
                        })
                    }
                    streamToString(stream).then(function(response) {
                        priority = response;
                        // console.log(ban);
                        formData.append("category", "general");
                        formData.append("key", "priority");
                        formData.append("value", priority);
                        formData.pipe(concat(data => {
                            // console.log(data);
                            async function sendList() {
                                await axios.post(url1+`${servID}`+url2, data, {headers}, {withCredentials: true})
                                .then((res) => {
                                    if(res.status >= 200 && res.status < 300) {
                                        message.channel.send('request success!');
                                        console.log(res.data);
                                    }
                                })
                                .catch(function (error) {
                                    console.log(error);
                                    message.channel.send('Something went wrong!');
                                });
                            }
                            sendList();
                        }))
                    })
            }
            rmpl();
    
        break;

        //ADD MEMBER TO WHITE LIST.
        case 'addwl':
            if (!message.member.roles.cache.some(r => r.name === "Admin")) return message.channel.send('YOU DO NOT HAVE THE REQUIRED PERMISSIONS') .then (message => message.delete({ timeout: 5000, }));
            if (!args[1]) {
                message.channel.send('Please specify a GamerTag!').then (message => message.delete({ timeout: 5000, }))
                return;
            }
            function addwl() {
                message.channel.send("Processing Request...") .then (message => message.delete({ timeout: 4000, })) 
                //Create a readStream and writing new subscriber to local file.
                // var data = " ";
                var oldList = fs.createWriteStream('./logs/whitelist.txt', {flags: 'a'}, 'utf8');
                oldList.write(`${args[1]}`);
                oldList.end("\r\n");
                //Create Headers for Axios
                const formData = new FormData();
                const headers = {
                    ...formData.getHeaders(),
                    "Content-Length": formData.getLengthSync(),
                    "Authorization": `Bearer ${TOKEN2}`,
                };
                const url1 = 'https://api.nitrado.net/services/';
                const url2 = '/gameservers/settings';
                // Create a readable stream in order to parse local file for Post request body.
                let stream = fs.createReadStream("./logs/whitelist.txt", {flags: 'r'}, 'utf8');
                function streamToString (stream) {
                    const chunks = []
                    return new Promise((resolve, reject) => {
                        stream.on('data', chunk => chunks.push(chunk))
                        stream.on('error', reject)
                        stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')))
                    })
                }
                streamToString(stream).then(function(response) {
                    whitelist = response;
                    // console.log(whitelist);
                    formData.append("category", "general");
                    formData.append("key", "whitelist");
                    formData.append("value", whitelist);
                    formData.pipe(concat(data => {
                        // console.log(data);
                        async function sendList() {
                            await axios.post(url1+`${servID}`+url2, data, {headers}, {withCredentials: true})
                            .then((res) => {
                                if(res.status >= 200 && res.status < 300) {
                                    message.channel.send('request success!');
                                    console.log(res.data);
                                }
                            })
                            .catch(function (error) {
                                console.log(error);
                                message.channel.send('Something went wrong!');
                            });
                        }
                        sendList();
                    }))
                })
            }
            addwl()
        break;
        
        //REMOVE MEMBER FROM WHITELIST.
        case 'rmwl':
            if (!message.member.roles.cache.some(r => r.name === "Admin")) return message.channel.send('YOU DO NOT HAVE THE REQUIRED PERMISSIONS') .then (message => message.delete({ timeout: 5000, }));
            if (!args[1]) {
                message.channel.send('Please specify a Survivor!').then (message => message.delete({ timeout: 5000, }))
                return;
            }
            function rmwl() {
                message.channel.send("Processing Request...") .then (message => message.delete({ timeout: 4000, }))
                //REMOVE MEMBER FROM LOCAL FILE.
                let oldWL = fs.readFileSync("./logs/whitelist.txt", 'utf-8');
                let listMember = `${args[1]}`;
                let newWL = oldWL.replace( `${listMember}\r\n`, '');
                fs.writeFileSync("./logs/whitelist.txt", newWL, 'utf-8');
                // console.log(newWL);

                //Create Headers for Axios
                const formData = new FormData();
                const headers = {
                    ...formData.getHeaders(),
                    "Content-Length": formData.getLengthSync(),
                    "Authorization": `Bearer ${TOKEN2}`,
                };
                const url1 = 'https://api.nitrado.net/services/';
                const url2 = '/gameservers/settings';
                // Create a readable stream in order to parse local file for Post request body.
                let stream = fs.createReadStream("./logs/whitelist.txt", {flags: 'r'}, 'utf8');
                function streamToString (stream) {
                    const chunks = []
                    return new Promise((resolve, reject) => {
                        stream.on('data', chunk => chunks.push(chunk))
                        stream.on('error', reject)
                        stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')))
                    })
                }
                streamToString(stream).then(function(response) {
                    whitelist = response;
                    // console.log(whitelist);
                    formData.append("category", "general");
                    formData.append("key", "Whitelist");
                    formData.append("value", whitelist);
                    formData.pipe(concat(data => {
                        // console.log(data);
                        async function sendList() {
                            await axios.post(url1+`${servID}`+url2, data, {headers}, {withCredentials: true})
                            .then((res) => {
                                if(res.status >= 200 && res.status < 300) {
                                    message.channel.send('request success!');
                                    console.log(res.data);
                                }
                            })
                            .catch(function (error) {
                                console.log(error);
                                message.channel.send('Something went wrong!');
                            });
                        }
                        sendList();
                    }))
                })      
            }
            rmwl()
        break;

        //ADD MEMBER TO BAN LIST
        case 'addban':
            if (!message.member.roles.cache.some(r => r.name === "Admin")) return message.channel.send('YOU DO NOT HAVE THE REQUIRED PERMISSIONS') .then (message => message.delete({ timeout: 5000, }));
            if (!args[1]) {
                message.channel.send('Please specify a Survivor!').then (message => message.delete({ timeout: 5000, }))
                return;
            }
            function addban() {
                message.channel.send("Processing Request...") .then (message => message.delete({ timeout: 4000, }))
                //Create a readStream and writing new banned survivor to local file.
                var oldList = fs.createWriteStream('./logs/ban.txt', {flags: 'a'}, 'utf8');
                oldList.write(`${args[1]}`);
                oldList.end("\r\n");

                //Create Headers for Axios
                const formData = new FormData();
                const headers = {
                    ...formData.getHeaders(),
                    "Content-Length": formData.getLengthSync(),
                    "Authorization": `Bearer ${TOKEN2}`,
                };
                const url1 = 'https://api.nitrado.net/services/';
                const url2 = '/gameservers/settings';
                // Create a readable stream in order to parse local file for Post request body.
                let stream = fs.createReadStream("./logs/ban.txt", {flags: 'r'}, 'utf8');
                function streamToString (stream) {
                    const chunks = []
                    return new Promise((resolve, reject) => {
                    stream.on('data', chunk => chunks.push(chunk))
                    stream.on('error', reject)
                    stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')))
                    })
                }
                streamToString(stream).then(function(response) {
                    ban = response;
                    // console.log(ban);
                    formData.append("category", "general");
                    formData.append("key", "bans");
                    formData.append("value", ban);
                    formData.pipe(concat(data => {
                        // console.log(data);
                        async function sendList() {
                            await axios.post(url1+`${servID}`+url2, data, {headers}, {withCredentials: true})
                            .then((res) => {
                                if(res.status >= 200 && res.status < 300) {
                                    message.channel.send('request success!');
                                    console.log(res.data);
                                }
                            })
                            .catch(function (error) {
                                console.log(error);
                                message.channel.send('Something went wrong!');
                            });
                        }
                        sendList();
                    }))
                })
            }
            addban()
        break;

        //REMOVE MEMBER FROM BAN LIST.
        case 'rmban':
            if (!message.member.roles.cache.some(r => r.name === "Admin")) return message.channel.send('YOU DO NOT HAVE THE REQUIRED PERMISSIONS') .then (message => message.delete({ timeout: 5000, }));
            if (!args[1]) {
                message.channel.send('Please specify a Survivor!').then (message => message.delete({ timeout: 5000, }))
                return;
            }
            function rmban() {
                message.channel.send("Processing Request...") .then (message => message.delete({ timeout: 4000, }))
                //REMOVE MEMBER FROM LOCAL FILE.
                let oldBan = fs.readFileSync("./logs/ban.txt", 'utf-8');
                let listMember = `${args[1]}`;
                let newBan = oldBan.replace( `${listMember}\r\n`, '');
                fs.writeFileSync("./logs/ban.txt", newBan, 'utf-8');
                // console.log(newBan);

                //Create Headers for Axios
                const formData = new FormData();
                const headers = {
                    ...formData.getHeaders(),
                    "Content-Length": formData.getLengthSync(),
                    "Authorization": `Bearer ${TOKEN2}`,
                };
                const url1 = 'https://api.nitrado.net/services/';
                    const url2 = '/gameservers/settings';
                // Create a readable stream in order to parse local file for Post request body.
                let stream = fs.createReadStream("./logs/ban.txt", {flags: 'r'}, 'utf8');
                function streamToString (stream) {
                    const chunks = []
                    return new Promise((resolve, reject) => {
                        stream.on('data', chunk => chunks.push(chunk))
                        stream.on('error', reject)
                        stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')))
                    })
                }
                streamToString(stream).then(function(response) {
                    ban = response;
                    // console.log(ban);
                    formData.append("category", "general");
                    formData.append("key", "bans");
                    formData.append("value", ban);
                    formData.pipe(concat(data => {
                        // console.log(data);
                        async function sendList() {
                            await axios.post(url1+`${servID}`+url2, data, {headers}, {withCredentials: true})
                            .then((res) => {
                                if(res.status >= 200 && res.status < 300) {
                                    message.channel.send('request success!');
                                    console.log(res.data);
                                }
                            })
                            .catch(function (error) {
                                console.log(error);
                                message.channel.send('Something went wrong!');
                            });
                        }
                        sendList();
                    }))
                })
            }
            rmban()
        break;
    }
})

bot.on('error', function(err) {
    console.log(err)
});

bot.on('ready', () => {
    console.info(`Logged in as ${bot.user.tag}!`)
    console.log ('Access Controls Ready!')
})

//Login
bot.login(TOKEN);
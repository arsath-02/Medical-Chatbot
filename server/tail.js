const accountSid = 'AC4d42b8baf1b0da7db2fb5b8581976e20';
const authToken = '130e9125185100d46129762f45a436f9';
const client = require('twilio')(accountSid, authToken);

client.messages
    .create({
                from: 'whatsapp:+14155238886',
                body:'How are you doing',
        to: 'whatsapp:+919597965746'
    })
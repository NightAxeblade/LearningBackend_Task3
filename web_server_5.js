const fs = require('fs');
const http = require('http');
const nodemailer = require ('nodemailer');
const server = http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'}); 

    var email = req.url.replace('/','');
    
    fs.writeFile('EmailId.txt', email, function (err) {
        if (err) throw err;
        console.log('Saved!');
    });
    res.end(email);


    nodemailer.createTestAccount((err, account) => {
        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
            host: 'smtp.ethereal.email',
            port: 587,
            secure: false, // true for 465, false for rest
            auth: {
                user: account.user, // generated ethereal user
                pass: account.pass // generated ethereal password
            }
        });
    
        // setup email data with unicode symbols
        let mailOptions = {
            from: '"UD" <UD@example.com>', 
            to: email, 
            subject: 'Hello ', 
            text: 'Heyy', // plain text body
            html: '<b>Hello world?</b>' // html body
        };
    
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error);
            }
            console.log('Message sent: %s', info.messageId);
            // Preview only available when sending through an Ethereal account
            console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    
            // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
            // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
        });
    });

});


server.listen(5000);
console.log("Server is listening");
const { Router } = require('express');
const express = require('express');
let Captcha = require('node-captcha-generator');
const app = express()
const recaptchaRoute = new Router()



recaptchaRoute.get('/imageGen', function(req, res, next) {
        var c = new Captcha({
            length:5, // Captcha length
            size:{    // output size
                width: 100,
                height: 40
            }
        });
        console.log(c.value);
        c.toBase64(function(err, base64){
            base64Data  =   base64.replace(/^data:image\/png;base64,/, "");
            base64Data  +=  base64Data.replace('+', ' ');
           
        //     res.send(base64Data)
            binaryData  =   new Buffer.from(base64Data, 'base64').toString('binary');
                if(err){
                    console.log("Captcha Error");
                    console.log(err);
                }
                else{
                    res.contentType('image/png');
                    res.end(binaryData,'binary');
                }
        });
    });




module.exports = recaptchaRoute
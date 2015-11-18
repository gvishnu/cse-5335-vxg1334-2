var mongoose = require('mongoose');
var prompt = require('prompt')
var converter = require('csvtojson').Converter;
var fs = require('fs');

mongoose.connect('mongodb://vishnu:gollapudi@ds055564.mongolab.com:55564/heroku_dtlpkmtx')
var conn = mongoose.connection;

conn.on('error', function(err){
    
    console.log('Connection error', err);
    });
conn.once('open', function(){
    
    //console.log('Connected...');
    });

var csvfile = 'data.csv';
var csv_con = new converter();

fs.createReadStream(csvfile).pipe(csv_con);


csv_con.on("end_parsed", function(jsonObj){
    
    conn.collection('flowers').insert(jsonObj);
    }); 


console.log('Collection created and data inserted successfully...');
var Schema = mongoose.Schema;
var Players_100_schema = new Schema({id : Number, a : Number, b : String, c : String, d : Number});

var flower = mongoose.model('flower', Players_100_schema,'flowers');

prompt.start();

prompt.get(['Primary_key','Secondary_key'], function (err, result) {
   
   if (err) throw err;
   
   flower.find({'id' : result.Primary_key}).exec(function(err, res){
       
       if(err) throw err;
       console.log('%s',res);
       //conn.close();
       });
    
    flower.find({'a' : result.Secondary_key}).exec(function(err, res) {
       if(err) throw err;
       console.log('%s',res);
       conn.close();
        
    });
    
});

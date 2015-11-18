var fs = require('fs');
var pg = require('pg');
var converter = require('csvtojson').Converter;
var prompt = require('prompt');


var connect = process.env.DATABASE_URI || 'postgres://sylvrtajnwhawj:8Ip0Tke40wQlnZX-jrfD9HxoKi@ec2-54-83-53-120.compute-1.amazonaws.com:5432/d12gidoaks9rc4?ssl=true';


var client = new pg.Client(connect);
console.log('Connected to postgres...');
client.connect(function(err, client){
    
    if (err) throw err;
    });
    
    var query2 = client.query('CREATE TABLE flowers1(id VARCHAR(15), a VARCHAR(40), b VARCHAR(40), c VARCHAR(40), d VARCHAR(40))');
    query2.on('end', function(){
    var csvfile = 'data.csv';
    var csv_con = new converter();

    fs.createReadStream(csvfile).pipe(csv_con);
    csv_con.on("end_parsed", function(jsonObj){
        
        for(var i = 0; i<jsonObj.length;i++){
        
        client.query('INSERT INTO flowers1(id,a,b,c,d) VALUES ($1,$2,$3,$4,$5)', 
        [jsonObj[i].id, jsonObj[i].a, jsonObj[i].b,jsonObj[i].c,jsonObj[i].d],function(err){
            
            if(err) throw err;
        });
            
        }
    });
    });
         prompt.start();
         prompt.get(['P_Key', 'S_key'], function(err, result) {
         
          if (err) throw err; 
          
          var query = client.query('SELECT a FROM flowers1 WHERE id = $1',[result.P_Key]);
              
              query.on('row', function(row, result){
            result.addRow(row);
          });
         query.on('end', function(result){
            
           console.log(result.rows[0]);
            
         });
         
          
          var query1 = client.query('SELECT a FROM flowers1 WHERE b = $1',[result.S_key]);
          
          query1.on('row', function(row1, result1){
            result1.addRow(row1);
          });
         query1.on('end', function(result1){
            
           console.log(result1.rows);
           client.end();
         });
         
         });
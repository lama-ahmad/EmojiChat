//Set up requirements
var express = require("express"),
    faker = require("faker"),
    app = express(),
    https = require('http').Server(app),
    io = require('socket.io')(https),
    port = process.env.PORT || 9000,
    waiting_list=[],
    temp_partner,
    num_users=0;

var Request = require('request');
var bodyParser = require('body-parser');
var  _  = require('underscore');

//Set EJS as templating language WITH html as an extension
app.engine('.html', require('ejs').__express);
app.set('view engine', 'html');

//Set up static directory
app.use('/static',express.static(__dirname+"/static"));

// Enable json body parsing of application/json
app.use(bodyParser.json());

/*---------------
//DATABASE CONFIG
----------------*/
var cloudant_USER = '58dd82d5-410d-43c5-beb9-7c572d238346-bluemix';
var cloudant_DB = 'emoji_chat';
var cloudant_KEY = 'ficandeactandsouldreengl';
var cloudant_PASSWORD = 'c1a8dff8c55b0dbee74568eb660740d3fed93c68';

var cloudant_URL = "https://" + cloudant_USER + ".cloudant.com/" + cloudant_DB;

/*---------------
//ROUTES
----------------*/

app.get("/", function(req, res){
	res.render('index');
});

//Main Page Route - Show SINGLE category VIEW
app.get("/:category", function(req, res){
	var category = req.params.category;
	res.render('gallery', {page: category});
});

//SAVE an object to the db
app.post("/save", function(req,res){
	// console.log("A POST!!!!");
	//Get the data from the body
	var data = req.body;
	// console.log(data);
	//Send the data to the db
	Request.post({
		url: cloudant_URL,
		auth: {
			user: cloudant_KEY,
			pass: cloudant_PASSWORD
		},
		json: true,
		body: data
	},
	function (error, response, body){
		if (response.statusCode == 201){
			// console.log("Saved!");
			res.json(body);
		}
		else{
			// console.log("Uh oh...");
			console.log("Error: " + res.statusCode);
			res.send("Something went wrong...");
		}
	});
});


// JSON Serving route - Serve SINGLE cateogry
app.get("/api/category/:category", function(req, res){
	var category = req.params.category;
	console.log('Making a db request for: ' + category);
	//Use the Request lib to GET the data in the CouchDB on Cloudant
	Request.get({
		url: cloudant_URL+"/_all_docs?include_docs=true",
		auth: {
			user: cloudant_KEY,
			pass: cloudant_PASSWORD
		},
		json: true
	},
	function (error, response, body){
		var theRows = body.rows;
		//Filter the results to match the current word
		var filteredRows = theRows.filter(function (d) {
			return d.doc.category == category;
		});
		res.json(filteredRows);
	});
});


//JSON Serving route - Serve ALL Data
app.get("/api/all", function(req,res){
	console.log('Making a db request for all entries');
	//Use the Request lib to GET the data in the CouchDB on Cloudant
	Request.get({
		url: cloudant_URL+"/_all_docs?include_docs=true",
		auth: {
			user: cloudant_KEY,
			pass: cloudant_PASSWORD
		},
		json: true
	},
	function (error, response, body){
		var theRows = body.rows;
		//Send all of the data
        res.json(theRows);
        


	});
});

/*---------------
//SOCKETS
----------------*/

io.on('connection', function(socket){

    num_users++;
    socket.partner=null;

    //set a random username using faker.js
    socket.username='anonymous-'+faker.internet.userName();
    socket.emit("init",{username:socket.username,my_id:socket.id});

    if(waiting_list.length>0){
        temp_partner=waiting_list[0];
        socket.partner=temp_partner;
        waiting_list.splice(0,1);
        socket.broadcast.to(temp_partner).emit("partner", {id:socket.id,username:socket.username});
    }else{
        waiting_list.push(socket.id);
    }
    console.log("Active Users = "+num_users+",Waiting list size="+waiting_list.length);

    socket.on('chat message', function(data){
        var msg=data.msg;
        var target=data.target;
        var source=socket.id;
        socket.broadcast.to(target).emit("chat message partner", msg);
        io.to(source).emit("chat message mine", msg);
    });

    socket.on('partner', function(packet){
        socket.partner=packet.target;
        socket.broadcast.to(socket.partner).emit("partner", packet.data);
        // var curtopic = topics[Math.floor(Math.random() * topics.length)].question;
        // $('#messages').append("<div>"+'Discuss: '+curtopic+"</div>");
    });

    socket.on('disconnect', function () {
        if(socket.partner!=null){
            socket.broadcast.to(socket.partner).emit("typing", false);
               socket.broadcast.to(socket.partner).emit("disconnecting now", 'Your Partner has disconnected . Refresh page to chat again');
        }
        else{
            waiting_list.splice(0,1);
        }
        num_users--;
        console.log("Active Users = "+num_users+",Waiting List="+waiting_list.length);
    });

    socket.on('typing',function (data) {
        socket.broadcast.to(socket.partner).emit("typing", data);
    });



});

app.listen(port, function(){
    console.log('listening on *:' + port);
});



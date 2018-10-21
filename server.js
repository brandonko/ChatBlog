const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

// Define schema for post
const PostSchema = new mongoose.Schema({
	title: String,
	description: String,
	content: String
}, 
{timestamps: true});
const Post = mongoose.model('Post', PostSchema);
module.exports = Post;

// Open up the DB
mongoose.connect("mongodb://localhost:27017/study_buddies", { useNewUrlParser: true });
const db = mongoose.connection;
db.once('open', () => {
  console.log("Connected to mongodb and working!");
});
db.on('error', (err) => {
  console.error("Error!: ", err, "\n");
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));

app.get('/', function(req, res){
	res.sendFile(__dirname + '/index.html');
});

app.post('/store', function(req, res) {
	let myData = new Post(req.body);
	myData.save();
	console.log("added: " + JSON.stringify(req.body) + " to mongodb");
	res.redirect("/");
});

io.on('connection', function(socket){
	console.log('new connection made.');
	socket.on('chat message', function(msg){
		console.log('message: ' + msg);
		io.emit('chat message', msg);
	});
});

console.log(process.ENV);

http.listen(3000, function(){
	console.log('listening on : ' + 3000);
});
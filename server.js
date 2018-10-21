const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const userName = "Ronan";

// Define schema for post
const PostSchema = new mongoose.Schema({
	title: { type: String, trim: true },
	author: { type: String, default: userName },
	content: { type: String, trim: true },
	likes: { type: Number, default: 0 }
}, 
{timestamps: true});
const Post = mongoose.model('Post', PostSchema);
module.exports = Post;

// Define schema for user credentials
const UserSchema = new mongoose.Schema({
	first_name: { type: String, trim: true },
	last_name: { type: String, trim: true },
	email: { type: String, trim: true },
	university: { type: String, trim: true }
}, 
{timestamps: true});
const User = mongoose.model('User', UserSchema);
module.exports = User;

// Open up the DB for post
mongoose.connect("mongodb://localhost:27017/StudyBuddyPosts", { useNewUrlParser: true });
const db = mongoose.connection;
db.once('open', () => { console.log("Connected to mongodb and working!")});
db.on('error', (err) => {console.error("Error!: ", err, "\n")});

// Need to set up db for user credentials

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
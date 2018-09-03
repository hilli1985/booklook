let express = require('express');
let app = express();

app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/node_modules'));

console.log("server running and listen in 8000");
app.listen(process.env.PORT || '8000');
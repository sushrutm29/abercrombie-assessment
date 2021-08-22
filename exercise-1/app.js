const express = require('express');
const handlebars = require('express-handlebars');
const axios = require('axios');

const app = express();
const port = 3003;
const static = express.static(__dirname + '/public');

app.use('/public', static);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.engine('handlebars', handlebars({
    defaultLayout: 'main'
}));

app.set('view engine', 'handlebars');

app.get('/', async (req, res) => {
    const { data } = await axios.get('https://5dc588200bbd050014fb8ae1.mockapi.io/assessment');
    res.render('pages/home', {title : 'User List', partial: 'home-scripts', users: data} );
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
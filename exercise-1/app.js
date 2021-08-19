const express = require('express');
const app = express();
const port = 3000;
const handlebars = require('express-handlebars');

const static = express.static(__dirname + '/public');
app.use('/public', static);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine('handlebars', handlebars({
    defaultLayout: 'main'
}));

app.set('view engine', 'handlebars');

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.render('main', {layout : 'index'});
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
});
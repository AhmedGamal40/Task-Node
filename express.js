const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;
const usersFilePath = './users.json';
// console.log(usersFilePath)

app.use(bodyParser.json());


app.get('/', (req, res) => {
  res.send('<html><head><title>Welcome</title></head><body><h1>Welcome</h1></body></html>');
});


app.post('/sign-up', (req, res) => {
  const { email, password, username } = req.body;

  const users = JSON.parse(fs.readFileSync(usersFilePath, 'utf8'));


  const existingUser = users.find(user => user.email === email);
  if (existingUser) {
    return res.status(400).json({ error: 'The email already exists' });
  }

  
  users.push({ email, password, username });

 
  fs.writeFileSync(usersFilePath, JSON.stringify(users));

  res.redirect('/profile');
});


app.post('/login', (req, res) => {
  const { email, password } = req.body;

  const users = JSON.parse(fs.readFileSync(usersFilePath, 'utf8'));

  
  const user = users.find(user => user.email === email);

  if (!user) {
    return res.status(400).json({ error: 'You entered an email that does not exist. Please sign up.' });
  }

  if (user.password !== password) {
    return res.status(400).json({ error: 'You entered the wrong password.' });
  }

  res.redirect(`/profile?username=${user.username}`);
});


app.get('/profile', (req, res) => {
  const { username } = req.query;
  res.send(`Welcome to your profile, ${username}!`);
});


app.use((req, res) => {
  res.status(404).send('404 Not Found');
});


app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});


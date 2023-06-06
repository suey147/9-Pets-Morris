import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import * as fs from "fs"

const app = express();
const port = 3000;


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Serve static files from the dist directory
app.use('/out', express.static(path.join(__dirname, '..', 'out')));
app.use('/assets', express.static(path.join(__dirname, '..', 'assets')));

app.use(express.static(path.join(__dirname, '..', 'Application.css')));
app.get('/Application.css', (req, res) => {
  res.setHeader('Content-Type', 'text/css');
  res.sendFile(path.join(__dirname, '../Application.css'));
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../menu.html'));
});
app.get('/game', (req, res) => {
  res.sendFile(path.join(__dirname, '../Application.html'));
});





// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

app.use(express.text());
app.post('/save', (req, res) => {
  //const jsonContent = JSON.stringify(req.body);
  console.log("server received request")
  console.log(req.body)

  const gameIndex = Number(req.query.gameIndex);
  if (req.body) {
    // Create a new game object from the request body
    const newGameData = req.body.split('\n');
    const newGameName = newGameData.shift();

    const boardsData = [];
    let currentBoard = '';
    let openingBrackets = 0;
    let closingBrackets = 0;

    for (const line of newGameData) {
      currentBoard += line;
      openingBrackets += (line.match(/{/g) || []).length;
      closingBrackets += (line.match(/}/g) || []).length;

      if (openingBrackets === closingBrackets) {
        boardsData.push(currentBoard);
        currentBoard = '';
        openingBrackets = 0;
        closingBrackets = 0;
      } else {
        currentBoard += '\n';
      }
    }

    const newGameObject = {
      name: newGameName,
      boards: boardsData.join('\n')
    };

    // Read the data file
    const filePath = path.join(__dirname, '..', '/etc/secrets/data.txt');
    const gameData = fs.readFileSync(filePath, 'utf8');

    // Games are seperated by two newlines
    const gameEntries = gameData.trim().split(/\n\n/);

    // Parse the game entries into objects
    const gameObjects = [];
    gameEntries.forEach((entry) => {
      const [name, ...boards] = entry.trim().split('\n');
      const cleanedBoards = boards.filter(board => board.trim() !== ''); // Remove empty lines

      const game = {
        name: name.trim(),
        boards: cleanedBoards.join('\n')
      };

      gameObjects.push(game);
    });
    
    // New game, push to the end of the array
    if (gameIndex == -1) {
      gameObjects.push(newGameObject)
    // Existing game an index given by gameIndex
    } else if (gameIndex >= 0) {
      gameObjects[gameIndex] = newGameObject;
    // Invalid gameIndex
    } else {
      console.error('Received empty or invalid JSON data or gameIndex');
      res.status(400).send('Received empty or invalid JSON data or gameIndex');
      return;
    }

    // Create an object that can be written to the file
    const dataString = gameObjects
      .map((game) => {
        const boards = game.boards.split('\n').join('\n');
        return `${game.name}\n${boards}`;
      })
      .join('\n\n');

    // Write the data string to the file
    fs.writeFileSync('data.txt', dataString, 'utf8');
    console.log('Text file written successfully');
    res.send('Data saved successfully');
  } else {
    console.error('Received empty or invalid JSON data or gameIndex');
    res.status(400).send('Received empty or invalid JSON data or gameIndex');
    return;
  }
});

app.get('/load', (req, res) => {
  const filePath = path.join(__dirname, '..', 'data.txt');

  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      console.error('Data file does not exist:', filePath);
      res.status(200).send([]);
    } else {
      fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
          console.error('Error reading data file:', err);
          res.status(500).send('Error loading game data');
        } else {
          const gameEntries = data.trim().split('\n');
          const gameList = [];
          let currentGame = { name: '', data: '' };
          for (const gameEntry of gameEntries) {
            if (gameEntry[0] !== '{') {
              // New game entry detected
              if (currentGame.name !== '' && currentGame.data !== '') {
                gameList.push(currentGame);
              }
              currentGame = { name: gameEntry.trim(), data: '' };
            } else {
              // Continue existing game entry
              currentGame.data += '\r'
              currentGame.data += gameEntry;
            }
          }

          // Add the last game entry
          if (currentGame.name !== '' && currentGame.data !== '') {
            gameList.push(currentGame);
          }

          //res.json(gameList);     
          res.send(gameList);
        }
      });
    }
  });
});
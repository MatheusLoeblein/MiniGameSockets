import express from 'express';
import http from 'http';
import createGame from './public/game.js';
import { create } from 'domain';
import socketio from 'socket.io';

const app = express()
const server = http.createServer(app)
const sockets = socketio(server)

app.use(express.static('public'))

const game = createGame()

game.subscribe(command => {
  console.log(`> Emmiting ${command.type}`)
  sockets.emit(command.type, command)
})

// game.addPlayer({playerId: 'player1', playerX: 1, playerY: 4})
// game.addPlayer({playerId: 'player2', playerX: 6, playerY: 5})
// game.addPlayer({playerId: 'player3', playerX: 8, playerY: 1})

// game.addFruit({fruitId: 'Fruit1', fruitX: 6, fruitY: 2})
// game.addFruit({fruitId: 'Fruit2', fruitX: 7, fruitY: 8})



sockets.on('connection', (socket) => {
  const playerId = socket.id
  console.log(`> Player connected on Server with id: ${playerId}`)

  game.addPlayer({playerId: playerId})
  // console.log(game.state)

  socket.emit('setup', game.state)

  socket.on('disconnect', () => {
    game.removePlayer({playerId: playerId})
    console.log(`> Player disconnected: ${playerId}`)
  })

  socket.on('move-player', (command) => {
    command.playerId
    command.type = 'move-player'

    game.movePlayer(command)
  })
})




server.listen(3000, () => {
  console.log('> Server listening on port: 3000')
})
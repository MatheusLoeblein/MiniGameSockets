export default function createGame() {


  const state = {
    players: {},
    fruits: {},
    screen: {
      width: 10,
      height: 10
    }
  }

  const observers = []

  function subscribe(observerFunction) {
    observers.push(observerFunction)
  }

  function notifyAll(command){
    for (const observerFunction of observers) {
      observerFunction(command)
    }
  }

  function setState(newState) {
    Object.assign(state, newState)
  }

  function addPlayer(command){
    const playerId = command.playerId
    const playerX = 'playerX' in command ? command.playerX : Math.floor(Math.random() * state.screen.width)
    const playerY = 'playerY' in command ? command.playerY : Math.floor(Math.random() * state.screen.height)

    state.players[playerId] = {
      x: playerX, 
      y: playerY
    }

    notifyAll({
      type: 'add-player',
      playerId: playerId,
      playerX: playerX,
      playerY: playerY
    })
  }

  function removePlayer(command) {
    const playerId = command.playerId

    delete state.players[playerId]

    notifyAll({
      type: 'remove-player',
      playerId: playerId,
    })
  }

  function addFruit(command){
    const fruitId = command.fruitId
    const fruitX = command.fruitX
    const fruitY = command.fruitY

    state.fruits[fruitId] = {
      x: fruitX, 
      y: fruitY}
  }

  function removeFruit(command) {
    const fruitId = command.fruitId

    delete state.fruits[fruitId]
  }

  function movePlayer(command) {


    const acceptedMoves = {
      ArrowUp(){
        if(player.y > 0) {
          return player.y -= 1
        }
      },
      ArrowRight(){          
        if (player.x + 1 < state.screen.width) {
          return player.x += 1
        }

      },
      ArrowDown(){
        if (player.y + 1 < state.screen.height){
          return player.y += 1
        }

      },
      ArrowLeft(){
        if (player.x > 0){
          return player.x -= 1
        }

      }

    }

    console.log(`Moving ${command.playerId} with ${command.keyPressed}`)
    const keyPressed = command.keyPressed
    const player = state.players[command.playerId]
    const playerId = command.playerId
    const moveFunction = acceptedMoves[keyPressed]

    if (player && moveFunction) {
      moveFunction(player)
      checkForFruitCollision(playerId)
    }
    
  
}

function checkForFruitCollision(playerId){
    const player = state.players[playerId]

    for (const fruitId in state.fruits){
      const fruit = state.fruits[fruitId]
      console.log(`Checking ${playerId} and ${fruitId}`)

      if (player.x === fruit.x && player.y === fruit.y){
        console.log(`COLLISION CHECK FOR ${fruit} in ${player}`)
        removeFruit({fruitId: fruitId});

      }
    }

  }

  return {
    movePlayer, 
    addPlayer,
    removePlayer,
    addFruit,
    removeFruit,
    setState,
    subscribe,
    state
  }
}

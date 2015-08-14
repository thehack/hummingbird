var game = new Phaser.Game(800, 600, Phaser.AUTO, 'hummingbird', {
  preload: preload,
  create: create,
  update: update,
  render: render
});

function preload() {
  game.stage.backgroundColor = '#BFFBFF';
  game.load.spritesheet('hb', './img/spritesheet.png', 88,72);  
  game.time.advancedTiming = true;
  game.time.desiredFps = 120;
}

var flowers = [];
function create() {
  game.world.setBounds(0, 0, 10000, 600);

  var style = {fontSize: '18px'}
  t1 = game.add.text(50,25, "ENERGY", style);
  t2 = game.add.text(550,25, "NECTAR", style);

  t1.fixedToCamera = true;
  t2.fixedToCamera = true;

  player = game.add.sprite(0, 290, 'hb');

  player.animations.add('fly', [0, 2, 4, 6,8,7,5,3,1], 60, true, 13);
  player.animations.add('hover', [9,10,11,12,11,10], 60, true, 13);
  player.anchor.x = 0.5;
  player.fuel = 100;
  fuelGauge = game.add.graphics();
  fuelGauge.lineStyle(2, 0x000000, 1);
  fuelGauge.fixedToCamera = true;
  fuelGauge.drawRect(50,50,200,20)

  nectarGauge = game.add.graphics();
  nectarGauge.lineStyle(2, 0x000000, 1);
  nectarGauge.fixedToCamera = true;
  nectarGauge.drawRect(550,50,200,20)  

  gameOver = game.add.text(150,250, player.x. toString(), {fontSize: '90px'});
  gameOver.fixedToCamera = true;
  gameOver.visible = false;
  
  //gameOver.inputEnabled = true;
  //gameOver.events.onInputUp.add(function() {alert('clicked')})
  
  f = game.add.bitmapData(200,20);
  f.ctx.beginPath();
  f.ctx.rect(0,0,200,20);
  f.ctx.fillStyle = '#000000';
  f.ctx.fill();
  fuel = game.add.sprite(50,50, f)
  fuel.fixedToCamera = true;

  n = game.add.bitmapData(200,20);
  n.ctx.beginPath();
  n.ctx.rect(0,0,200,20);
  n.ctx.fillStyle = '#000000';
  n.ctx.fill();
  nectar = game.add.sprite(550,50, n)
  nectar.fixedToCamera = true;
  
  // The little flowers our with nectar for our bird to power-up
  var lavender = game.add.bitmapData(10,10);
  lavender.ctx.beginPath();
  lavender.ctx.rect(0,0,10,10);
  lavender.ctx.fillStyle = '#C097E6';
  lavender.ctx.fill();
  flowers = [];
  for (var i = 0; i < 40; i++) {
    var flower = game.add.sprite(game.world.randomX,game.world.randomY,lavender)
    flower.juice = Math.floor(Math.random() * (100 - 50 + 1)) + 50;
    flowers.push(flower)
  };

  game.camera.follow(player); //always center player

  cursors = game.input.keyboard.createCursorKeys();
  game.input.onDown.add(listener, this);
}

function update() {
   nectar.scale.x = 0;  
  if (player.fuel <= 0) {    
    gameOver.text = "Game Over\n" +Math.round(player.x) + " Points";

    gameOver.visible = true;
    player.y += 6;
  } 
  else {  // SCALE DOWN FUEL. 
    fuel.scale.x = player.fuel/100;
    player.fuel -= 0.25;
  }

  // Arrow Keys
  if (cursors.up.isDown) {
    player.y += -4
  }
  else if (cursors.down.isDown) {
    player.y += 4;
  } 
 
  if (cursors.left.isDown) {
    player.animations.play('fly');

      player.scale.x = -1
        player.x -= 4;

  } 
  else if (cursors.right.isDown) {
  player.animations.play('fly');
      player.scale.x = 1;
    player.x += 4;
 
  } 
  else {
    player.animations.play( player.mode)
  }
  flowers.forEach(function(flower){
    if ((player.right >= flower.left) &&   
        (player.right <= flower.right) && 
        (player.top +22  >= flower.top) && 
        (player.top + 22 <= flower.bottom)) {
      if (flower.juice >= 0) {
        if (player.fuel <  100) {
          player.fuel += 0.5;
        }
        flower.juice -=0.25;
        nectar.scale.x = flower.juice/100;
        
      }
     } 
    
  })
}

var  listener = function(pointer){
  if (gameOver.visible === true) {
   return;
  }
  player.mode = 'fly';

  //determine direction to fly
  if (pointer.worldX < player.x){
      player.direction = -1;

  } else {
    player.direction = 1;
  }
  // A Squared + B Squared = C Squared (formula for the hypotenuse of a triangle - needed to determine tween time)
  var hPixels = Math.sqrt(Math.pow((player.x - pointer.worldX), 2) + Math.pow((player.y - pointer.worldY), 2));
  //our standard rate of travel is 4 pixels per frame, 240 pixels a second.
  // we should be taking a second for every 240 pixels, so our time mulitplier is 4.17
  var tweenTime = hPixels*4.17

  setTimeout(function(){player.mode = 'hover'}, tweenTime*.5)
  game.add.tween(player).to( { x: pointer.worldX -45*player.direction, y: pointer.worldY -24}, tweenTime, Phaser.Easing.Linear.None, true);
  player.scale.x = (1 * player.direction);

  console.log('moving to ' + event.x + ", "+ event.y)
};
// check for collision with flowers

function render() {

  game.debug.cameraInfo(game.camera, 32, 500);
  //  game.debug.text(game.time.fps || '--', 2, 14, "#00ff00");
}
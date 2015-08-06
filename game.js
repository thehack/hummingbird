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
  player = game.add.sprite(0, 290, 'hb');

  //player.animationplayer.add('walk');
  player.animations.add('fly', [0, 2, 4, 6,8,7,5,3,1], 60, true, 13);
  player.animations.add('hover', [9,10,11,12,11,10], 60, true, 13);
  player.anchor.x = 0.5;

  fuelBoard = game.add.graphics(0, 0);

  // set a fill and line style
  fuelBoard.beginFill(0xff005d);
  fuelBoard.lineStyle(2, 0x000000, 1);

  // draw a shape
  fuelBoard = game.add.graphics();
  fuelBoard.lineStyle(2, 0x000000);

  fuelBoard.endFill();
  fuelBoard.fixedToCamera = true;
  fuelBoard.drawRect(50,50,200,20)

  f = game.add.graphics();
  f.lineStyle(0, 0x000000, 1)
  f.beginFill(0x2300ff)
  f.drawRect(50,50,200,20)
  f.fixedToCamera = true;

  //  The mask is a work-around because incremtally reducing the width of the fuel gauge moves it.
  mask = game.add.graphics(0, 0);
  mask.beginFill(0xffffff);
  mask.drawRect(50, 50, 200, 20);
  mask.fixedToCamera = true;
  f.mask = mask;

  
  // The little flowers our with nectar for our bird to power-up
  var lavender = game.add.bitmapData(10,10);
  lavender.ctx.beginPath();
  lavender.ctx.rect(0,0,10,10);
  lavender.ctx.fillStyle = '#C097E6';
  lavender.ctx.fill();
  flowers = [];
  for (var i = 0; i < 40; i++) {
    flowers.push(game.add.sprite(game.world.randomX,game.world.randomY,lavender))
  };

  game.camera.follow(player); //always center player

  cursors = game.input.keyboard.createCursorKeys();
  game.input.onDown.add(listener, this);
}

function update() {

  // SCALE DOWN FUEL. 
  if (mask.scale.x >= 0) {
    mask.scale.x -= .001
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
    
    if (mask.scale.x < 1) {
      mask.scale.x += .002;
    }
  }
})

}

var  listener = function(pointer){
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
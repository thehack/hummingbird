var w=window,
d=document,
e=d.documentElement,
g=d.getElementsByTagName('body')[0],
x=w.innerWidth||e.clientWidth||g.clientWidth,
y=w.innerHeight||e.clientHeight||g.clientHeight;

var game = new Phaser.Game(960, 480, Phaser.AUTO, '', {
  preload: preload,
  create: create,
  gameOver: gameOver,
  startGame: startGame,
  update: update,
  render: render
});

window.addEventListener('resize', function() {
  game.scale.refresh();
});

function preload() {
  game.stage.backgroundColor = '#BFFBFF';
  game.load.spritesheet('hb', './img/spritesheet.png', 88,72);
  game.load.image('lavenderFlower', './img/lavender.png');
  game.time.advancedTiming = true;
  game.time.desiredFps = 120;
  
  game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
  game.scale.pageAlignHorizontally = true;
  game.scale.pageAlignVertically = true;
  
  game.scale.setResizeCallback(layoutUI, this);
}

function create() {
  game.world.setBounds(0, 0, 10000, 475);

  // Create flowers group FIRST so they render behind the player
  flowers = game.add.group();
  
  // Create reusable 10x10 transparent hitbox for collision detection
  hitboxBitmap = game.add.bitmapData(10,10);
  hitboxBitmap.ctx.beginPath();
  hitboxBitmap.ctx.rect(0,0,10,10);
  hitboxBitmap.ctx.fillStyle = 'rgba(0,0,0,0)'; // Completely transparent
  hitboxBitmap.ctx.fill();

  var style = {fontSize: '18px'}
  t1 = game.add.text(0,0, "ENERGY", style);
  t2 = game.add.text(0,0, "NECTAR", style);

  t1.fixedToCamera = true;
  t2.fixedToCamera = true;

  player = game.add.sprite(100,290, 'hb');
  player.visible = false;

  player.animations.add('fly', [0, 2, 4, 6,8,7,5,3,1], 60, true, 13);
  player.animations.add('hover', [9,10,11,12,11,10], 60, true, 13);
  player.anchor.x = 0.5;
  
  fuelGauge = game.add.graphics();
  fuelGauge.fixedToCamera = true;

  nectarGauge = game.add.graphics();
  nectarGauge.fixedToCamera = true;

  text = game.add.text(0,0, "BEGIN", {fontSize: '90px'});
  text.fixedToCamera = true;
  text.visible = true;
  text.inputEnabled = true;
  text.events.onInputUp.add(startGame)
  text.anchor.set(0.5);
  
  f = game.add.bitmapData(200,20);
  f.ctx.beginPath();
  f.ctx.rect(0,0,200,20);
  f.ctx.fillStyle = '#000000';
  f.ctx.fill();
  fuel = game.add.sprite(0,0, f)
  fuel.fixedToCamera = true;

  n = game.add.bitmapData(200,20);
  n.ctx.beginPath();
  n.ctx.rect(0,0,200,20);
  n.ctx.fillStyle = '#000000';
  n.ctx.fill();
  nectar = game.add.sprite(0,0, n)
  nectar.fixedToCamera = true;

  game.camera.follow(player); //always center player

  cursors = game.input.keyboard.createCursorKeys();
  game.input.onDown.add(listener, this);
  
  layoutUI();
}

function gameOver() {
  game.tweens.pauseAll()
  player.visible = false;
  text.text = "Game Over\n" +Math.round(player.x) + " Points";
  text.visible = true;

  // Clean up flowers and their associated sprites
  flowers.forEach(function(flower){
    if (flower.flowerImage) flower.flowerImage.destroy();
    if (flower.hitboxIndicator) flower.hitboxIndicator.destroy();
  });
  flowers.removeChildren(0,39)
}

function startGame() {
  player.animations.play('hover');

  player.fuel = 100;
  player.visible = true;
  text.visible = false;
  player.x = 100;
  player.y = 290;
  for (var i = 0; i < 40; i++) {
    var x = game.world.randomX;
    var y = game.world.randomY;
    
    // Create transparent 10x10 hitbox for precise collision
    var flower = flowers.create(x, y, hitboxBitmap);
    flower.juice = Math.floor(Math.random() * (100 - 50 + 1)) + 50;
    
    // Create decorative lavender flower image at the same position
    var flowerImage = game.add.sprite(x + 5, y + 5, 'lavenderFlower');
    flowerImage.anchor.set(0.5, 0.5);
    flowerImage.scale.set(0.15); // Scale to visible size
    flower.flowerImage = flowerImage;
    
    // Add visible hitbox indicator - small circle in center
    var hitboxIndicator = game.add.graphics(x + 5, y + 5);
    hitboxIndicator.beginFill(0xFF69B4, 0.6); // Pink with transparency
    hitboxIndicator.drawCircle(0, 0, 8); // 8 pixel diameter circle
    hitboxIndicator.endFill();
    flower.hitboxIndicator = hitboxIndicator;
  };

  //game.tweens.resumeAll()

}

function update() {
   nectar.scale.x = 0;  
  if (player.fuel <= 0) {    
    gameOver()
  } 
  else {  // SHOW AND SCALE DOWN FUEL. 
    fuel.scale.x = player.fuel/100;
    if (text.visible === false) {
      player.fuel -= 0.25;
    }
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
        
        // Fade out flower and hitbox as nectar depletes
        if (flower.flowerImage) {
          flower.flowerImage.alpha = flower.juice / 100;
        }
        if (flower.hitboxIndicator) {
          flower.hitboxIndicator.alpha = flower.juice / 100;
        }
      }
     } 
    
  })

}

var  listener = function(pointer){
  if (text.visible === false) {
      
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

  }
};
// check for collision with flowers

function layoutUI() {
  if (!game || !game.camera || !t1) return;
  
  var viewWidth = game.camera.view.width;
  var viewHeight = game.camera.view.height;
  
  var margin = viewWidth * 0.05;
  var gaugeWidth = viewWidth * 0.2;
  
  t1.cameraOffset.x = margin;
  t1.cameraOffset.y = viewHeight * 0.05;
  
  t2.cameraOffset.x = viewWidth * 0.57;
  t2.cameraOffset.y = viewHeight * 0.05;
  
  fuelGauge.clear();
  fuelGauge.lineStyle(2, 0x000000, 1);
  fuelGauge.drawRect(margin, viewHeight * 0.1, gaugeWidth, 20);
  
  nectarGauge.clear();
  nectarGauge.lineStyle(2, 0x000000, 1);
  nectarGauge.drawRect(viewWidth * 0.57, viewHeight * 0.1, gaugeWidth, 20);
  
  fuel.cameraOffset.x = margin;
  fuel.cameraOffset.y = viewHeight * 0.1;
  fuel.width = gaugeWidth;
  
  nectar.cameraOffset.x = viewWidth * 0.57;
  nectar.cameraOffset.y = viewHeight * 0.1;
  nectar.width = gaugeWidth;
  
  text.cameraOffset.x = viewWidth * 0.5;
  text.cameraOffset.y = viewHeight * 0.5;
}

function render() {

  game.debug.cameraInfo(game.camera, 32, 500);
  //  game.debug.text(game.time.fps || '--', 2, 14, "#00ff00");
}

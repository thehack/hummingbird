var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example', {
  preload: preload,
  create: create,
  update: update,
  render: render
});

function preload() {
  game.stage.backgroundColor = '#BFFBFF';
 // game.load.image('hb', './img/hb15.png')
  game.load.spritesheet('hb', '/img/spritesheet.png', 88,72);  

  game.load.image('lavender', '/img/lavender1.png')
  game.time.advancedTiming = true;
   game.time.desiredFps = 120;
}

function create() {

  game.world.setBounds(0, 0, 10000, 600);
  s = game.add.sprite(390, 290, 'hb');
  l = game.add.sprite(800, 640, 'lavender')

  l.scale.setTo(0.5, 0.5)
  //s.animations.add('walk');
  s.animations.add('fly', [0, 2, 4, 6,8,7,5,3,1], 60, true, 13);
  s.animations.add('hover', [9,10,11,12,11,10], 60, true, 13);
  s.anchor.x = 0.5;

  for (var i = 0; i < 20; i++) {
    game.add.image(game.world.randomX, 400, 'lavender');

  }

  game.camera.follow(s); //always center player

  //  This will create a new object called "cursors", inside it will contain 4 objects: up, down, left and right.
  //  These are all Phaser.Key objects, so anything you can do with a Key object you can do with these.
  cursors = game.input.keyboard.createCursorKeys();

  var text = game.add.text(32, 32, 'Arrow keys to navigate', {
  });
}

function update() {

  if (cursors.up.isDown) {
    s.y += -1*4
  } else if (cursors.down.isDown) {
    s.y += 4;

  } 
  if (cursors.left.isDown) {
    s.animations.play('fly');

      s.scale.x = -1
        s.x -= 4;

  } else if (cursors.right.isDown) {
  s.animations.play('fly');
      s.scale.x = 1;
  
    s.x += 4;

  } else {
    s.animations.play('hover')
  }


}

function render() {

  game.debug.cameraInfo(game.camera, 32, 500);
     game.debug.text(game.time.fps || '--', 2, 14, "#00ff00");   

}

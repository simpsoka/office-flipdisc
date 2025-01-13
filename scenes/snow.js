import { createScene } from 'flipdisc-server'

const schema = {
  title: 'Snow',
  description: 'Falling snow effect'
}

const scene = function() {
  const scene = new createScene();

  scene.useLoop(i => {
    for (let x = 0; x < scene.width; x++) {
      for (let y = 0; y < scene.height; y++) {
        if (Math.random() < 0.05) {
          scene.flip(x, y);
        }
      }
    }
  }, 1/6)

  return scene;
}

export { scene, schema }

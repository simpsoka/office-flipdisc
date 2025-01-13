import { createScene } from 'flipdisc-server'

const schema = {
  title: 'Snow',
  description: 'A holiday scene with falling snow.'
}

const snow = function() {
  const scene = new createScene();

  scene.useLoop(i => {
    for (let i = 0; i < scene.width; i++) {
      for (let j = 0; j < scene.height; j++) {
        if (Math.random() < 0.05) {
          scene.flip(i, j);
        }
      }
    }
  }, 1/6)

  return scene;
}

export { snow as scene, schema }

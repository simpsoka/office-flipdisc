import { createScene } from 'flipdisc-server'

const schema = {
  title: 'Snow',
  description: 'A holiday scene with falling snow.'
}

const scene = function() {
  const scene = new createScene();

  scene.useLoop(i => {
    for (let x = 0; x < scene.width; x++) {
      if (Math.random() < 0.1) {
        const y = Math.floor(Math.random() * scene.height);
        scene.flip(x, y);
      }
    }
  }, 1/6)

  return scene;
}

export { scene, schema }

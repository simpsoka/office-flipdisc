import { createScene } from 'flipdisc-server'

const schema = {
  title: 'Snow',
  description: 'A holiday scene with falling snow.'
}

const snow = function() {
  const scene = createScene();

  scene.useLoop(() => {
    const x = Math.floor(Math.random() * scene.width);
    const y = Math.floor(Math.random() * scene.height);
    scene.flip(x, y);
  }, 1/10);
  return scene;
}

export { snow as scene, schema }

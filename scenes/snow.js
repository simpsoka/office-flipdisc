import { createScene } from 'flipdisc-server'

const schema = {
  title: 'Snow',
  description: 'A holiday scene with falling snow.'
}

const snow = function() {
  const scene = createScene()

  scene.useLoop((i) => {
    const numDiscsToFlip = Math.floor(Math.random() * 10) + 5; // Flip 5-14 discs each frame

    for (let i = 0; i < numDiscsToFlip; i++) {
      const randomRow = Math.floor(Math.random() * scene.rows);
      const randomCol = Math.floor(Math.random() * scene.cols);
      scene.flip(randomRow, randomCol);
    }
  }, 1/30)

  return scene
}

export { snow as scene, schema }

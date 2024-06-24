import { createScene, loadImage, ImageView } from 'flipdisc-server'

const schema = {
  title: 'World',
  description: 'A simple pose widget that displays the current pose.',
}

const world = function() {
  const scene = createScene()

  scene.once('loaded', async () => {
    const img = await loadImage('https://i.imgur.com/CW3rGWc.png')
    scene.drawImage(img)
    const sun = new ImageView('https://i.imgur.com/Skd54Nt.png')
    scene.add(sun)
  })
  return scene;
 
}

export { world as scene, schema }
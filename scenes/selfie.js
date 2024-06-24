import { createScene, PoseEmitter } from 'flipdisc-server'

const schema = {
  title: 'Selfie',
  description: 'A simple pose widget that displays the current pose.',
}

const pose = function() {
  const scene = createScene()
  const e = new PoseEmitter({ port: 1 })
  scene.add(e)
  e.on('update', data => {
    scene.render(data.image)
  })

  return scene;
}

export { pose as scene, schema }
import { createScene, GestureEmitter } from 'flipdisc-server'
import { Simulator } from '../src/blob/simulator.js'

// from: https://github.com/kotsoft/particle_based_viscoelastic_fluid/

const defaults = {
  count: 60,
  size: 2,
  density: 20
}

const schema = {
  title: 'Blob',
  description: 'displaying an image',
  properties: {
    count: {
      type: 'integer',
      default: defaults.count,
      min: 1,
      max: 500
    },
    size: {
      type: 'integer',
      default: defaults.size,
      min: 1,
      max: 10
    },
    density: {
      type: 'integer',
      default: defaults.density,
      min: 1,
      max: 20
    }
  }
}

const blob = async function(options) {
  options = { ...defaults, ...options };
  const { count, size, density } = options;
  const scene = new createScene();
  let simulator;
  const e = new GestureEmitter({ port: 0 })
  scene.add(e)

  e.on('move', data => {
    const { x, y } = data.position
    simulator.drag = true;
    simulator.mouseX = x * scene.width;
    simulator.mouseY = y * scene.height;
  })

  e.on('update', data => {
    simulator.drag = (data.gesture[0] == 'Open_Palm')
  })

  scene.once('loaded', async () => {
    simulator = new Simulator(scene.width, scene.height, count)
    simulator.material["pointSize"] = size
    simulator.material["restDensity"] = density
    simulator.running = true;
  })

  scene.useLoop(() => {
    simulator.update()
    scene.clear()
    simulator.draw(scene.context);    
  })

  return scene;
}

export { blob as scene, schema }
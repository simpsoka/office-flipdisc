import { createScene } from 'flipdisc-server'
import PixelManipulator from 'pixelmanipulator'

const defaults = {
  rule: 'Conway',
  fill: 15,
}

const schema = {
  title: 'Cellular Automata',
  description: 'Runs two-dimensional cellular automata',
  properties: {
    rule: {
      type: 'enum',
      default: defaults.rule,
      values: ['Conway', 'Brian', 'Highlife', 'Seeds']
    },
    fill: {
      type: 'integer',
      default: defaults.fill,
      min: 1,
      max: 100
    }
  }
}

const image = async function(options) {
  options = { ...defaults, ...options };
  const { rule, fill } = options;
  const scene = new createScene();
  let lastPixelCounts = []
  let renderer, p, r

  // automatically update the scene if the simulation is not changing
  const shouldUpdate = (pixelCounts) => {
    if (lastPixelCounts.length == 10 && lastPixelCounts.every((v, i) => v === pixelCounts)) {
      lastPixelCounts = []
      return true
    } else {
      lastPixelCounts.push(pixelCounts)
      if (lastPixelCounts.length > 10) {
        lastPixelCounts.shift()
      }
    }
  }

  const ruleForName = (name) => {
    switch (name) {
      case 'Conway':
        return 'B3/S23'
      case 'Brian':
        return 'B1/S12'
      case 'Highlife':
        return 'B36/S23'
      case 'Seeds':
        return 'B2/S'
      default:
        return 'B3/S23'
    }
  }

  scene.once('loaded', async () => {
    renderer = new PixelManipulator.Ctx2dRenderer(scene.canvas)
    p = new PixelManipulator.PixelManipulator(renderer, scene.width, scene.height)
    r = p.addElement({
      name: 'rules',
      ...PixelManipulator.rules.lifelike(p, ruleForName(rule)), // same pattern as seeds
      renderAs: [255, 255, 255]
    })
    p.randomlyFill(r, fill)
  })

  scene.useLoop(() => {
    p.iterate()
    renderer.update()
    const count = p.pixelCounts['1']
    if (shouldUpdate(count)) {
      p.randomlyFill(r, fill)
    }
  })

  return scene;
}

export { image as scene, schema }
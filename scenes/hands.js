import { createScene, GestureEmitter } from 'flipdisc-server'
import * as particles from '@pixi/particle-emitter'
import { Graphics } from '@pixi/node'

const defaults = {
  url: 'https://upload.wikimedia.org/wikipedia/en/thumb/7/72/IggyPopLustForLife.jpg/220px-IggyPopLustForLife.jpg',
}

const schema = {
  title: 'Hands',
  description: 'various hand-tracking effects',
  properties: {
    url: {
      type: 'string',
      default: defaults.url,
    },
  }
}

const createEmitter = (app) => {
  const graphics = new Graphics();
  graphics.beginFill(0xFFFFFF);
  graphics.drawRect(0, 0, 4, 4);
  graphics.endFill();

  // Generate a texture from the graphics
  const shapeTexture = app.renderer.generateTexture(graphics);
  return new particles.Emitter(
    app.stage,
    {
      lifetime: {
          min: 0.25,
          max: 0.5
      },
      frequency: 0.003,
      emitterLifetime: 0,
      maxParticles: 1000,
      pos: {
          x: 0,
          y: 0
      },
      addAtBack: false,
      behaviors: [      
            {
              type: 'alpha',
              config: {
                  alpha: {
                      list: [
                          {
                              value: 1,
                              time: 0
                          },
                          {
                              value: 0,
                              time: 1
                          }
                      ],
                  },
              }
          },
          {
              type: 'scale',
              config: {
                  scale: {
                      list: [
                          {
                              value: 1,
                              time: 0
                          },
                          {
                              value: 0,
                              time: 1
                          }
                      ],
                  },
              }
          },
          {
              type: 'moveSpeed',
              config: {
                  speed: {
                      list: [
                          {
                              value: 100,
                              time: 0
                          },
                          {
                              value: 10,
                              time: 1
                          }
                      ],
                      isStepped: false
                  },
              }
          },
          {
              type: 'rotationStatic',
              config: {
                  min: 0,
                  max: 360
              }
          },
          {
              type: 'spawnShape',
              config: {
                  type: 'torus',
                  data: {
                      x: 0,
                      y: 0,
                      radius: 10
                  }
              }
          },
          {
            type: 'textureSingle',
            config: {
                texture: shapeTexture
            }
          }
      ],
  }
  );
}

const hands = async function(options) {
  options = { ...defaults, ...options };
  const { url } = options;
  const scene = new createScene();
  const e = new GestureEmitter()
  scene.addModule(e)

  let emitter;
  e.on('move', data => {
    if (!emitter) return
    const { x, y } = data.position
    emitter.updateSpawnPos(x * 84, y * 42)
  })

  scene.once('loaded', async () => {
    emitter = createEmitter(scene.pixi.app)
    emitter.emit = true
  })

  var elapsed = Date.now();
  scene.useLoop((_, clock) => {
    if (!emitter) return

    var now = Date.now();

    // The emitter requires the elapsed
    // number of seconds since the last update
    emitter.update((now - elapsed) * 0.001);
  })

  return scene;
}

export { hands as scene, schema }
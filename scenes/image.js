import { createScene, ImageView } from 'flipdisc-server'


const defaults = {
  url: 'https://upload.wikimedia.org/wikipedia/en/thumb/7/72/IggyPopLustForLife.jpg/220px-IggyPopLustForLife.jpg',
}

const schema = {
  title: 'Image',
  description: 'displaying an image',
  properties: {
    url: {
      type: 'string',
      default: defaults.url,
    },
  }
}

const image = async function(options) {
  options = { ...defaults, ...options };
  const { url } = options;
  const scene = new createScene();
  let img

  scene.once('loaded', async () => {
    img = new ImageView(url)
    img.fitWidth()
    scene.add(img)
  })

  return scene;
}

export { image as scene, schema }
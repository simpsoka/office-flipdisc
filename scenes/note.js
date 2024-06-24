import { createScene, TextView } from 'flipdisc-server'

const defaults = {
  text: 'hello world',
  fontName: 'cg',
}

const schema = {
  title: 'Note',
  description: 'A simple note widget that displays text.',
  properties: {
    text: {
      type: 'string',
      default: defaults.text,
    },
    fontName: {
      type: 'enum',
      default: defaults.fontName,
      values: ['cg', 'tb-8', 'tom-thumb']
    }
  }
}

const note = async function(props) {
  props = { ...defaults, ...props };
  const { text, fontName } = props; 
  const scene = createScene()

  scene.once('loaded', async () => {
    const textView = new TextView(text, {fontName: fontName})
    scene.add(textView)
  })

  return scene;
}



export { note as scene, schema }

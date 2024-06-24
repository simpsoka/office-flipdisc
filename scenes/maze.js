import { createScene } from 'flipdisc-server'
// import { Maze } from "@thewizardbear/maze_generator";

const defaults = {
  url: 'https://upload.wikimedia.org/wikipedia/en/thumb/7/72/IggyPopLustForLife.jpg/220px-IggyPopLustForLife.jpg',
}

const schema = {
  title: 'Maze',
  description: 'generate a maze and display it on the flipdisc',
  properties: {
    url: {
      type: 'string',
      default: defaults.url,
    },
  }
}

const maze = async function(options) {
  options = { ...defaults, ...options };
  const { url } = options;
  const scene = new createScene();

  const randomBetween = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  scene.once('loaded', async () => {
    // const kruskalMaze = new Maze({
    //   width: randomBetween(10, 20),
    //   height: randomBetween(5, 10),
    //   seed: randomBetween(0, 1000),
    //   algorithm: "recursive backtracker"
    // }).generate();
    
    // kruskalMaze.display({
    //   canvas: scene.canvas,
    //   colorScheme: 'grayscale',
    //   backgroundColor: 'black',
    //   mainColor: 'white',
    //   lineThickness: 0.5,
    //   asLines: true
    // })
    scene.render();
  })



  return scene;
}

export { maze as scene, schema }
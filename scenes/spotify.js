import { createScene, createTask, CardView, ProgressBarView } from 'flipdisc-server'
import { getCurrentlyPlayingTrack } from '../src/spotify/api.js';

// task to fetch the currently playing track from Spotify, and set scene if playing
const task = createTask(async () => {
  const basePath = process.cwd();
  const api = await import(`${basePath}/src/spotify/api.js`);
  const current = await api.getCurrentlyPlayingTrack();
  if (current?.is_playing) {
    return {
      props: {
        playing: current,
      },
      wait: false
    }
  }
}, 'every 10 minutes')

const defaults = {
  url: 'https://upload.wikimedia.org/wikipedia/en/thumb/7/72/IggyPopLustForLife.jpg/220px-IggyPopLustForLife.jpg',
}

const schema = {
  title: 'Spotify',
  description: 'scene for displaying a Spotify album cover',
  properties: {
    url: {
      type: 'string',
      default: defaults.url,
    },
  }
}

const spotify = async function(options) {
  options = { ...defaults, ...options };
  let card, playing, progressBar;
  const scene = createScene();

  const createViews = playing => {
    card = new CardView(playing)

    scene.add(card).then(() => {
      progressBar = new ProgressBarView(39)
      card.contentView.addChild(progressBar)
    })
  }

  scene.useLoop(async () => {
    playing = await getCurrentlyPlayingTrack();

    if (!playing) return
    if (!card) return createViews(playing)
    if (card.ready) {
      card.set(playing)

      if (progressBar) {
        progressBar.progress = (playing.elapsed / playing.duration)
      }
    }
  }, 1/3)

  return scene;
}

export { spotify as scene, schema, task }
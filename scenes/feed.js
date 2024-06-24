import { createScene, ListView } from 'flipdisc-server'
import { extract } from '@extractus/feed-extractor'

const sources = ['US', 'World', 'Business', 'Technology', 'Science', 'Health', 'Sports', 'Arts', 
'Books', 'Movies', 'Theater', 'Fashion', 'Food', 'Travel', 'MostViewed', 'MostShared', 'Random']

const defaults = {
  source: 'US',
  readDelay: 30
}

const schema = {
  title: 'NewsFeed',
  description: 'displaying a news feed from an RSS feed',
  properties: {
    source: {
      type: 'enum',
      default: defaults.source,
      values: sources
    },
    readDelay: {
      type: 'integer',
      default: defaults.readDelay,
      min: 30,
      step: 5,
      max: 200
    }
  }
}

const nytFeedForName = name => {
  return 'https://rss.nytimes.com/services/xml/rss/nyt/' + name + '.xml'
}

const feed = async function(options) {
  options = { ...defaults, ...options };
  const { source, readDelay } = options;
  const scene = new createScene();
  let feedItems, list
  let i = 1

  scene.once('loaded', async () => {
    const url = source == 'Random' ? nytFeedForName(sources[Math.floor(Math.random() * sources.length)]) : nytFeedForName(source)
    feedItems = await extract(url)
    list = new ListView(feedItems.entries, {
      title: 'title'
    }, {
      title: 'https://i.imgur.com/2GaV8n1.png'
    })
    scene.add(list)
  })

  scene.useLoop(async () => {
    if (!feedItems) return
    if (i >= feedItems.entries.length) i = 0
    if (list.ready) list.scrollTo(i++)
  }, 1/readDelay)

  return scene;
}

export { feed as scene, schema }
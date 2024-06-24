import { createScene, TextView } from 'flipdisc-server'

const schema = {
  title: 'Clock',
  description: 'A simple clock widget that displays the current time.'
}

const clock = function() {

  const padded = (n) => {
    return n < 10 ? `0${n}` : n;
  }
  
  const scene = new createScene();
  const userPrefers12HourFormat = true;
  const textStyle = {
    fontName: 'Futura',
    fontSize: 28,
  }
  // scene.loadFonts();

  const getTime = () => {
    const date = new Date();
    const hours = date.getHours();
    const minutes = padded(date.getMinutes());
    let time;

    // Check user's preference for time format
    if (userPrefers12HourFormat) {
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const twelveHour = hours % 12 || 12;
      time = `${twelveHour}:${minutes}`;
    } else {
      time = `${hours}:${minutes}`;
    }
    return time;
  }

  let textView;
  scene.once('loaded', () => {
    textView = new TextView(getTime(), textStyle)
    textView.setLayout({
      width: scene.width,
      justifyContent: 'center',
      alignContent: 'center'
    })
    scene.add(textView)
  })

  scene.useLoop(i => {
    textView.text = getTime()
  }, 1/6) 

  return scene;
}

export { clock as scene, schema }
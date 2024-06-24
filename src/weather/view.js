import { BaseView, TextView, BackgroundTextView } from 'flipdisc-server'; 
import * as PIXI from '@pixi/node';
import { gsap } from 'gsap';

BaseView.registerPIXI(PIXI, gsap);

export default class WeatherView extends BaseView {
  async initialize(text, percent) {
    this._percent = percent;

    const width = BaseView.baseSize().width;
    this.view = new BackgroundTextView(text)
    this.radius = 30

    const circle = new PIXI.Graphics();
    circle.beginFill('#606060', 1)
    circle.drawCircle(width / 2, -this.radius * 2, this.radius);
    circle.endFill();
    this.circle = circle;

    this.view.background.addChild(this.circle);
    this.addChild(this.view);
    this.update(percent, 2);
  }

  percentToRange(percentage, min, max) {
    return min + (percentage / 100) * (max - min);
  }

  update(percent, duration = 0.2) {
    const diameter = this.radius * 2; 
    const position = this.percentToRange(percent, 0, diameter * 2);
    const color = this.percentToRange(percent, 70, 100);

    gsap.to(this.circle, {
      pixi: { y: position, fillColor: `hsl(+=0, -=${color}%, +=${color}%)` }, 
        duration
      }
    );
  }

  set text(text) {
    this._text = text;
    this.view.textView.text = text;
  }
}
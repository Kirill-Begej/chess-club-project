import { stageSlider } from '../components/stagesSlider.js';

const stagesElement = document.querySelector('.stages');

new stageSlider(
  stagesElement,
  [
    stageSlider.actionLeft(
      stagesElement.querySelector('.button[name=left]')
    ),
    stageSlider.actionRight(
      stagesElement.querySelector('.button[name=right]')
    )
  ]
);
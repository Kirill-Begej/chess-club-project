import { StageSlider } from '../components/StagesSlider.js';
import { MembersSlider } from '../components/MembersSlider.js';

const stagesElement = document.querySelector('.stages');
const membersElement = document.querySelector('.members');

new StageSlider(
  stagesElement,
  [
    StageSlider.actionLeft(
      stagesElement.querySelector('.button[name=left]')
    ),
    StageSlider.actionRight(
      stagesElement.querySelector('.button[name=right]')
    )
  ]
);

new MembersSlider(
  membersElement,
  [
    MembersSlider.actionLeft(
      membersElement.querySelector('.button[name=left]')
    ),
    MembersSlider.actionRight(
      membersElement.querySelector('.button[name=right]')
    )
  ]
);
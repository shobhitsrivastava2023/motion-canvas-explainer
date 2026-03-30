import {makeProject} from '@motion-canvas/core';

import ideExplainer from './scenes/ideExplainer?scene';
import infiniteScroll from './scenes/infinite-scroll?scene';

export default makeProject({
  scenes: [infiniteScroll],
});

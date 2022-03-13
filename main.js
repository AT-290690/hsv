import cell from './parser/parser.js';
import { std, processing } from './extentions/composition.js';
import { DEPENDENCY_LIST } from './extentions/dependencies.js';

import { decodeUrl } from './commands/utils.js';

export const State = {
  timer: null,
  drawMode: undefined,
  activeWindow: null,
  P5: null,
  currentCanvas: { w: 0, h: 0 }
};

export const canvasContainer = document.getElementById('canvas-container');
State.activeWindow = canvasContainer;
const createP5 = () => {
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.has('s')) {
    decodeUrl(
      window.location.search.split('?s=')[1].trim(),
      DEPENDENCY_LIST,
      url => {
        State.P5 = new p5(engine => {
          const { result } = cell({ ...std, ...processing(engine) })(
            `=> (
              ${url}
            )`
          );
          return result;
        });
      }
    );
  }
};
setTimeout(() => {
  document.body.removeChild(document.getElementById('splash-screen'));
  createP5();
}, 1000);

window.addEventListener('resize', () => {
  if (State.P5) {
    let id = setTimeout(function () {}, 0);
    while (id--) clearTimeout(id);
    cancelAnimationFrame(State.P5.draw);
    State.P5.remove();
    State.P5 = null;
  }
  if (State.timer) clearTimeout(State.timer);
  State.timer = setTimeout(() => {
    createP5();
    const canv = State.P5.createCanvas(
      State.currentCanvas.w,
      State.currentCanvas.h,
      State.drawMode
    );
    canv.parent('canvas-container');
  }, 100);
});

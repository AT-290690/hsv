import cell from './parser/parser.js';
import { std, processing } from './extentions/composition.js';
import { DEPENDENCY_LIST } from './extentions/dependencies.js';

import { decodeUrl } from './commands/utils.js';

export const State = {
  list: {},
  lastSelection: '',
  drawMode: undefined,
  AST: {},
  activeWindow: null
};

export const canvasContainer = document.getElementById('canvas-container');
State.activeWindow = canvasContainer;

setTimeout(() => {
  document.body.removeChild(document.getElementById('splash-screen'));
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.has('s')) {
    decodeUrl(
      window.location.search.split('?s=')[1].trim(),
      DEPENDENCY_LIST,
      url => {
        new p5(engine => {
          const { result, env, AST } = cell({ ...std, ...processing(engine) })(
            `=> (
              ${url}
            )`
          );
          State.list = env;
          State.AST = AST;
          return result;
        });
      }
    );
  }
}, 1000);

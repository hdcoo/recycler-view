import './app.css';

import { Recycler } from '../dist/recycler-view';
import MyRenderer from "./MyRenderer";
import MySource from "./MySource";

const mySource = new MySource();
const myRenderer = new MyRenderer();

const recycler = new Recycler(
  document.getElementById('scroller'),
  mySource,
  {
    renderer: myRenderer
  }
);

recycler.on(Recycler.Events.Initialized, async () => {
  await mySource.fetch();
  myRenderer.mount(recycler);
  recycler.update();
});

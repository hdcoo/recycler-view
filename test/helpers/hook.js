import { initBody } from "./util";

export default function hook({createRecycler, destroy, el}) {
  initBody(el);
  
  beforeEach(function () {
    this.recycler = createRecycler();
    if (!this.getRunway) {
      this.getRunway = function () {
        return this.recycler.getCurrentRunway();
      }
    }
  });
  
  afterEach(function () {
    this.recycler.destroy();
  });
  
  afterAll(function () {
    destroy();
  });
}
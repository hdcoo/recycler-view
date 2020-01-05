import axios from 'axios';
import { Source } from '../dist/recycler-view';

export default class MySource extends Source {
  constructor() {
    super();
    
    this.page = 1;
    this.data = [];
  }
  
  getData(index, recycler) {
    return this.data[index];
  }
  
  getHeight(index, recycler) {
    return 220;
  }
  
  getWidth(index, recycler) {
    return '100%';
  }
  
  getScrollTop(index, recycler) {
    return index * this.getHeight();
  }
  
  getMaxScrollHeight(recycler) {
    return this.getHeight() * this.getLength();
  }
  
  getLength(recycler) {
    return this.data.length;
  }
  
  async fetch() {
    try {
      const {data} = await axios.get(`https://pixabay.com/api/?key=14741538-07bfbe050f78a17f4e7175410&q=flowers&image_type=photo&page=${this.page}`);
      
      this.page += 1;
      
      for (const item of data.hits) {
        this.data.push({
          src: item.previewURL,
          width: item.imageWidth,
          height: item.imageHeight,
        });
      }
      
      return true;
    } catch (e) {
      return false;
    }
  }
}

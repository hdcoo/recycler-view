import EventEmitter from "src/helpers/EventEmitter";

describe('EventEmitter', function () {
  beforeEach(function () {
    this.flag = 0;
    this.eventEmitter = new EventEmitter();
  });
  
  it('handler should be called', function () {
    const { eventEmitter } = this;
    
    eventEmitter.on('test', () => this.flag += 1);
    eventEmitter.emit('test');
    
    expect(this.flag).toBe(1);
    
    eventEmitter.on('test', () => this.flag += 1);
    eventEmitter.emit('test');
    
    expect(this.flag).toBe(3);
  });
  
  it('handler should be removed', function () {
    const { eventEmitter } = this;
  
    eventEmitter.on('test', () => this.flag += 1);
    eventEmitter.off('test');
    eventEmitter.emit('test');
  
    expect(this.flag).toBe(0);
  
    eventEmitter.on('test', () => this.flag += 1);
    eventEmitter.on('test1', () => this.flag += 1);
    eventEmitter.off();
    eventEmitter.emit('test');
    eventEmitter.emit('test1');
  
    expect(this.flag).toBe(0);
  });
});

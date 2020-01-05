import TinyMap from "../src/helpers/TinyMap";

describe('TinyMap', function () {
  beforeEach(function () {
    this.a = {value: 1};
    this.b = {value: 2};
    this.c = {value: 3};
    this.d = {value: 4};
    this.tinyMap = new TinyMap([
      [this.a, this.a.value],
      [this.b, this.b.value]
    ]);
  });

  it('init should work well', function () {
    expect(this.tinyMap.size).toBe(2);
  });

  it('get should work well', function () {
    expect(this.tinyMap.get(this.a)).toBe(1);
    expect(this.tinyMap.get(this.b)).toBe(2);
  });

  it('has should work well', function () {
    expect(this.tinyMap.has(this.a)).toBe(true);
    expect(this.tinyMap.has(this.c)).toBe(false);
  });

  it('delete should work well', function () {
    expect(this.tinyMap.delete(this.b)).toBe(true);
    expect(this.tinyMap.delete(this.c)).toBe(false);
    expect(this.tinyMap.has(this.b)).toBe(false);
    expect(this.tinyMap.size).toBe(1);
  });

  it('set should work well', function () {
    this.tinyMap.set(this.c, this.c.value);
    expect(this.tinyMap.size).toBe(3);
    expect(this.tinyMap.has(this.c)).toBe(true);
  });

  it('map should work well', function () {
    let i = 0;
    const { tinyMap, a, b, c, d } = this;
    const order = [a, b, d, c];

    tinyMap.set(d, d.value);
    tinyMap.set(c, c.value);

    tinyMap.map((key, value) => {
      expect(order[i++].value).toBe(value);
    })
  });

  it('integrated test', function () {
    let i = 0;
    const { tinyMap, a, b, c, d } = this;
    const order = [d, b, a, c];

    tinyMap.set(d, d.value);
    tinyMap.set(c, c.value);
    tinyMap.set(a, a.value);
    tinyMap.set(b, b.value);

    expect(tinyMap.size).toBe(4);

    tinyMap.delete(a);
    tinyMap.delete(c);

    expect(tinyMap.size).toBe(2);

    tinyMap.delete(b);
    tinyMap.delete(d);
    tinyMap.delete(a);
    tinyMap.delete(null);
    tinyMap.delete({});
    tinyMap.delete(23);

    expect(tinyMap.size).toBe(0);

    tinyMap.set(d, d.value);
    tinyMap.set(b, b.value);

    expect(tinyMap.size).toBe(2);
    expect(tinyMap.has(a)).toBe(false);

    tinyMap.set(a, a.value);
    tinyMap.set(c, c.value);

    tinyMap.map((key, value) => {
      expect(order[i++].value).toBe(value);
      tinyMap.delete(key);
    });

    expect(tinyMap.size).toBe(0);
  });
});

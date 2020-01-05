import TinySet from "src/helpers/TinySet";

describe('TinySet', function () {
  beforeEach(function () {
    this.a = {value: 1};
    this.b = {value: 2};
    this.c = {value: 3};
    this.d = {value: 4};
    this.tinySet = new TinySet([this.a, this.b]);
  });

  it('init should work well', function () {
    expect(this.tinySet.size).toBe(2);
  });

  it('add should work well', function () {
    this.tinySet.add(this.c);
    expect(this.tinySet.size).toBe(3);
    this.tinySet.add(this.a);
    expect(this.tinySet.size).toBe(3);
  });

  it('has should work well', function () {
    expect(this.tinySet.has(this.a)).toBe(true);
    expect(this.tinySet.has(this.b)).toBe(true);
    expect(this.tinySet.has(this.d)).toBe(false);
  });

  it('delete should work well',function () {
    this.tinySet.delete(this.b);
    expect(this.tinySet.size).toBe(1);
    this.tinySet.delete(this.a);
    expect(this.tinySet.size).toBe(0);
    expect(this.tinySet.delete(this.a)).toBe(false);
  });

  it('map should work well', function () {
    let i = 0;
    const order = [this.a, this.b, this.d, this.c];
    this.tinySet.add(this.d);
    this.tinySet.add(this.c);
    this.tinySet.map((item) => {
      expect(order[i++].value).toBe(item.value);
    })
  });

  it('edge case', function () {
    const { tinySet } = this;

    expect(tinySet.add(null)).toBe(false);
    expect(tinySet.add(1)).toBe(false);
    expect(tinySet.add('1')).toBe(false);
    expect(tinySet.add(true)).toBe(false);
    expect(tinySet.add(Symbol())).toBe(false);
    expect(tinySet.add(BigInt(23434))).toBe(false);
    expect(tinySet.add()).toBe(false);

    expect(tinySet.size).toBe(2);
  });

  it('integrated test', function () {
    const { tinySet, a, b, c, d } = this;

    tinySet.add(c);
    tinySet.add(d);
    tinySet.add(a);
    tinySet.add(d);

    expect(tinySet.size).toBe(4);

    tinySet.delete(a);
    tinySet.delete(c);

    expect(tinySet.size).toBe(2);

    tinySet.delete(d);
    tinySet.delete(b);
    tinySet.delete(a);
    tinySet.delete(c);
    tinySet.delete({value: 5});

    expect(tinySet.size).toBe(0);

    tinySet.add(d);
    tinySet.add(a);

    expect(tinySet.size).toBe(2);

    tinySet.add(c);
    tinySet.add(b);
    tinySet.add(1);
    tinySet.add(null);
    tinySet.add();

    expect(tinySet.has(a)).toBe(true);
    expect(tinySet.has({value: 1})).toBe(false);
    expect(tinySet.size).toBe(4);

    let i = 0;
    const order = [d, a, c, b];

    tinySet.map((item) => {
      expect(order[i++].value).toBe(item.value);
      tinySet.delete(item);
    });

    expect(tinySet.size).toBe(0);
  });
});

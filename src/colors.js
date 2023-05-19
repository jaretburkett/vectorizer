import hexRgb from './lib/hexRgb';

const colors = [
  {
    name: 'White',
    hex: 'e5e8fd',
    rgba: {
      r: 229,
      g: 232,
      b: 253,
      a: 1,
    },
  },
  {
    name: 'Silver',
    hex: 'aeb0ae',
    rgba: {
      r: 174,
      g: 176,
      b: 174,
      a: 1,
    },
  },
  {
    name: 'Grey',
    hex: '8d9093',
    rgba: {
      r: 141,
      g: 144,
      b: 147,
      a: 1,
    },
  },
  {
    name: 'Black',
    hex: '26282a',
    rgba: {
      r: 38,
      g: 40,
      b: 42,
      a: 1,
    },
  },
  {
    name: 'Light Blue',
    hex: '85abc5',
    rgba: {
      r: 133,
      g: 171,
      b: 197,
      a: 1,
    },
  },
  {
    name: 'Royal Blue',
    hex: '0072bc',
    rgba: {
      r: 0,
      g: 114,
      b: 188,
      a: 1,
    },
  },
  {
    name: 'Navy',
    hex: '212a42',
    rgba: {
      r: 33,
      g: 42,
      b: 66,
      a: 1,
    },
  },
  {
    name: 'Kelly Green',
    hex: '41894b',
    rgba: {
      r: 65,
      g: 137,
      b: 75,
      a: 1,
    },
  },
  {
    name: 'Hunter Green',
    hex: '2a5642',
    rgba: {
      r: 42,
      g: 86,
      b: 66,
      a: 1,
    },
  },
  {
    name: 'Red',
    hex: 'ed1c24',
    rgba: {
      r: 237,
      g: 28,
      b: 36,
      a: 1,
    },
  },
  {
    name: 'Pink',
    hex: 'c76794',
    rgba: {
      r: 199,
      g: 103,
      b: 148,
      a: 1,
    },
  },
  {
    name: 'Purple',
    hex: '493571',
    rgba: {
      r: 73,
      g: 53,
      b: 113,
      a: 1,
    },
  },
  {
    name: 'Yellow',
    hex: 'e8aa4c',
    rgba: {
      r: 232,
      g: 170,
      b: 76,
      a: 1,
    },
  },
  {
    name: 'Gold',
    hex: 'cda871',
    rgba: {
      r: 205,
      g: 168,
      b: 113,
      a: 1,
    },
  },
  {
    name: 'Orange',
    hex: 'da5f3d',
    rgba: {
      r: 218,
      g: 95,
      b: 61,
      a: 1,
    },
  },
];

// // add the hex to the colors
// for(let i = 0; i < colors.length; i++) {
//     colors[i].rgba = hexRgb(colors[i].hex);
// }

console.log(JSON.stringify(colors, null, 2));

export default colors;

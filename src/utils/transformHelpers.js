
const properties = [
  { name: 'translateX', unit: 'length' },
  { name: 'translateY', unit: 'length' },
  { name: 'perspective', unit: 'length' },
  { name: 'translateZ', unit: 'length' },
  { name: 'skew', unit: 'angle' },
  { name: 'skewX', unit: 'angle' },
  { name: 'skewY', unit: 'angle' },
  { name: 'scale' },
  { name: 'scaleX' },
  { name: 'scaleY' },
  { name: 'scaleZ' },
  { name: 'rotate', unit: 'angle' },
  { name: 'rotateX', unit: 'angle' },
  { name: 'rotateY', unit: 'angle' }
];

export const defaultUnits = {
  length: 'px',
  angle: 'deg'
};

export const positionToProperties = position => ({
  translateX: position[0],
  translateY: position[1]
});

export const buildTransform = (style, perspective, units) => {
  const arr = [];

  properties.forEach(prop => {
    if (prop.name === 'perspective') {
      if (typeof perspective !== 'undefined') {
        arr.push('perspective(' + perspective + units[prop.unit] + ')');
      }
    } else if (typeof style[prop.name] !== 'undefined') {
      arr.push(prop.name + '(' + style[prop.name] +
                (prop.unit ? units[prop.unit] : '') + ')');
    }
  });

  return arr.join(' ');
};

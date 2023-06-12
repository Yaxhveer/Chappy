const generateDiceBear = ( type, seed) =>
  `https://api.dicebear.com/6.x/${type}/svg?seed=${seed};`

let value = [ 'icons', 'thumbs', 'adventurer-neutral' ];

export const generateAvatar = () => {
  const data = [];

  for (let i = 0; i < 16; i++) {
    const res = generateDiceBear( value[Math.round(Math.random()*2)], Math.random());
    data.push(res);
  }
  return data;
};

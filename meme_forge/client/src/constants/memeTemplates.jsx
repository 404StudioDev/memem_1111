import images from '../constants/images.json';

export const MEME_TEMPLATES = images.map((url) => ({
  name: url.split('/').pop().split('.')[0], // filename se naam banayega
  url: url
}));

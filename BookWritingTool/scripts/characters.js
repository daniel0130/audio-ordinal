// scripts/characters.js

import { generateId } from './utils.js';

export function addCharacter(bookData, name, bio) {
  const newCharacter = {
    id: generateId('character_'),
    name: name,
    bio: bio,
    timeline: []
  };
  bookData.book.characters.push(newCharacter);
}

export function getCharacters(bookData) {
  return bookData.book.characters;
}

// scripts/chapters.js

import { generateId } from './utils.js';

export function addChapter(bookData, title, summary, content) {
  const newChapter = {
    id: generateId('chapter_'),
    chapter_number: bookData.book.chapters.length + 1,
    title: title,
    summary: summary,
    content: content,
    context: {
      setting: "",
      events: "",
      linked_chapters: [],
      timeline_references: []
    },
    character_references: []
  };
  bookData.book.chapters.push(newChapter);
}

export function getChapters(bookData) {
  return bookData.book.chapters;
}

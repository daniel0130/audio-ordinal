// scripts/bookMetadata.js

export function updateBookMetadata(bookData, title, synopsis) {
    bookData.book.title = title;
    bookData.book.synopsis = synopsis;
  }
  
  export function getBookMetadata(bookData) {
    return {
      title: bookData.book.title,
      synopsis: bookData.book.synopsis
    };
  }
  
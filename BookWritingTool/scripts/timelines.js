// scripts/timelines.js

import { generateId, sortEventsChronologically } from './utils.js';

export function addTimelineEvent(bookData, title, date, eventDesc) {
  // Check if timeline with the given title exists
  let timeline = bookData.book.timelines.find(tl => tl.title.toLowerCase() === title.toLowerCase());
  
  if (!timeline) {
    // Create a new timeline
    timeline = {
      id: generateId('timeline_'),
      title: title,
      events: []
    };
    bookData.book.timelines.push(timeline);
  }

  // Add the new event
  timeline.events.push({
    date: date,
    event: eventDesc
  });

  // Sort events chronologically
  timeline.events = sortEventsChronologically(timeline.events);
}

export function getTimelines(bookData) {
  return bookData.book.timelines;
}

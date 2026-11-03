/* Keep immutable step passages while Reveal sees only the active narration. */
(function(root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.ColloquiumStepNotes = api;
})(typeof globalThis === 'object' ? globalThis : this, function() {
  function createController(slides) {
    const records = new Map();
    for (const slide of slides) {
      const notes = slide.querySelector('aside.notes');
      if (!notes) continue;
      const passages = new Map([...notes.querySelectorAll('[data-note-step]')]
        .map(node => [Number(node.dataset.noteStep), node.outerHTML]));
      if (passages.size) records.set(slide, {notes, passages, active: null});
    }
    return {
      show(slide, step) {
        const record = records.get(slide);
        if (!record || !record.passages.has(step) || record.active === step) return false;
        record.notes.innerHTML = record.passages.get(step);
        record.active = step;
        return true;
      }
    };
  }
  return {createController};
});

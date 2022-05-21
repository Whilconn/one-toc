const eventMap = {};

export function addEvent(evtName, target, handler) {
  if (!eventMap[evtName]) eventMap[evtName] = [];
  eventMap[evtName].push({ target, handler });
  target.addEventListener(evtName, handler);
}

export function removeAllEvents() {
  Object.entries(eventMap).forEach(([evtName, events]) => {
    events.forEach(({ target, handler }) => target.removeEventListener(evtName, handler));
    eventMap[evtName] = [];
  });
}

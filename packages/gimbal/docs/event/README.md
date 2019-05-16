# Gimbal Event System

Gimbal provides a dynamic and flexible event system. Gimbal fires events that allows anything to get notified and take action on certain parts of the Gimbal execution.

## Event Listening

Events are listenable using an event name, a function and optionally an options object. The event name can be a glob pattern allowing to listen to a flexible array of events.

### Simple example

```javascript
const Event = require('@modus/gimbal/event');

Event.on('some-event', (event, data) => {
  console.log('An event fired with a name:', event);
  console.log('Event Data:', JSON.stringify(data, null, 2));
});
```

### Example with Options

```javascript
const Event = require('@modus/gimbal/event');

Event.on('all/foo/*/events', {
  priority: -10,
  fn: (event, data) => {
    console.log('An event fired with a name:', event);
    console.log('Event Data:', JSON.stringify(data, null, 2));
  },
});
```

Currently, `priority` is the only option supported. The lower the number, the higher the priority because 0 comes before 10.

### ASync Example

Listeners are executed sequentially and if one returns a promise (or uses async/await) then subsequent listeners will only execute when that promise is resolved.

```javascript
const Event = require('@modus/gimbal/event');

Event.on('all/foo/*/events', {
  priority: -10,
  fn: async (event, data) => {
    const ret = await makeSomeAsyncRequest(data);

    console.log('An event fired with a name:', event);
    console.log('Event Data:', JSON.stringify(data, null, 2));
    console.log('Response:', JSON.stringify(ret, null, 2));
  },
});
```

## Event Firing

To fire an event, you provide the event system a name and data. The data can be anything and is shared among all listeners so if one listener changes the data, the subsequent listeners will get the changes. Firing an event can be waited on all listeners to respond in case they are executed async.

```javascript
const Event = require('@modus/gimbal/event');

(async () => {
  const data = {};

  const ret = await Event.fire('all/foo/bar/events', data);

  // ret.data === data
  // ret.rets === returns from all listeners
})();
```

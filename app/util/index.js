export function countEpochTimestamps(timestamps, bucketType = 'minute') {
  const counts = {};

  timestamps.forEach((epochTimestamp) => {
    const date = new Date(epochTimestamp * 1000); // Convert epoch to milliseconds
    let key = '';

    if (bucketType === 'minute') {
      key = `${date.toISOString().substr(0, 17)}:00 -0800`;
    } else if (bucketType === 'hour') {
      key = `${date.toISOString().substr(0, 14)}:00:00 -0800`;
    } else if (bucketType === 'day') {
      key = `${date.toISOString().substr(0, 11)}00:00:00 -0800`;
    }

    counts[key] = (counts[key] || 0) + 1;
  });

  return counts;
}

export const isEmpty = s => {
  return !s || s.length === 0
}

export const countMessagesByType = (messages) => {
  const counts = {}
  messages.forEach(message => {
    const { type } = message
    counts[type] = (counts[type] || 0) + 1
  })
  const data = []
  // iterate over map keys
  Object.keys(counts).forEach(key => {
    data.push([key, counts[key]])
  });
  return data;
}

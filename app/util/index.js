export const isEmpty = s => {
  return !s || s.length === 0
}

export const formatDate = (d, timeOnly) => {
  if (!d) {
    return ''
  }
  // check date
  if (!(d instanceof Date)) {
    d = new Date(d)
  }

  return timeOnly ? d.toLocaleTimeString() : d.toLocaleString();
}

export const sortCountMap = (countMap) => {
  // countmap is date -> count
  // Sort by date ascending and return array of arrays
  const sorted = Object.keys(countMap).sort().map(key => {
    return [key, countMap[key]]
  })
  return sorted
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

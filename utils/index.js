const truncateWithEllipses = (text, max) => {
  return text.length > max ? text.slice(0, max) + '_' : text;
}


export { truncateWithEllipses }
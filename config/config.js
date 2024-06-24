const layout = [
  [13, 7, 1],
  [14, 8, 2],
  [15, 9, 3],
  [16, 10, 4],
  [17, 11, 5],
  [18, 12, 6]
]
const devices = [{
  path: '/dev/cu.usbserial-B0027K6H',
  addresses: [1, 2, 3, 4, 5, 6],
  baudRate: 57600
}, {
  path: '/dev/cu.usbserial-B0027K5M',
  addresses: [7, 8, 9, 10, 11, 12],
  baudRate: 57600
}, {
  path: '/dev/cu.usbserial-B002S99J',
  addresses: [13, 14, 15, 16, 17, 18],
  baudRate: 57600
}]

const options = {
  isMirrored: true
}

export { layout, devices, options }
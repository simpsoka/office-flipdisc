import { Display, createServer } from 'flipdisc-server'
import { layout, devices, options } from './config/config.js'

Display.configure(layout, devices, options)
const app = createServer()
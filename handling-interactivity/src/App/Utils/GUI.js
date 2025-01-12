import { Pane } from 'tweakpane'

export default class GUI {
  constructor() {
    const pane = new Pane()
    this.pane = pane.addFolder({ title: 'GUI', expanded: false })
  }
}

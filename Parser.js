module.exports = class Parser {
  parseString(string) {
    if(string.search(/\n\nyear\nmmdd\nEvent description\nEvent type\n\n\n/g) !== -1){
      return string.replace(/\n\nyear\nmmdd\nEvent description\nEvent type\n\n\n/g, '').replace(/\n\n$/g, '').split('\n')
    }
    else {
      return []
    }
  }
}

module.exports = class Parser {
  parseString(string) {
    const dataString = string.replace(/\n\nyear\nmmdd\nEvent description\nEvent type\n\n\n/g, '').replace(/\n\n$/g, '')
    return dataString.split('\n')
  }

}


//TODO error handling for parseString when cannot identify text format
//TODO error handling when dataArray is nil

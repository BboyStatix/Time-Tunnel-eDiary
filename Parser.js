module.exports = class Parser {
  parseDocString(string) {
    if(string.search(/\n\nyear\nmmdd\nEvent description\nEvent type\n\n\n/g) !== -1){
      return string.replace(/\n\nyear\nmmdd\nEvent description\nEvent type\n\n\n/g, '').replace(/\n\n$/g, '').split('\n')
    }
    else {
      return []
    }
  }

  parseAudioString(string) {
    const parsedAudioHash = getParsedAudioHash(string)
    return parsedAudioHash

  }
}

function getParsedAudioHash(string){
  const audioHash = {}

  if(string.search(/^{[0-9]*}[[0-9]*]_{[0-9]*}\([0-9]*\)[[0-9]*]\([0-9]*\)_.*\ \ \[.*]_.*/g) !== -1){
    audioHash.usChartDate = string.substring(1, string.indexOf('}'))
    audioHash.usPeakPosition = string.substring(string.indexOf('_{')+2, string.indexOf('}('))
    audioHash.usPeakNumOfWeeks = string.substring(string.indexOf('}(')+2, string.indexOf(')['))

    audioHash.ukChartDate = string.substring(string.indexOf('[')+1, string.indexOf(']'))
    audioHash.ukPeakPosition = string.substring(string.indexOf(')[')+2, string.indexOf(']('))
    audioHash.ukPeakNumOfWeeks = string.substring(string.indexOf('](')+2, string.indexOf(')_'))

    audioHash.name = string.substring(string.indexOf(')_')+2, string.indexOf('\ \ ['))
    audioHash.information = string.substring(string.indexOf('\ \ [')+3, string.search(/]_[^{]/g))
    audioHash.artist = string.substring(string.search(/]_[^{]/g)+2, string.indexOf('.'))
  }
  else if(string.search(/^{[0-9]*}[[0-9]*]_{[0-9]*}\([0-9]*\)[[0-9]*]\([0-9]*\)_.*_.*/g) !== -1){
    audioHash.usChartDate = string.substring(1, string.indexOf('}'))
    audioHash.usPeakPosition = string.substring(string.indexOf('_{')+2, string.indexOf('}('))
    audioHash.usPeakNumOfWeeks = string.substring(string.indexOf('}(')+2, string.indexOf(')['))

    audioHash.ukChartDate = string.substring(string.indexOf('[')+1, string.indexOf(']'))
    audioHash.ukPeakPosition = string.substring(string.indexOf(')[')+2, string.indexOf(']('))
    audioHash.ukPeakNumOfWeeks = string.substring(string.indexOf('](')+2, string.indexOf(')_'))

    splitStringArray = string.split('_')
    audioHash.name = splitStringArray[2]
    audioHash.artist = (splitStringArray[3]).substring(0, splitStringArray[3].indexOf('.'))
  }

  return audioHash
}

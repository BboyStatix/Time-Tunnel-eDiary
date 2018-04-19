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
    return getParsedAudioHash(string)

  }

  parsePhotoString(string) {
    return getParsedPhotoHash(string)
  }

  parseWtvString(string) {
    return getParsedWtvHash(string)
  }

  parseVideoString(string) {
    return getParsedVideoHash(string)
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
    audioHash.fileType = string.split('.')[1]
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
    audioHash.artist = splitStringArray[3].split('.')[0]
    audioHash.fileType = splitStringArray[3].split('.')[1]
  }

  return audioHash
}

function getParsedPhotoHash(string) {
  const photoHash = {}

  if(string.search(/^\(.+\)_{([0-9]{4}(-[0-9][0-9]){2}){0,1}}<.*>\(.*\)\[.*]/g) !== -1) {
    photoHash.name = string.substring(1, string.indexOf(')_'))

    const date = string.substring(string.indexOf('{')+1, string.indexOf('}'))
    if(date.length !== 0) {
      const dateObject = new Date(date)
      if (dateObject.isValid()){
        photoHash.created_at = dateObject
      }
    }

    photoHash.location = string.substring(string.indexOf('<')+1, string.indexOf('>'))
    photoHash.occasion = string.substring(string.indexOf('>(')+2, string.indexOf(')['))

    splitStringArray = string.split('.')
    const tagString = splitStringArray[0]
    const tagArray = tagString.substring(string.indexOf(')[')+2,string.indexOf('].')).split(',')
    photoHash.tags = tagArray
    photoHash.fileType = splitStringArray[1]
  }

  return photoHash
}

function getParsedWtvHash(string) {
  const wtvHash = {}

  const wtvArray = string.split('_')
  if(wtvArray.length === 8) {
    wtvHash.name = wtvArray[0]
    wtvHash.channel = wtvArray[1]

    const date = wtvArray[2] + '-' + wtvArray[3] + '-' + wtvArray[4]
    const dateObject = new Date(date)
    if (dateObject.isValid()){
      wtvHash.created_at = dateObject
    }
    wtvHash.duration = wtvArray[5] + ':' + wtvArray[6] + ':' + wtvArray[7].split('.')[0]
    wtvHash.fileType = 'wtv'
  }

  return wtvHash
}

function getParsedVideoHash(string) {
  const videoHash = {}

  if(string.search(/^\(.+\)_{([0-9]{4}(-[0-9][0-9]){2}){0,1}}<.*>\(.*\)\[.*]/g) !== -1) {
    videoHash.name = string.substring(1, string.indexOf(')_'))

    const date = string.substring(string.indexOf('{')+1, string.indexOf('}'))
    if(date.length !== 0) {
      const dateObject = new Date(date)
      if (dateObject.isValid()){
        videoHash.created_at = dateObject
      }
    }

    videoHash.actor = string.substring(string.indexOf('<')+1, string.indexOf('>'))
    videoHash.description = string.substring(string.indexOf('>(')+2, string.indexOf(')['))

    splitStringArray = string.split('.')
    const tagString = splitStringArray[0]
    const tagArray = tagString.substring(string.indexOf(')[')+2,string.indexOf('].')).split(',')
    videoHash.tags = tagArray
    videoHash.fileType = splitStringArray[1]
  }

  return videoHash
}

Date.prototype.isValid = function () {
    return this.getTime() === this.getTime()
}

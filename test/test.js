const assert = require('assert')

const Parser = require('../Parser.js')

describe('Parser', () => {
  describe('parseAudioString', () => {
    const audioParser = new Parser

    it('should parse audio string and return appropriate hash', () => {
      const audioString = '{19681100}[19681002]_{68}()[1](1)_WITH A LITTLE HELP FROM MY FRIENDS  [BY BEATLES]_JOE COCKER.mp3'
      const parsedStringHash = audioParser.parseAudioString(audioString)

      assert.equal(parsedStringHash.usChartDate, '19681100')
      assert.equal(parsedStringHash.usPeakPosition, '68')
      assert.equal(parsedStringHash.usPeakNumOfWeeks, '')

      assert.equal(parsedStringHash.ukChartDate, '19681002')
      assert.equal(parsedStringHash.ukPeakPosition, '1')
      assert.equal(parsedStringHash.ukPeakNumOfWeeks, '1')

      assert.equal(parsedStringHash.name, 'WITH A LITTLE HELP FROM MY FRIENDS')
      assert.equal(parsedStringHash.information, 'BY BEATLES')
      assert.equal(parsedStringHash.artist, 'JOE COCKER')
    })

    it('should parse audio string and return appropriate hash', () => {
      const audioString = "{}[19681106]_{}()[5]()_I'M THE URBAN SPACEMAN_BONZO DOG DOO DAH BAND.wav"
      const parsedStringHash = audioParser.parseAudioString(audioString)

      assert.equal(parsedStringHash.usChartDate, '')
      assert.equal(parsedStringHash.usPeakPosition, '')
      assert.equal(parsedStringHash.usPeakNumOfWeeks, '')

      assert.equal(parsedStringHash.ukChartDate, '19681106')
      assert.equal(parsedStringHash.ukPeakPosition, '5')
      assert.equal(parsedStringHash.ukPeakNumOfWeeks, '')

      assert.equal(parsedStringHash.name, "I'M THE URBAN SPACEMAN")
      assert.equal(parsedStringHash.artist, 'BONZO DOG DOO DAH BAND')
    })

    it('should return empty hash if inappropriate string', () => {
      var parsedStringHash = audioParser.parseAudioString('sfsafkndsafa.mp3')
      assert.deepEqual(parsedStringHash, {})
      parsedStringHash = audioParser.parseAudioString(
        "{}[]_{}[]()_test_test [aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaend]"
      )
      assert.deepEqual(parsedStringHash, {})
    })
  })
})

// {US chart entry date}[UK chart entry date]_{US peak position}(for ? weeks)[UK peak position](for ? weeks)_song name  [song information]_artist name
// ***  [song information]  - set its length = maximum length of filename
// it('should return correct data', () => {
//   testFilenameArray = [
//     "{}[19681106]_{}()[5]()_I'M THE URBAN SPACEMAN_BONZO DOG DOO DAH BAND",
//     "{}[19681106]_{}()[1](4)_LILY THE PINK_SCAFFOLD",
//     "{}[19681106]_{}()[9]()_I'M A TIGER_LULU",
//     "{}[19681120]_{}()[4]()_1-2-3 O'LEARY_DES O'CONNOR",
//     "{}[19681120]_{}()[8]()_PRIVATE NUMBER_JUDY CLAY & WILLIAM BELL",
//     "{}[19681120]_{}()[8]()_RACE WITH THE DEVIL_GUN",
//     "{}[19681127]_{}()[6]()_SABRE DANCE (LOVE)_LOVE SCULPTURE (FEAT DAVE EDMUNDS)",
//     "{19681100}[19681002]_{68}()[1](1)_WITH A LITTLE HELP FROM MY FRIENDS  [BY BEATLES]_JOE COCKER",
//     "{19681102}[]_{4}()[]()_ABRAHAM, MARTIN AND JOHN  [FOR LINCOLN, KING & KENNEDY]_DION (& BELMONTS)",
//     "{19681102}[]_{5}()[]()_WHO'S MAKING LOVE  [BY DON DAVIS, FOR ALL]_JOHNNIE TAYLOR",
//     "{19681109}[]_{2}(2)[]()_FOR ONCE IN MY LIFE_STEVIE WONDER",
//     "{19681116}[]_{3}()[]()_WICHITA LINEMAN_GLEN CAMPBELL",
//     "{19681116}[]_{5}()[]()_STORMY_CLASSICS IV FEAT DENNIS YOST",
//     "{19681116}[]_{9}()[]()_I LOVE HOW YOU LOVE ME_BOBBY VINTON",
//     "{19681123}[]_{1}(7)[1](3)_I HEARD IT THROUGH THE GRAPEVINE_MARVIN GAYE",
//     "{19681123}[]_{6}()[]()_CLOUD NINE_TEMPTATIONS",
//     "{19681123}[]_{8}()[]()_BOTH SIDES NOW  [BY JONI MITCHELL]_JUDY COLLINS",
//     "{19681123}[]_{31}()[5]()_LES BICYCLETTES DE BELSIZE_ENGELBERT HUMPERDINCK",
//     "{19681100}[19681002]_{68}()[1](1)_WITH A LITTLE HELP FROM MY FRIENDS  [BY BEATLES]_JOE COCKER"
//   ]
// })

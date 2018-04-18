const assert = require('assert')

const Parser = require('../Parser.js')

describe('Parser', () => {
  const parser = new Parser

  describe('parseAudioString', () => {

    it('should parse audio string type(with song info) and return appropriate hash', () => {
      const songArray = [
        "{19681100}[19681002]_{68}()[1](1)_WITH A LITTLE HELP FROM MY FRIENDS  [BY BEATLES]_JOE COCKER.mp3",
        "{19681102}[]_{5}()[]()_WHO'S MAKING LOVE  [BY DON DAVIS, FOR ALL]_JOHNNIE TAYLOR.mp3",
        "{19681102}[]_{4}()[]()_ABRAHAM, MARTIN AND JOHN  [FOR LINCOLN, KING & KENNEDY]_DION (& BELMONTS).mp3",
        "{19681123}[]_{8}()[]()_BOTH SIDES NOW  [BY JONI MITCHELL]_JUDY COLLINS.mp3"
      ]
      const expectationArray = [
        ['19681100', '19681002', '68', '', '1', '1', 'WITH A LITTLE HELP FROM MY FRIENDS', 'BY BEATLES', 'JOE COCKER', 'mp3'],
        ['19681102', '', '5', '', '', '', "WHO'S MAKING LOVE", 'BY DON DAVIS, FOR ALL', 'JOHNNIE TAYLOR', 'mp3'],
        ['19681102', '', '4', '', '', '', 'ABRAHAM, MARTIN AND JOHN', 'FOR LINCOLN, KING & KENNEDY', 'DION (& BELMONTS)', 'mp3'],
        ['19681123', '', '8', '', '', '', 'BOTH SIDES NOW', 'BY JONI MITCHELL', 'JUDY COLLINS', 'mp3']
      ]

      songArray.forEach((audioString, index) => {
        const parsedStringHash = parser.parseAudioString(audioString)
        const testArray = expectationArray[index]

        assert.equal(parsedStringHash.usChartDate, testArray[0])
        assert.equal(parsedStringHash.ukChartDate, testArray[1])

        assert.equal(parsedStringHash.usPeakPosition, testArray[2])
        assert.equal(parsedStringHash.usPeakNumOfWeeks, testArray[3])

        assert.equal(parsedStringHash.ukPeakPosition, testArray[4])
        assert.equal(parsedStringHash.ukPeakNumOfWeeks, testArray[5])

        assert.equal(parsedStringHash.name, testArray[6])
        assert.equal(parsedStringHash.information, testArray[7])
        assert.equal(parsedStringHash.artist, testArray[8])
        assert.equal(parsedStringHash.fileType, testArray[9])
      })
    })

    it('should parse audio string type(without song info) and return appropriate hash', () => {
      const songArray = [
        "{}[19681106]_{}()[5]()_I'M THE URBAN SPACEMAN_BONZO DOG DOO DAH BAND.mp3",
        "{}[19681106]_{}()[1](4)_LILY THE PINK_SCAFFOLD.mp3",
        "{}[19681106]_{}()[9]()_I'M A TIGER_LULU.mp3",
        "{}[19681120]_{}()[4]()_1-2-3 O'LEARY_DES O'CONNOR.mp3",
        "{}[19681120]_{}()[8]()_PRIVATE NUMBER_JUDY CLAY & WILLIAM BELL.mp3",
        "{}[19681120]_{}()[8]()_RACE WITH THE DEVIL_GUN.mp3",
        "{}[19681127]_{}()[6]()_SABRE DANCE (LOVE)_LOVE SCULPTURE (FEAT DAVE EDMUNDS).mp3",
        "{19681109}[]_{2}(2)[]()_FOR ONCE IN MY LIFE_STEVIE WONDER.mp3",
        "{19681116}[]_{3}()[]()_WICHITA LINEMAN_GLEN CAMPBELL.mp3",
        "{19681116}[]_{5}()[]()_STORMY_CLASSICS IV FEAT DENNIS YOST.mp3",
        "{19681116}[]_{9}()[]()_I LOVE HOW YOU LOVE ME_BOBBY VINTON.mp3",
        "{19681123}[]_{1}(7)[1](3)_I HEARD IT THROUGH THE GRAPEVINE_MARVIN GAYE.mp3",
        "{19681123}[]_{6}()[]()_CLOUD NINE_TEMPTATIONS.mp3",
        "{19681123}[]_{31}()[5]()_LES BICYCLETTES DE BELSIZE_ENGELBERT HUMPERDINCK.mp3"
      ]

      const expectationArray = [
        ['', '19681106', '', '', '5', '', "I'M THE URBAN SPACEMAN", "BONZO DOG DOO DAH BAND", 'mp3'],
        ['', '19681106', '', '', '1', '4', "LILY THE PINK", 'SCAFFOLD', 'mp3'],
        ['', '19681106', '', '', '9', '', "I'M A TIGER", 'LULU', 'mp3'],
        ['', '19681120', '', '', '4', '', "1-2-3 O'LEARY", "DES O'CONNOR", 'mp3'],
        ['', '19681120', '', '', '8', '', "PRIVATE NUMBER", "JUDY CLAY & WILLIAM BELL", 'mp3'],
        ['', '19681120', '', '', '8', '', "RACE WITH THE DEVIL", 'GUN', 'mp3'],
        ['', '19681127', '', '', '6', '', "SABRE DANCE (LOVE)", "LOVE SCULPTURE (FEAT DAVE EDMUNDS)", 'mp3'],
        ['19681109', '', '2', '2', '', '', "FOR ONCE IN MY LIFE", 'STEVIE WONDER', 'mp3'],
        ['19681116', '', '3', '', '', '', "WICHITA LINEMAN", 'GLEN CAMPBELL', 'mp3'],
        ['19681116', '', '5', '', '', '', "STORMY", "CLASSICS IV FEAT DENNIS YOST", 'mp3'],
        ['19681116', '', '9', '', '', '', "I LOVE HOW YOU LOVE ME", "BOBBY VINTON", 'mp3'],
        ['19681123', '', '1', '7', '1', '3', "I HEARD IT THROUGH THE GRAPEVINE", "MARVIN GAYE", 'mp3'],
        ['19681123', '', '6', '', '', '', "CLOUD NINE", 'TEMPTATIONS', 'mp3'],
        ['19681123', '', '31', '', '5', '', "LES BICYCLETTES DE BELSIZE", 'ENGELBERT HUMPERDINCK', 'mp3']
      ]

      songArray.forEach((audioString, index) => {
        const parsedStringHash = parser.parseAudioString(audioString)
        const testArray = expectationArray[index]

        assert.equal(parsedStringHash.usChartDate, testArray[0])
        assert.equal(parsedStringHash.ukChartDate, testArray[1])

        assert.equal(parsedStringHash.usPeakPosition, testArray[2])
        assert.equal(parsedStringHash.usPeakNumOfWeeks, testArray[3])

        assert.equal(parsedStringHash.ukPeakPosition, testArray[4])
        assert.equal(parsedStringHash.ukPeakNumOfWeeks, testArray[5])

        assert.equal(parsedStringHash.name, testArray[6])
        assert.equal(parsedStringHash.artist, testArray[7])
        assert.equal(parsedStringHash.fileType, testArray[8])
      })
    })

    it('should return empty hash if inappropriate string', () => {
      var parsedStringHash = parser.parseAudioString('sfsafkndsafa.jpg')
      assert.deepEqual(parsedStringHash, {})
      parsedStringHash = parser.parseAudioString(
        "{}[]_{}[]()_test_test [aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaend]"
      )
      assert.deepEqual(parsedStringHash, {})
    })
  })

  describe('parsePhotoString', () => {
    it('should return photo hash', () => {
      const photoArray = [
        "(test)_{1998-12-12}<>()[].jpg",
        "(Hiking image)_{1998-13-12}<Lantau Island>(Hiking)[Jack,Nick,Ben].png",
        "(Picture with jackie)_{1993-11-12}<Hong Kong>(On set with Jackie)[Jackie Chan,Actor].jpg"
      ]

      const expectationArray = [
        ['test', (new Date('1998-12-12')).getTime(), '', '', [''], 'jpg'],
        ['Hiking image', '', 'Lantau Island', 'Hiking', ['Jack', 'Nick', 'Ben'], 'png'],
        ['Picture with jackie', (new Date('1993-11-12')).getTime(), 'Hong Kong', 'On set with Jackie', ['Jackie Chan', 'Actor'], 'jpg']
      ]

      photoArray.forEach((photoString, index) => {
        const parsedStringHash = parser.parsePhotoString(photoString)
        const testArray = expectationArray[index]

        assert.equal(parsedStringHash.name, testArray[0])
        if(parsedStringHash.created_at !== undefined) {
          assert.equal(parsedStringHash.created_at.getTime(), testArray[1])
        }
        assert.equal(parsedStringHash.location, testArray[2])
        assert.equal(parsedStringHash.occasion, testArray[3])
        var tagsArray = testArray[4]
        for(var i = 0; i<tagsArray.length; i++) {
            assert.equal(parsedStringHash.tags[i], tagsArray[i])
        }
        assert.equal(parsedStringHash.fileType, testArray[5])
      })
    })

    it('should return empty hash if inappropriate string', () => {
      var parsedStringHash = parser.parsePhotoString('sfsafkndsafa.jpg')
      assert.deepEqual(parsedStringHash, {})
      var parsedStringHash = parser.parsePhotoString("()_{}<>()[].jpg")
      assert.deepEqual(parsedStringHash, {})
    })
  })

  describe('parseWtvString', () => {
    it('should return wtv hash', () => {
      const wtvArray = [
        "超級勁歌推介[粵]_Jade_2018_02_12_09_43_00.wtv",
        "BBC News_BBC TWO_2010_06_30_01_23_00.wtv",
        "Law and Order-SVU_Five_2008_08_12_23_36_55.wtv",
        "Law and Order-SVU_Five_2008_23_12_23_36_55.wtv"
      ]

      const expectationArray = [
        ['超級勁歌推介[粵]', 'Jade', (new Date('2018-02-12')).getTime(), '09:43:00', 'wtv'],
        ['BBC News', 'BBC TWO', (new Date('2010-06-30')).getTime(), '01:23:00', 'wtv'],
        ['Law and Order-SVU', 'Five', (new Date('2008-08-12')).getTime(), '23:36:55', 'wtv'],
        ['Law and Order-SVU', 'Five', '', '23:36:55', 'wtv']
      ]

      wtvArray.forEach((wtvString, index) => {
        const parsedStringHash = parser.parseWtvString(wtvString)
        const testArray = expectationArray[index]

        assert.equal(parsedStringHash.name, testArray[0])
        assert.equal(parsedStringHash.channel, testArray[1])
        if(parsedStringHash.created_at !== undefined) {
          assert.equal(parsedStringHash.created_at.getTime(), testArray[2])
        }
        assert.equal(parsedStringHash.duration, testArray[3])
        assert.equal(parsedStringHash.fileType, testArray[4])
      })
    })

    it('should return empty hash if inappropriate string', () => {
      var parsedStringHash = parser.parseWtvString('sfsafkndsafa.wtv')
      assert.deepEqual(parsedStringHash, {})
    })
  })
})

require! {
  '../dist/formatters/formatter-manager' : FormatterManager
  'jsdiff-console'
}


describe 'FormatterManager', ->

  before ->
    @formatter-manager = new FormatterManager

  describe 'available-formatter-names', (...) ->

    before ->
      @formatter-names = @formatter-manager.available-formatter-names!

    it 'returns the names of the available formatters', ->
      expect(@formatter-names).to.eql <[colored iconic robust]>


  describe 'get-formatter', ->

    context 'with correct formatter name', (...) ->

      before (done) ->
        @formatter-manager.get-formatter 'iconic', (@err, @result) ~> done!

      it 'returns the formatter with the given name', ->
        expect(typeof @result).to.equal 'object'

      it 'returns no error' ->
        expect(@err).to.be.null


    context 'with unknown formatter name', (...) ->

      before (done) ->
        @formatter-manager.get-formatter 'zonk', (@err, @result) ~> done!

      it 'returns no formatter', ->
        expect(@result).to.be.undefined

      it 'returns an error' ->
        jsdiff-console @err, """Unknown formatter: 'zonk'

                                Available formatters are colored, iconic, robust"""

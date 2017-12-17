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

      before ->
        @result = @formatter-manager.get-formatter 'iconic'

      it 'returns the formatter with the given name', ->
        expect(typeof @result).to.equal 'object'


    context 'with unknown formatter name', (...) ->

      before ->
        try
          @formatter-manager.get-formatter 'zonk'
        catch
          @err = e.message

      it 'returns no formatter', ->
        expect(@result).to.be.undefined

      it 'returns an error' ->
        jsdiff-console @err, """Unknown formatter: 'zonk'

                                Available formatters are colored, iconic, robust"""

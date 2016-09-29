process.env.NODE_ENV = 'test'

require! [chai]

global.chai = chai
global.expect = chai.expect

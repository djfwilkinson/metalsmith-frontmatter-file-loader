'use strict'
let should = require('should')
let sinon = require('sinon')
let fmfl = require('../')
let Metalsmith = require('metalsmith')

describe('metalsmith-frontmatter-file-loader', function () {
  let sandbox = null

  beforeEach(function () {
    sandbox = sinon.createSandbox()
    sandbox.stub(console, 'log')
  })

  afterEach(function () {
    sandbox.restore()
  })

  /**
   * By being the first test and having failing tests afterwards the `build` folder should be cleaned.
   * However it is still excluded from git in the .gitignore
   */
  it('should replace the paths with the contents of the files the paths point to', (done) => {
    Metalsmith('test/fixtures')
      .use(
        fmfl()
      )
      .build(function (err, files) {
        should.not.exist(err)
        files.should.match({
          'index.html': {
            'files': {
              'foo': 'This is the foo.txt contents.\n',
              'bar': 'This is the *bar.md* contents.\n'
            }
          }
        })
        return done()
      })
  })

  it('should throw an error if the config option `key` is not a string', (done) => {
    Metalsmith('test/fixtures')
      .use(
        fmfl(
          {
            key: {}
          }
        )
      )
      .build(function (err) {
        err.should.be.an.Error()
        err.message.should.equal('invalid key, the key option should be a string')
        return done()
      })
  })

  it('should throw an error if there are no files to process', (done) => {
    Metalsmith('test/fixtures')
      .use(
        fmfl(
          {
            key: 'noFiles'
          }
        )
      )
      .build(function (err) {
        err.should.be.an.Error()
        err.message.should.equal('no files to process.')
        return done()
      })
  })

  it('should not throw an error if there are no files to process and the config is set to suppress this', (done) => {
    Metalsmith('test/fixtures')
      .use(
        fmfl(
          {
            key: 'noFiles',
            suppressNoFilesError: true
          }
        )
      )
      .build(function (err, files) {
        should.not.exist(err)
        files.should.match({
          'index.html': {
            'files': {
              'foo': './test/fixtures/files/foo.txt',
              'bar': './test/fixtures/files/bar.md'
            }
          }
        })
        return done()
      })
  })

  it('should throw an error if a file fails to load', (done) => {
    Metalsmith('test/fixtures')
      .use(
        fmfl(
          {
            key: 'badFile'
          }
        )
      )
      .build(function (err) {
        err.should.be.an.Error()
        err.message.should.equal('could not load file: ./test/fixtures/files/foo.bar')
        return done()
      })
  })

  it('should not throw an error if a file fails to load and the config is set to suppress this', (done) => {
    Metalsmith('test/fixtures')
      .use(
        fmfl(
          {
            key: 'badFile',
            allowMissingFiles: true
          }
        )
      )
      .build(function (err, files) {
        should.not.exist(err)
        files.should.match({
          'index.html': {
            'badFile': {
              'foo': ''
            }
          }
        })
        return done()
      })
  })
})

const fs = require('fs')

function replace ({ filename, files, settings }) {
  const filePathsObj = files[filename][settings.key]
  const matchedPaths = Object.keys(filePathsObj)

  // Map all filePaths that should be loaded
  return Promise.all(
    matchedPaths.map(pathKey =>
      loadInPlace({ filename, files, settings, pathKey })
    )
  )
}

function loadInPlace ({ filename, files, settings, pathKey }) {
  // load a file and replace it within the files object
  return new Promise((resolve, reject) => {
    fs.readFile(files[filename][settings.key][pathKey], { encoding: 'utf8' }, function (err, data) {
      if (err) {
        if (settings.allowMissingFiles) {
          data = ''
        } else {
          reject(err)
        }
      }
      files[filename][settings.key][pathKey] = data
      resolve()
    })
  })
}

module.exports = options => (files, metalsmith, done) => {
  const defaults = {
    key: 'files',
    suppressNoFilesError: false,
    allowMissingFiles: false
  }
  const settings = Object.assign({}, defaults, options)

  // Check whether the key option is valid
  if (!(typeof settings.key === 'string')) {
    done(
      new Error(
        'invalid key, the key option should be a string'
      )
    )
  }

  // Filter files to only include those which have the key we"re looking for
  const matchedFiles = Object.keys(files).filter((file) => files[file].hasOwnProperty(settings.key))

  // Let the user know when there are no files to process
  if (matchedFiles.length === 0) {
    const msg =
      'no files to process.'
    if (settings.suppressNoFilesError) {
      done()
    } else {
      done(new Error(msg))
    }
  }

  // Map all files that should be processed to an array of promises and call done when finished
  Promise.all(
    matchedFiles.map(filename =>
      replace({ filename, files, settings })
    )
  )
    .then(() => done())
    .catch(error => done(error))
}

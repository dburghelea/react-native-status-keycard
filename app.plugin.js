const { withDangerousMod, withPlugins } = require( '@expo/config-plugins' )
const fs = require( 'fs' )
const path = require( 'path' )

async function readFile( path ) {
  return fs.promises.readFile( path, 'utf8' )
}

async function saveFile( path, content ) {
  return fs.promises.writeFile( path, content, 'utf8' )
}

module.exports = ( config ) => withPlugins( config, [ ( config ) => {
  return withDangerousMod( config, [
    'ios',
    async ( config ) => {
      const file = path.join( config.modRequest.platformProjectRoot, 'Podfile' )
      /*
       * You need to remove the line before adding it.
       * If you don't do this and you run `expo prebuild` in a dirt project
       * your file will have the same line added twice
       */
	  
	  let contents =  await readFile(file)
	  
	  contents = contents.replace( "pod 'secp256k1', git: 'https://github.com/status-im/secp256k1.swift.git', submodules: true", "" );
	  contents = contents.replace( "pod 'Keycard', git: 'https://github.com/status-im/Keycard.swift.git'", "" );
	  
	  const addedLines = `
  pod 'Keycard', git: 'https://github.com/status-im/Keycard.swift.git'
  pod 'secp256k1', git: 'https://github.com/status-im/secp256k1.swift.git', submodules: true
`
       contents = contents.replace(
        "post_install do |installer|",
        `${addedLines}\n\n  post_install do |installer|`
      )
      /*
       * Now re-adds the content
       */
      await saveFile( file, contents )
      return config
    }
  ] )
} ] )
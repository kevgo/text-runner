// type ConfigFilePath1 = Nominal<string, 'ConfigFilePath1'>
// type ConfigFilePath2 = Nominal<string, 'ConfigFilePath2'>

// type ConfigString1 = NominalString<'NominalString1'>
// type ConfigString2 = NominalString<'NominalString2'>

// function getFilePath(): ConfigFilePath1 {
//   return '123' as ConfigFilePath1
// }

// function getConfigString(): ConfigString1 {
//   return '123' as ConfigString1
// }

// testingString(getConfigString())
// testingFilepath(getFilePath())

// function testingString(arg: ConfigString1) {
//   console.log(arg)
// }

// function testingFilepath(arg: ConfigFilePath1) {
//   console.log(arg)
// }

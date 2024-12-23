import { program } from 'commander'
import { main } from './commands'

const packageJson = require('../package.json')

program.version(packageJson.version).description(packageJson.description)

program.action(() => main())

program.parse(process.argv)

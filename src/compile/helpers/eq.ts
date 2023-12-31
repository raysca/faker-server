import Handlebars from 'handlebars'

/**
 * Compare two values
 */
Handlebars.registerHelper('eq', function (...args: any[]): boolean {
    if (args.length < 2) {
        throw new Error('Handlerbars Helper "eq" needs 2 parameters')
    }

    const [a, b] = args
    return a === b
})

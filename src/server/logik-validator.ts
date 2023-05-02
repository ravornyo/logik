import { ValidationAcceptor, ValidationChecks } from 'langium';
import { LogikAstType, Program } from './language/ast';
import type { LogikServices } from './logik-module';

/**
 * Register custom validation checks.
 */
export function registerValidationChecks(services: LogikServices) {
    const registry = services.validation.ValidationRegistry;
    const validator = services.validation.LogikValidator;
    const checks: ValidationChecks<LogikAstType> = {
        Program: validator.validate
    };
    registry.register(checks, validator);
}

/**
 * Implementation of custom validations.
 */
export class LogikValidator {

    validate(program: Program, accept: ValidationAcceptor): void {
        // create a set of visited variable definitions
        // and report an error when we see one we've already seen      
        const reported = new Set();
        program.variables.forEach(variable => {
            if (reported.has(variable.name)) {
                accept('error',  `Variable '${variable.name} is already defined`,  {node: variable, property: 'name'});
            }
            if(variable.expression !== undefined){
                reported.add(variable.name);
            }
        });
    }

}

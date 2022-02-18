/// <reference types="cypress" />
import { buildTests } from '../../support/build-tests'

const knownFailures = [
    { page: 'component-cell-renderer', example: 'dynamic-components' },
    { page: 'component-filter', example: 'filter-component' },
    { page: 'component-floating-filter', example: 'floating-filter-component' },
    { page: 'rxjs' },

];

describe('AG Grid Examples', () => {
    buildTests('vanilla', 'packages', false, knownFailures)
})
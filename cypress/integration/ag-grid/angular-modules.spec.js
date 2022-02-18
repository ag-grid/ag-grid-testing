/// <reference types="cypress" />

import { buildTests } from '../../support/build-tests'

describe('AG Grid Examples', () => {
    buildTests('angular', 'modules')
})
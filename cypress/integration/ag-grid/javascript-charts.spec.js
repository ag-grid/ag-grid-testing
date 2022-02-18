/// <reference types="cypress" />
import { buildTests } from '../../support/build-tests'

describe('AG Grid Examples', () => {
    buildTests('vanilla', 'packages', true)
}
)

//npx cypress run --spec "cypress/integration/ag-grid/javascript-packages.spec.js"  -b chrome --reporter-options "mochaFile=test-results/javascript-packges.xml" --reporter cypress-multi-reporters
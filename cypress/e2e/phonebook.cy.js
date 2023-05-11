describe('site', () => {
  beforeEach(function () {
    cy.visit('http://localhost:3001')
  })
  it('submits new name and number', function () {
    cy.get('input[id*="inputName"]').type('Testi Testaaja')
    cy.get('input[id*="inputNumber"]').type('040-4040404')
    cy.get('button[type="submit"]').contains('add').click()
    cy.wait(1000)
    cy.get('.phonebook').contains('Testi Testaaja')
    cy.contains('Added Testi Testaaja, number 040-4040404')
  })

  it('changes number', function () {
    cy.get('input[id*="inputName"]').type('Testi Testaaja')
    cy.get('input[id*="inputNumber"]').type('050-5050505')
    cy.get('button[type="submit"]').contains('add').click()
    cy.wait(1000)
    cy.get('.phonebook').contains('050-5050505')
    cy.contains("Testi Testaaja's number was changed")
  })

  it('filters', function () {
    cy.get('input[id*="inputName"]').type('Sauli Nimistö')
    cy.get('input[id*="inputNumber"]').type('050-5050505')
    cy.get('button[type="submit"]').contains('add').click()
    cy.wait(1000)
    cy.get('.phonebook').contains('Sauli Nimistö')

    cy.get('input[id*="search-form"]').type('Te')
    cy.wait(1000)
    cy.get('.saulinimist').should('not.exist')
  })

  it('deletes name and number', function () {
    cy.get('.saulinimist').contains('delete').click()
    cy.contains('Sauli Nimistö was removed')
    cy.get('.testitestaaja').contains('delete').click()
    cy.contains('Testi Testaaja was removed')
  })
})

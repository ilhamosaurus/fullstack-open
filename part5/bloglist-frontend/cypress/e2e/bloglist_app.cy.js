describe('Bloglist app', function () {
  beforeEach(() => {
    cy.request('POST', `${Cypress.env('BACKEND')}/testing/reset`)
    const user = {
      name: 'one',
      username: 'testuserone',
      password: 'testis',
    }

    const userTwo = {
      name: 'two',
      username: 'testusertwo',
      password: 'testis',
    }

    cy.request('POST', `${Cypress.env('BACKEND')}/users`, user)
    cy.request('POST', `${Cypress.env('BACKEND')}/users`, userTwo)
    cy.visit('')
  })

  it('front page can be opnened', function () {
    cy.contains('Log in to application')
  })

  describe('Login', () => {
    it('succeeds with correct credentials', () => {
      cy.get('#Username').type('testuserone')
      cy.get('#Password').type('testis')
      cy.get('#login-button').click()
      cy.contains('one logged in')
    })
    it('fails with wrong credentials', () => {
      cy.get('#Username').type('testuserone')
      cy.get('#Password').type('wrong')
      cy.get('#login-button').click()
      cy.get('.error').contains('Wrong credentials')
    })
  })

  describe('When logged in', () => {
    beforeEach(() => {
      cy.get('#Username').type('testuserone')
      cy.get('#Password').type('testis')
      cy.get('#login-button').click()
      cy.contains('one logged in')
    })
    it('A blog can be created', () => {
      cy.contains('New Blog').click()
      cy.get('#Title').type('test title')
      cy.get('#Author').type('test author')
      cy.get('#Url').type('localhost:1111/')
      cy.get('#create-button').click({ force: true })
      cy.contains('test title test author')
    })

    describe('and a blog exists', () => {
      beforeEach(() => {
        cy.contains('New Blog').click()
        cy.get('#Title').type('test title2')
        cy.get('#Author').type('test author2')
        cy.get('#Url').type('localhost:1112/')
        cy.get('#create-button').click({ force: true })
        cy.contains('test title2 test author2')
      })
      it('user can add like', () => {
        cy.contains('View').click()
        cy.contains('0').contains('like').click()

        cy.contains(1)
      })
      it('user can delete their blogs', () => {
        cy.contains('View').click()
        cy.get('#remove-button').click()
        cy.contains('remove').should('not.exist')
      })
    })

    describe('when there are more than one users', () => {
      beforeEach(() => {
        cy.contains('logout').click()

        cy.get('#Username').type('testusertwo')
        cy.get('#Password').type('testis')
        cy.get('#login-button').click()
        cy.contains('two logged in')
      })

      it('only user who created the blog can delete it', () => {
        cy.contains('New Blog').click()
        cy.get('#Title').type('test title two')
        cy.get('#Author').type('test author two')
        cy.get('#Url').type('localhost:2222/')
        cy.get('#create-button').click({ force: true })
        cy.contains('test title two test author two')

        cy.contains('logout').click()
        cy.get('#Username').type('testuserone')
        cy.get('#Password').type('testis')
        cy.get('#login-button').click()
        cy.contains('one logged in')

        cy.contains('View').click()
        cy.contains('remove').should('not.exist')
      })

      it('blogs are ordered by likes', () => {
        cy.contains('New Blog').click()
        cy.get('#Title').type('The title with most likes')
        cy.get('#Author').type('kkkk')
        cy.get('#Url').type('https://www.kkkk.com')
        cy.get('#create-button').click({ force: true })

        cy.contains('New Blog').click()
        cy.get('#Title').type('The title with the second most likes')
        cy.get('#Author').type('gggg')
        cy.get('#Url').type('https://www.gggg.com')
        cy.get('#create-button').click({ force: true })

        cy.contains('The title with most likes')
          .get('button')
          .contains('View')
          .click()
        cy.get('button').contains('like').click()

        cy.get('.blog').eq(0).should('contain', 'The title with most likes')
        cy.get('.blog')
          .eq(1)
          .should('contain', 'The title with the second most likes')
      })
    })
  })
})

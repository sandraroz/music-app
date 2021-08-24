describe('Audio Player', () => {
  it('plays audio', () => {
    cy.visit('/');
    // Selecting items through class names returns array if list item, add the :first keyword
    cy.get('.composition-name:first').click();
    // Select the play button through an id name
    cy.get('#play-button').click();
    // wait 5 seconds
    cy.wait(5000);

    cy.get('#player-play-button').click();
  });
});

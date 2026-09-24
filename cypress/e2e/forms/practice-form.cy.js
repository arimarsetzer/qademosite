import practiceForm from '../../pages/PracticeFormPage';
import students from '../../fixtures/students.json';

const { submissionModal } = practiceForm;

const expectSubmitRejected = () => {
  practiceForm.form().should('have.class', 'was-validated');
  submissionModal.dialog().should('not.exist');
};

describe('Practice Form', () => {
  beforeEach(() => {
    practiceForm.visit();
  });

  it('submits a fully filled form and shows every value in the confirmation modal', () => {
    const student = students.complete;

    practiceForm.fill(student);
    practiceForm.submit();

    submissionModal.title().should('have.text', 'Thanks for submitting the form');
    submissionModal
      .valueFor('Student Name')
      .should('have.text', `${student.firstName} ${student.lastName}`);
    submissionModal.valueFor('Student Email').should('have.text', student.email);
    submissionModal.valueFor('Gender').should('have.text', student.gender);
    submissionModal.valueFor('Mobile').should('have.text', student.mobile);
    submissionModal
      .valueFor('Date of Birth')
      .invoke('text')
      .should('match', /^15 May, ?1990$/);
    submissionModal.valueFor('Subjects').should('have.text', student.subjects.join(', '));
    submissionModal.valueFor('Hobbies').should('have.text', student.hobbies.join(', '));
    submissionModal.valueFor('Picture').should('have.text', student.picture);
    submissionModal.valueFor('Address').should('have.text', student.address);
    submissionModal
      .valueFor('State and City')
      .should('have.text', `${student.state} ${student.city}`);
  });

  it('submits with only the required fields and leaves optional values empty', () => {
    const student = students.requiredOnly;

    practiceForm.fill(student);
    practiceForm.submit();

    submissionModal
      .valueFor('Student Name')
      .should('have.text', `${student.firstName} ${student.lastName}`);
    submissionModal.valueFor('Gender').should('have.text', student.gender);
    submissionModal.valueFor('Mobile').should('have.text', student.mobile);
    ['Student Email', 'Subjects', 'Hobbies', 'Picture', 'Address', 'State and City'].forEach(
      (label) => {
        submissionModal.valueFor(label).invoke('text').should('be.empty');
      },
    );
  });

  it('blocks an empty submission and flags only the required fields as invalid', () => {
    practiceForm.submit();

    expectSubmitRejected();
    practiceForm
      .requiredFields()
      .should('have.length', 6)
      .each(($field) => cy.wrap($field).should('match', ':invalid'));
    practiceForm
      .optionalFields()
      .should('have.length', 6)
      .each(($field) => cy.wrap($field).should('match', ':valid'));
  });

  students.invalidEmails.forEach((email) => {
    it(`rejects the malformed email "${email}"`, () => {
      practiceForm.fill({ ...students.requiredOnly, email });
      practiceForm.submit();

      expectSubmitRejected();
      practiceForm.emailField().should('match', ':invalid');
      practiceForm.firstNameField().should('match', ':valid');
    });
  });

  it('rejects a mobile number containing letters', () => {
    practiceForm.fill({ ...students.requiredOnly, mobile: 'abcdefghij' });
    practiceForm.submit();

    expectSubmitRejected();
    practiceForm.mobileField().should('match', ':invalid');
  });

  // Known defects, see DEFECTS.md.
  it.skip('DEF-002: shows the date of birth as "15 May, 1990" in the confirmation modal', () => {
    practiceForm.fill({ ...students.requiredOnly, dateOfBirth: students.complete.dateOfBirth });
    practiceForm.submit();

    submissionModal.valueFor('Date of Birth').should('have.text', '15 May, 1990');
  });

  it.skip('DEF-003: closes the confirmation modal with its Close button', () => {
    practiceForm.fill(students.requiredOnly);
    practiceForm.submit();
    submissionModal.dialog().should('be.visible');

    submissionModal.close();

    submissionModal.dialog().should('not.exist');
  });
});

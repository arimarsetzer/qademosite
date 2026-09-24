import SubmissionModal from './components/SubmissionModal';
import { exactText } from '../support/utils/text';

const selectors = {
  form: '#userForm',
  firstName: '#firstName',
  lastName: '#lastName',
  email: '#userEmail',
  genderLabels: '#genterWrapper label',
  mobile: '#userNumber',
  dateOfBirthInput: '#dateOfBirthInput',
  datePickerMonth: '.react-datepicker__month-select',
  datePickerYear: '.react-datepicker__year-select',
  datePickerDay: (day) =>
    `.react-datepicker__day--${String(day).padStart(3, '0')}:not(.react-datepicker__day--outside-month)`,
  subjectsInput: '#subjectsInput',
  subjectOption: '.subjects-auto-complete__option',
  hobbyLabels: '#hobbiesWrapper label',
  picture: '#uploadPicture',
  address: '#currentAddress',
  state: '#state',
  city: '#city',
  selectOption: '[id^="react-select-"][id*="-option-"]',
  submit: '#submit',
  requiredFields: '#firstName, #lastName, input[name="gender"], #userNumber',
  optionalFields: '#userEmail, #dateOfBirthInput, input[id^="hobbies-checkbox-"], #currentAddress',
};

const pickReactSelectOption = (container, optionText) => {
  cy.get(container).click();
  cy.get(container).contains(selectors.selectOption, exactText(optionText)).click();
};

class PracticeFormPage {
  constructor() {
    this.submissionModal = SubmissionModal;
  }

  visit() {
    cy.visit('/automation-practice-form');
  }

  form() {
    return cy.get(selectors.form);
  }

  firstNameField() {
    return cy.get(selectors.firstName);
  }

  emailField() {
    return cy.get(selectors.email);
  }

  mobileField() {
    return cy.get(selectors.mobile);
  }

  requiredFields() {
    return cy.get(selectors.requiredFields);
  }

  optionalFields() {
    return cy.get(selectors.optionalFields);
  }

  typeFirstName(value) {
    cy.get(selectors.firstName).type(value);
  }

  typeLastName(value) {
    cy.get(selectors.lastName).type(value);
  }

  typeEmail(value) {
    cy.get(selectors.email).type(value);
  }

  selectGender(gender) {
    cy.contains(selectors.genderLabels, exactText(gender)).click();
  }

  typeMobile(value) {
    cy.get(selectors.mobile).type(value);
  }

  setDateOfBirth({ day, month, year }) {
    cy.get(selectors.dateOfBirthInput).click();
    cy.get(selectors.datePickerMonth).select(month);
    cy.get(selectors.datePickerYear).select(String(year));
    cy.get(selectors.datePickerDay(day)).click();
  }

  // Click the suggestion: pressing Enter before the list opens submits the form.
  addSubject(subject) {
    cy.get(selectors.subjectsInput).type(subject);
    cy.contains(selectors.subjectOption, exactText(subject)).should('be.visible').click();
  }

  selectHobby(hobby) {
    cy.contains(selectors.hobbyLabels, exactText(hobby)).click();
  }

  uploadPicture(fixtureFile) {
    cy.get(selectors.picture).selectFile(`cypress/fixtures/files/${fixtureFile}`);
  }

  typeAddress(value) {
    cy.get(selectors.address).type(value);
  }

  selectStateAndCity(state, city) {
    pickReactSelectOption(selectors.state, state);
    pickReactSelectOption(selectors.city, city);
  }

  fill(student) {
    this.typeFirstName(student.firstName);
    this.typeLastName(student.lastName);
    if (student.email) this.typeEmail(student.email);
    this.selectGender(student.gender);
    this.typeMobile(student.mobile);
    if (student.dateOfBirth) this.setDateOfBirth(student.dateOfBirth);
    (student.subjects || []).forEach((subject) => this.addSubject(subject));
    (student.hobbies || []).forEach((hobby) => this.selectHobby(hobby));
    if (student.picture) this.uploadPicture(student.picture);
    if (student.address) this.typeAddress(student.address);
    if (student.state) this.selectStateAndCity(student.state, student.city);
  }

  submit() {
    cy.get(selectors.submit).click();
  }
}

export default new PracticeFormPage();

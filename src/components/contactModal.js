import React from 'react';
import PropTypes from 'prop-types';
import { IconContext } from 'react-icons';
import { FaTimes } from 'react-icons/fa';
import Recaptcha from 'react-google-recaptcha';
import { apiUrl, makeid } from '../utils/functions';
// import 'dotenv/config';

class ContactModal extends React.Component {
  constructor(props) {
    super(props);
    const subjectArray = [];
    Object.entries(props.aboutLabel.about).forEach(([key, value]) => {
      if (key.indexOf('FORM_SUBJECT_') > -1) {
        subjectArray.push(value);
      }
    });
    this.state = {
      contactName: '',
      contactEmail: '',
      contactPosition: '',
      contactCompany: '',
      contactPhone: '',
      contactCountry: '',
      contactOffice: '',
      contactSubject: '',
      contactMessage: '',
      message: null,
      subjects: subjectArray,
      submitDisabled: true,
    };
    this.recaptchaRef = React.createRef();
  }

  handleChange = evt => {
    const { target } = evt;
    const { message } = this.state;
    if (message) {
      this.setState({ message: null });
    }
    this.setState({
      [target.name]: target.value,
    });
  };

  handleHideModal = evt => {
    const { hideModal } = this.props;
    evt.preventDefault();
    hideModal();
    if (typeof document !== 'undefined') {
      document.querySelector('html').classList.toggle('hide-overflow');
    }
  };

  handleRecaptcha = value => {
    const { message } = this.state;
    if (message) {
      this.setState({ message: null });
    }
    if (value) {
      this.setState({ submitDisabled: false });
    } else {
      this.setState({ submitDisabled: true });
    }
  };

  handleSubmit = async evt => {
    evt.preventDefault();
    const { label, offices } = this.props;
    const { contactOffice } = this.state;
    const params = {};
    const keys = Object.keys(this.state);
    const values = Object.values(this.state);
    keys.forEach((elem, index) => {
      if (elem.indexOf('contact') > -1) {
        params[elem] = values[index];
      }
    });
    params.destination = offices[Number(contactOffice)].email;

    try {
      const response = await fetch(`${apiUrl()}/forwardEmail`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...params }),
      });
      if (response.ok) {
        this.setState({
          message: label.common.FORM_SENT,
        });
        this.resetForm();
        this.recaptchaRef.current.reset();
      } else {
        this.setState({
          message: label.common.FORM_SORRY,
          submitDisabled: true,
        });
        this.recaptchaRef.current.reset();
      }
    } catch (err) {
      this.setState({
        message: label.common.FORM_SORRY,
        submitDisabled: true,
      });
      this.recaptchaRef.current.reset();
    }
  };

  resetForm = () => {
    this.setState({
      contactName: '',
      contactEmail: '',
      contactPhone: '',
      contactPosition: '',
      contactCompany: '',
      contactCountry: '',
      contactOffice: '',
      contactSubject: '',
      contactMessage: '',
      submitDisabled: true,
    });
  };

  showError = error => {
    this.setState({ message: error });
  };

  showSuccess = () => {
    this.setState({ message: 'Thank you. Your message has been sent.' });
  };

  render() {
    const { aboutLabel, label, offices, selectedOffice, showModal, title } = this.props;
    const {
      contactName,
      contactEmail,
      contactPhone,
      contactPosition,
      contactCompany,
      contactCountry,
      contactOffice,
      contactSubject,
      contactMessage,
      message,
      subjects,
      submitDisabled,
    } = this.state;
    // const availableOffices = offices.filter(office => office.)
    return (
      <div className={`contact-modal ${showModal ? 'in-view' : ''}`}>
        <div className="modal-container">
          <div className="top">
            <div className="close-container">
              <IconContext.Provider value={{ className: 'close-icon' }}>
                <button
                  type="button"
                  className="close-menu"
                  onClick={evt => this.handleHideModal(evt)}
                >
                  <FaTimes aria-hidden />
                  <span className="sr-only">{label.common.CLOSE}</span>
                </button>
              </IconContext.Provider>
            </div>
          </div>
          <div className="content-container">
            <div className="content">
              <h2>{title}</h2>
              <form
                className="contact-form"
                name="contact"
                method="POST"
                onSubmit={this.handleSubmit}
              >
                <div className="field">
                  <label htmlFor="contactName">
                    <div className="label">
                      <span className="label-input">{aboutLabel.about.FORM_NAME}</span>
                      <span className="required">* {aboutLabel.about.FORM_REQUIRED}</span>
                    </div>
                    <input
                      type="text"
                      name="contactName"
                      onChange={evt => this.handleChange(evt)}
                      required
                      value={contactName}
                    />
                  </label>
                </div>
                <div className="field">
                  <label htmlFor="contactEmail">
                    <div className="label">
                      <span className="label-input">{aboutLabel.about.FORM_EMAIL}</span>
                      <span className="required">* {aboutLabel.about.FORM_REQUIRED}</span>
                    </div>
                    <input
                      type="email"
                      name="contactEmail"
                      onChange={evt => this.handleChange(evt)}
                      required
                      value={contactEmail}
                    />
                  </label>
                </div>
                <div className="field">
                  <label htmlFor="contactPosition">
                    <div className="label">
                      <span className="label-input">{aboutLabel.about.FORM_POSITION}</span>
                      <span className="required">* {aboutLabel.about.FORM_REQUIRED}</span>
                    </div>
                    <input
                      type="text"
                      name="contactPosition"
                      onChange={evt => this.handleChange(evt)}
                      required
                      value={contactPosition}
                    />
                  </label>
                </div>
                <div className="field">
                  <label htmlFor="contactCompany">
                    <div className="label">
                      <span className="label-input">{aboutLabel.about.FORM_COMPANY}</span>
                      <span className="required">* {aboutLabel.about.FORM_REQUIRED}</span>
                    </div>
                    <input
                      type="text"
                      name="contactCompany"
                      onChange={evt => this.handleChange(evt)}
                      required
                      value={contactCompany}
                    />
                  </label>
                </div>
                <div className="field">
                  <label htmlFor="contactPhone">
                    <div className="label">
                      <span className="label-input">{aboutLabel.about.FORM_PHONE}</span>
                      <span className="required">* {aboutLabel.about.FORM_REQUIRED}</span>
                    </div>
                    <input
                      type="text"
                      name="contactPhone"
                      onChange={evt => this.handleChange(evt)}
                      required
                      value={contactPhone}
                    />
                  </label>
                </div>
                <div className="field">
                  <label htmlFor="contactCountry">
                    <div className="label">
                      <span className="label-input">{aboutLabel.about.FORM_COUNTRY}</span>
                      <span className="required">* {aboutLabel.about.FORM_REQUIRED}</span>
                    </div>
                    <input
                      type="text"
                      name="contactCountry"
                      onChange={evt => this.handleChange(evt)}
                      required
                      value={contactCountry}
                    />
                  </label>
                </div>
                <div className="field">
                  <label htmlFor="contactOffice">
                    <div className="label">
                      <span className="label-input">{aboutLabel.about.FORM_ALMEX_OFFICE}</span>
                      <span className="required">* {aboutLabel.about.FORM_REQUIRED}</span>
                    </div>
                    <select
                      name="contactOffice"
                      value={contactOffice === '' ? selectedOffice : contactOffice}
                      onChange={evt => this.handleChange(evt)}
                      required
                    >
                      <option value="">{aboutLabel.about.FORM_PLEASE_SELECT}</option>
                      {offices &&
                        offices.map((office, idx) => {
                          if (String(idx) === selectedOffice || office.backupOffice) {
                            return (
                              <option key={makeid()} value={idx}>
                                {office.name}
                              </option>
                            );
                          }
                          return false;
                        })}
                    </select>
                  </label>
                </div>
                <div className="field">
                  <label htmlFor="contactSubject">
                    <div className="label">
                      <span className="label-input">{aboutLabel.about.FORM_SUBJECT}</span>
                      <span className="required">* {aboutLabel.about.FORM_REQUIRED}</span>
                    </div>
                    <select
                      name="contactSubject"
                      value={contactSubject}
                      onChange={evt => this.handleChange(evt)}
                      required
                    >
                      <option value="">{aboutLabel.about.FORM_PLEASE_SELECT}</option>
                      {subjects &&
                        subjects.map(subject => (
                          <option key={makeid()} value={subject}>
                            {subject}
                          </option>
                        ))}
                    </select>
                  </label>
                </div>
                <div className="field">
                  <label htmlFor="contactMessage">
                    <div className="label">
                      <span className="label-input">{aboutLabel.about.FORM_MESSAGE}</span>
                      <span className="required">* {aboutLabel.about.FORM_REQUIRED}</span>
                    </div>
                    <textarea
                      name="contactMessage"
                      onChange={evt => this.handleChange(evt)}
                      required
                      value={contactMessage}
                    />
                  </label>
                </div>
                <div className="field">
                  <Recaptcha
                    ref={this.recaptchaRef}
                    sitekey={process.env.SITE_RECAPTCHA_KEY}
                    onChange={this.handleRecaptcha}
                  />
                </div>
                <div className="field">
                  <button
                    className={submitDisabled ? 'disabled' : ''}
                    type="submit"
                    disabled={submitDisabled}
                  >
                    Send
                  </button>
                </div>
                {message && <div className="field">{message}</div>}
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

ContactModal.defaultProps = {
  aboutLabel: {},
  hideModal: () => {},
  label: {},
  offices: null,
  selectedOffice: '',
  showModal: false,
  title: '',
};

ContactModal.propTypes = {
  aboutLabel: PropTypes.shape({
    about: PropTypes.object,
  }),
  hideModal: PropTypes.func,
  label: PropTypes.shape({
    common: PropTypes.object,
  }),
  offices: PropTypes.arrayOf(
    PropTypes.shape({
      backupOffice: PropTypes.bool,
      email: PropTypes.array,
      name: PropTypes.string,
    }),
  ),
  selectedOffice: PropTypes.string,
  showModal: PropTypes.bool,
  title: PropTypes.string,
};

export default ContactModal;

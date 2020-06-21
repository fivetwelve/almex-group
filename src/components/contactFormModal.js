import React from 'react';
import PropTypes from 'prop-types';
import fetch from 'isomorphic-fetch';
import { IconContext } from 'react-icons';
import { FaTimes } from 'react-icons/fa';
import Recaptcha from 'react-google-recaptcha';
import { apiUrl, makeid } from '../utils/functions';
import { CONTACT_TYPES, FORM_TYPES } from '../constants';

class ContactFormModal extends React.Component {
  constructor(props) {
    super(props);
    const subjectArray = [];
    Object.entries(props.label.common).forEach(([key, value]) => {
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
      contactSubject: '',
      contactMessage: '',
      contactFormType: FORM_TYPES.CONTACT,
      message: null,
      subjects: subjectArray,
      submitDisabled: true,
    };
    this.recaptchaRef = React.createRef();
  }

  static getDerivedStateFromProps(props, state) {
    // When there is a selectedOffice, set contactOffice to that value
    // this should only happen once when user clicks on Contact Us in parent component
    const { selectedExpert, selectedOffice } = props;
    if (state.selectedOffice !== selectedOffice) {
      return {
        contactOffice: selectedOffice,
        contactExpert: null,
      };
    }
    if (state.selectedExpert !== selectedExpert) {
      return {
        contactExpert: selectedExpert,
        contactOffice: null,
      };
    }
    return null;
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
    this.recaptchaRef.current.reset();
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
    const { contactType, label } = this.props;
    const { contactExpert, contactOffice } = this.state;
    const params = {};
    const keys = Object.keys(this.state);
    const values = Object.values(this.state);
    keys.forEach((elem, index) => {
      if (elem.indexOf('contact') > -1) {
        params[elem] = values[index];
      }
    });
    if (contactType === CONTACT_TYPES.EXPERT) {
      params.destination = [contactExpert.email];
    } else {
      params.destination = contactOffice.email;
    }
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
    const { label, showModal, title } = this.props;

    const {
      contactName,
      contactEmail,
      contactPhone,
      contactPosition,
      contactCompany,
      contactCountry,
      contactSubject,
      contactMessage,
      message,
      subjects,
      submitDisabled,
    } = this.state;
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
                      <span className="label-input">{label.common.FORM_NAME}</span>
                      <span className="required">* {label.common.FORM_REQUIRED}</span>
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
                      <span className="label-input">{label.common.FORM_EMAIL}</span>
                      <span className="required">* {label.common.FORM_REQUIRED}</span>
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
                  <label htmlFor="contactPhone">
                    <div className="label">
                      <span className="label-input">{label.common.FORM_PHONE}</span>
                      <span className="required">* {label.common.FORM_REQUIRED}</span>
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
                  <label htmlFor="contactPosition">
                    <div className="label">
                      <span className="label-input">{label.common.FORM_POSITION}</span>
                      <span className="required">* {label.common.FORM_REQUIRED}</span>
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
                      <span className="label-input">{label.common.FORM_COMPANY}</span>
                      <span className="required">* {label.common.FORM_REQUIRED}</span>
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
                  <label htmlFor="contactCountry">
                    <div className="label">
                      <span className="label-input">{label.common.FORM_COUNTRY}</span>
                      <span className="required">* {label.common.FORM_REQUIRED}</span>
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
                  <label htmlFor="contactSubject">
                    <div className="label">
                      <span className="label-input">{label.common.FORM_SUBJECT}</span>
                      <span className="required">* {label.common.FORM_REQUIRED}</span>
                    </div>
                    <select
                      name="contactSubject"
                      value={contactSubject}
                      onChange={evt => this.handleChange(evt)}
                      required
                    >
                      <option value="">{label.common.FORM_PLEASE_SELECT}</option>
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
                      <span className="label-input">{label.common.FORM_MESSAGE}</span>
                      <span className="required">* {label.common.FORM_REQUIRED}</span>
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
                {message && <div className="feedback">{message}</div>}
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

ContactFormModal.defaultProps = {
  contactType: '',
  hideModal: () => {},
  label: {},
  selectedExpert: null,
  selectedOffice: null,
  showModal: false,
  title: '',
};

ContactFormModal.propTypes = {
  contactType: PropTypes.string,
  hideModal: PropTypes.func,
  label: PropTypes.shape({
    common: PropTypes.object,
  }),
  selectedExpert: PropTypes.shape({
    // this will be moved into an array in handleSubmit() to be consistent with selectedOffice.email
    email: PropTypes.string,
  }),
  selectedOffice: PropTypes.shape({
    email: PropTypes.array,
  }),
  showModal: PropTypes.bool,
  title: PropTypes.string,
};

export default ContactFormModal;

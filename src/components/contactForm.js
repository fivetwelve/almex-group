import React from 'react';
import PropTypes from 'prop-types';
import fetch from 'isomorphic-fetch';
import Recaptcha from 'react-google-recaptcha';
import { apiUrl } from '../utils/functions';
import { FORM_TYPES } from '../constants';

class ContactForm extends React.Component {
  constructor(props) {
    super(props);
    const { formType } = props;
    this.state = {
      contactName: '',
      contactEmail: '',
      contactPhone: '',
      contactCompany: '',
      contactAddress1: '',
      contactAddress2: '',
      contactCity: '',
      contactStateProvince: '',
      contactCountry: '',
      contactSubject: '',
      contactMessage: '',
      contactFormType: formType,
      gRecaptchaResponse: null,
      message: null,
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

  handleRecaptcha = value => {
    const { message } = this.state;
    if (message) {
      this.setState({ message: null });
    }
    if (value) {
      this.setState({ gRecaptchaResponse: value, submitDisabled: false });
    } else {
      this.setState({ gRecaptchaResponse: null, submitDisabled: true });
    }
  };

  handleSubmit = async evt => {
    evt.preventDefault();
    const { email, emailSubject, label } = this.props;
    const { gRecaptchaResponse } = this.state;
    const params = {};
    const keys = Object.keys(this.state);
    const values = Object.values(this.state);
    keys.forEach((elem, index) => {
      if (elem.indexOf('contact') > -1) {
        params[elem] = values[index] || '';
      }
    });
    params.gRecaptchaResponse = gRecaptchaResponse;
    params.destination = email;
    params.contactSubject = emailSubject || label.common.FORM_SUBJECTLINE_DEFAULT;

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
      contactAddress1: '',
      contactAddress2: '',
      contactCity: '',
      contactStateProvince: '',
      contactCountry: '',
      contactMessage: '',
      submitDisabled: true,
    });
  };

  render() {
    const { label } = this.props;
    const {
      contactName,
      contactEmail,
      contactPhone,
      contactPosition,
      contactCompany,
      contactCountry,
      contactMessage,
      message,
      submitDisabled,
    } = this.state;
    return (
      <form className="contact-form" name="contact" method="POST" onSubmit={this.handleSubmit}>
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
    );
  }
}

ContactForm.defaultProps = {
  email: [],
  emailSubject: null,
  formType: FORM_TYPES.CONTACT,
  label: {},
};

ContactForm.propTypes = {
  email: PropTypes.arrayOf(PropTypes.string),
  emailSubject: PropTypes.string,
  formType: PropTypes.string,
  label: PropTypes.shape({
    common: PropTypes.instanceOf(Object),
  }),
};

export default ContactForm;

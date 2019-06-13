import React from 'react';
import PropTypes from 'prop-types';
import Recaptcha from 'react-google-recaptcha';
import { apiUrl, makeid } from '../utils/functions';
// import { navigateTo } from 'gatsby';
// import 'dotenv/config';

class ContactForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      contactName: '',
      contactEmail: '',
      contactPosition: '',
      contactCompany: '',
      contactPhone: '',
      contactCountry: '',
      contactMessage: '',
      contactOffice: '',
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
      this.setState({ submitDisabled: false });
    } else {
      this.setState({ submitDisabled: true });
    }
  };

  handleSubmit = async evt => {
    evt.preventDefault();
    const { offices } = this.props;
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
          message: 'Your message has been sent!',
        });
        this.resetForm();
        this.recaptchaRef.current.reset();
      } else {
        this.setState({
          message: 'Sorry there was an error. Please try again later.',
          submitDisabled: true,
        });
        this.recaptchaRef.current.reset();
      }
    } catch (err) {
      this.setState({
        message: 'Sorry, there was an error. Please try again later.',
        submitDisabled: true,
      });
      this.recaptchaRef.current.reset();
    }
  };

  resetForm = () => {
    this.setState({
      contactName: '',
      contactEmail: '',
      contactPosition: '',
      contactCompany: '',
      contactPhone: '',
      contactCountry: '',
      contactMessage: '',
      contactOffice: '',
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
    const { label, offices } = this.props;
    const {
      contactEmail,
      contactCompany,
      contactCountry,
      contactName,
      contactOffice,
      contactPhone,
      contactPosition,
      contactMessage,
      message,
      submitDisabled,
    } = this.state;
    return (
      <div>
        <form className="contact-form" name="contact" method="POST" onSubmit={this.handleSubmit}>
          <p>
            <label htmlFor="contactName">
              <span className="label-input">{label.about.FORM_NAME}</span>
              <br />
              <input
                type="text"
                name="contactName"
                onChange={evt => this.handleChange(evt)}
                required
                value={contactName}
              />
            </label>
          </p>
          <p>
            <label htmlFor="contactEmail">
              <span className="label-input">{label.about.FORM_EMAIL}</span>
              <br />
              <input
                type="email"
                name="contactEmail"
                onChange={evt => this.handleChange(evt)}
                required
                value={contactEmail}
              />
            </label>
          </p>
          <p>
            <label htmlFor="contactPosition">
              <span className="label-input">{label.about.FORM_POSITION}</span>
              <br />
              <input
                type="text"
                name="contactPosition"
                onChange={evt => this.handleChange(evt)}
                required
                value={contactPosition}
              />
            </label>
          </p>
          <p>
            <label htmlFor="contactCompany">
              <span className="label-input">{label.about.FORM_COMPANY}</span>
              <br />
              <input
                type="text"
                name="contactCompany"
                onChange={evt => this.handleChange(evt)}
                required
                value={contactCompany}
              />
            </label>
          </p>
          <p>
            <label htmlFor="contactPhone">
              <span className="label-input">{label.about.FORM_PHONE}</span>
              <br />
              <input
                type="text"
                name="contactPhone"
                onChange={evt => this.handleChange(evt)}
                required
                value={contactPhone}
              />
            </label>
          </p>
          <p>
            <label htmlFor="contactCountry">
              <span className="label-input">{label.about.FORM_COUNTRY}</span>
              <br />
              <input
                type="text"
                name="contactCountry"
                onChange={evt => this.handleChange(evt)}
                required
                value={contactCountry}
              />
            </label>
          </p>
          <p>
            <label htmlFor="contactOffice">
              <span className="label-input">{label.about.FORM_ALMEX_OFFICE}</span>
              <br />
              <select
                name="contactOffice"
                value={contactOffice}
                onChange={evt => this.handleChange(evt)}
                required
              >
                <option value="">Select an office</option>
                {offices &&
                  offices.map((office, idx) => (
                    <option value={idx} key={makeid()}>
                      {office.name}
                    </option>
                  ))}
              </select>
            </label>
          </p>

          <p>
            <label htmlFor="contactMessage">
              <span className="label-input">{label.about.FORM_MESSAGE}</span>
              <br />
              <textarea
                name="contactMessage"
                onChange={evt => this.handleChange(evt)}
                required
                value={contactMessage}
              />
            </label>
          </p>
          <Recaptcha
            ref={this.recaptchaRef}
            sitekey={process.env.SITE_RECAPTCHA_KEY}
            onChange={this.handleRecaptcha}
          />
          <p>
            <button
              className={submitDisabled ? 'disabled' : ''}
              type="submit"
              disabled={submitDisabled}
            >
              Send
            </button>
          </p>
          {message && <p>{message}</p>}
        </form>
      </div>
    );
  }
}

ContactForm.defaultProps = {
  label: {},
  offices: null,
};

ContactForm.propTypes = {
  label: PropTypes.shape({
    about: PropTypes.object,
  }),
  offices: PropTypes.arrayOf(
    PropTypes.shape({
      email: PropTypes.array,
      name: PropTypes.string,
    }),
  ),
};

export default ContactForm;

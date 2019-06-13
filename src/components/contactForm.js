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
      message: null,
      submitDisabled: true,
    };
    this.recaptcha = React.createRef();
  }

  handleChange = evt => {
    const { target } = evt;
    this.setState({
      [target.name]: target.value,
    });
  };

  handleKeyUp = evt => {
    if (evt.keyCode === 13) return this.handleSubmit(evt);
    return false;
  };

  handleRecaptcha = value => {
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
      console('=============');
      console(response);
      if (!response.ok) {
        /* NOT res.status >= 200 && res.status < 300 */
        return { statusCode: response.status, body: response.statusText };
      }
      const data = await response.json();

      return {
        statusCode: 200,
        body: JSON.stringify({ msg: data }),
      };
    } catch (err) {
      return {
        statusCode: 500,
        body: JSON.stringify({ msg: err.message }), // Could be a custom message or object i.e. JSON.stringify(err)
      };
    }
    // // .then(() => navigateTo(form.getAttribute('action')))
    // // .then(() => this.showSuccess())
    // // .catch(error => this.showError(error));
  };

  showError = error => {
    this.setState({ message: error });
  };

  showSuccess = () => {
    this.setState({ message: 'Success!' });
  };

  render() {
    const { label, offices } = this.props;
    const { contactOffice, message, submitDisabled } = this.state;
    return (
      <div>
        <form
          className="contact-form"
          name="contact"
          method="POST"
          onChange={this.handleChange}
          onSubmit={this.handleSubmit}
        >
          <p>
            <label htmlFor="contactName">
              <span className="label-input">{label.about.FORM_NAME}</span>
              <br />
              <input type="text" name="contactName" />
            </label>
          </p>
          <p>
            <label htmlFor="contactEmail">
              <span className="label-input">{label.about.FORM_EMAIL}</span>
              <br />
              <input type="email" name="contactEmail" />
            </label>
          </p>
          <p>
            <label htmlFor="contactPosition">
              <span className="label-input">{label.about.FORM_POSITION}</span>
              <br />
              <input type="text" name="contactPosition" />
            </label>
          </p>
          <p>
            <label htmlFor="contactCompany">
              <span className="label-input">{label.about.FORM_COMPANY}</span>
              <br />
              <input type="text" name="contactCompany" />
            </label>
          </p>
          <p>
            <label htmlFor="contactPhone">
              <span className="label-input">{label.about.FORM_PHONE}</span>
              <br />
              <input type="text" name="contactPhone" />
            </label>
          </p>
          <p>
            <label htmlFor="contactCountry">
              <span className="label-input">{label.about.FORM_COUNTRY}</span>
              <br />
              <input type="text" name="contactCountry" />
            </label>
          </p>
          <p>
            <label htmlFor="contactOffice">
              <span className="label-input">{label.about.FORM_COUNTRY}</span>
              <br />
              <select name="contactOffice" value={contactOffice} readOnly>
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
              <textarea name="contactMessage" />
            </label>
          </p>
          <Recaptcha
            ref={this.recaptcha}
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

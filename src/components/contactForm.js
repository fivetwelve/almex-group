import React from 'react';
import PropTypes from 'prop-types';
// import { navigateTo } from 'gatsby';
// import Recaptcha from 'react-google-recaptcha';
// import 'dotenv/config';

const encode = data =>
  Object.keys(data)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`)
    .join('&');

class ContactForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      message: null,
      params: {},
    };
    this.recaptcha = React.createRef();
  }

  handleChange = evt => {
    this.setState({ params: { [evt.target.name]: evt.target.value } });
  };

  handleRecaptcha = value => {
    this.setState({ params: { 'g-recaptcha-response': value } });
  };

  handleSubmit = evt => {
    const { params } = this.state;
    evt.preventDefault();
    const form = evt.target;
    fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: encode({
        'form-name': form.getAttribute('name'),
        ...params,
      }),
    })
      // .then(() => navigateTo(form.getAttribute('action')))
      .then(() => this.showSuccess())
      .catch(error => this.showError(error));
  };

  // handleSubmit = e => {
  //   fetch('/', {
  //     method: 'POST',
  //     headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  //     body: encode({ 'form-name': 'contact', ...this.state }),
  //   })
  //     .then(() => alert('Success!'))
  //     .catch(error => alert(error));

  //   e.preventDefault();
  // };

  showError = error => {
    this.setState({ message: error });
  };

  showSuccess = () => {
    this.setState({ message: 'Success!' });
  };

  render() {
    const { label } = this.props;
    const { message } = this.state;
    return (
      <div>
        {/* <form name="contact" method="POST" data-netlify="true" data-netlify-honeypot="bot-field">
          <input type="hidden" name="form-name" value="contact" />
          <p hidden>
            <label htmlFor="bot-field">
              <input hidden name="bot-field" />
            </label>{' '}
          </p>
          <p>
            <label htmlFor="name">
              <span className="label-input">{label.about.FORM_NAME}</span>
              <br />
              <input type="text" name="name" />
            </label>
          </p>
          <p>
            <label htmlFor="email">
              <span className="label-input">{label.about.FORM_EMAIL}</span>
              <br />
              <input type="email" name="email" />
            </label>
          </p>
          <p>
            <label htmlFor="company">
              <span className="label-input">{label.about.FORM_COMPANY}</span>
              <br />
              <input type="text" name="company" />
            </label>
          </p>
          <p>
            <label htmlFor="phone">
              <span className="label-input">{label.about.FORM_PHONE}</span>
              <br />
              <input type="text" name="phone" />
            </label>
          </p>
          <p>
            <label htmlFor="country">
              <span className="label-input">{label.about.FORM_COUNTRY}</span>
              <br />
              <input type="text" name="country" />
            </label>
          </p>
          <p>
            <label htmlFor="position">
              <span className="label-input">{label.about.FORM_POSITION}</span>
              <br />
              <input type="text" name="position" />
            </label>
          </p>
          <p>
            <label htmlFor="office">
              <span className="label-input">{label.about.FORM_COUNTRY}</span>
              <br />
              <select id="office" name="office">
                <option value="">Canada</option>
                <option value="">USA</option>
              </select>
            </label>
          </p>

          <p>
            <label htmlFor="message">
              <span className="label-input">{label.about.FORM_MESSAGE}</span>
              <br />
              <textarea name="message" />
            </label>
          </p>
          <Recaptcha
            ref={this.recaptcha}
            sitekey={process.env.SITE_RECAPTCHA_KEY}
            onChange={this.handleRecaptcha}
          />
          <p>
            <button type="submit">Send</button>
          </p>
          {message && <p>{message}</p>}
        </form> */}
        <form name="contact" method="POST" data-netlify="true" onSubmit={this.handleSubmit2}>
          <input type="hidden" name="form-name" value="contact" />
          <p>
            <label htmlFor="name">
              Your Name: <input type="text" name="name" />
            </label>
          </p>
          <p>
            <label htmlFor="email">
              Your Email: <input type="email" name="email" />
            </label>
          </p>
          <p>
            <label htmlFor="role[]">
              Your Role:{' '}
              <select name="role[]" multiple>
                <option value="leader">Leader</option>
                <option value="follower">Follower</option>
              </select>
            </label>
          </p>
          <p>
            <label htmlFor="message">
              Message: <textarea name="message" />
            </label>
          </p>
          <p>
            <button type="submit">Send</button>
          </p>
          {message && <p>{message}</p>}
        </form>
      </div>
    );
  }
}

ContactForm.defaultProps = {
  label: {},
};

ContactForm.propTypes = {
  label: PropTypes.shape({
    about: PropTypes.object,
  }),
};

export default ContactForm;

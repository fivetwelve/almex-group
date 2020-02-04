import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'gatsby';
// import { Location } from '@reach/router';
import DayPicker, { DateUtils } from 'react-day-picker';
import MomentLocaleUtils, { formatDate } from 'react-day-picker/moment';
import { IconContext } from 'react-icons';
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa';
import GraphImg from 'graphcms-image';
import ReactMarkdown from 'react-markdown';
import Layout from '../src/components/layout';
import TrainingEventsResults from '../src/components/trainingEventsResults';
import InstituteForm from '../src/components/instituteForm';
import { makeid } from '../src/utils/functions';
import { LANGUAGES } from '../src/constants';
import '../src/styles/institute.scss';
import '../src/styles/dayPicker.scss';

import logo from '../static/img/logo-institute.svg';

const allowHTML = { html: true };

// eslint-disable-next-line react/prop-types
const Navbar = ({ onPreviousClick, onNextClick }) => (
  <div className="DayPicker-NavBar">
    <button className="nav-prev" type="button" onClick={() => onPreviousClick()}>
      <span aria-hidden="true" className="dd-icon">
        <IconContext.Provider value={{ className: 'icon' }}>
          <FaAngleLeft aria-hidden />
        </IconContext.Provider>
      </span>
    </button>
    <button className="nav-next" type="button" onClick={() => onNextClick()}>
      <IconContext.Provider value={{ className: 'icon' }}>
        <FaAngleRight aria-hidden />
      </IconContext.Provider>
    </button>
  </div>
);

// const InstituteTemplate = ({ data, pageContext }) => {
//   const { locale, region } = pageContext;

class InstituteTemplate extends Component {
  constructor(props) {
    super(props);
    const { trainingEvents } = props.data.cms.page.institute;
    const { locale } = props.pageContext;
    const parsedEvents = [];
    if (trainingEvents.length > 0) {
      trainingEvents.forEach(event => {
        const { startDate, endDate, ...rest } = event;
        /* normalize dates to simplify date comparison when selecting and filtering */
        const normalizedDate1 = formatDate(event.startDate);
        const normalizedDate2 = !endDate ? normalizedDate1 : formatDate(event.endDate);
        const newEvent = { startDate: normalizedDate1, endDate: normalizedDate2, ...rest };
        parsedEvents.push(newEvent);
      });
    }
    /* For dates, ensure Spain's Spanish uses generic Spanish locale */
    const calendarLocale = locale === LANGUAGES.ES_ES ? LANGUAGES.ES : locale;
    this.state = {
      allEvents: parsedEvents,
      calendarLocale,
      // continent: CONTINENTS.GLOBAL,
      events: null,
      selectedDay: undefined,
    };
  }

  componentDidMount() {
    this.handleDayClick(new Date(), {
      selected: undefined,
    });
  }

  handleDayClick = (day, { selected }) => {
    const { allEvents, continent } = this.state;
    const events = selected
      ? []
      : allEvents.filter(event => {
          // if (continent === CONTINENTS.GLOBAL) {
          //   return DateUtils.isDayInRange(day, {
          //     from: new Date(event.startDate),
          //     to: new Date(event.endDate),
          //   })
          //     ? event
          //     : null;
          // }
          return (
            event.continent === continent &&
            (DateUtils.isDayInRange(day, {
              from: new Date(event.startDate),
              to: new Date(event.endDate),
            })
              ? event
              : null)
          );
        });
    this.setState({
      events,
      selectedDay: selected ? undefined : day,
    });
  };

  isDayHighlighted = day => {
    const { allEvents } = this.state;
    // const daySelected = new Date(day.getFullYear(), day.getMonth(), day.getDate());
    // console.log(daySelected);
    let bool = false;
    bool =
      allEvents &&
      allEvents.some(event =>
        DateUtils.isDayInRange(day, {
          from: new Date(event.startDate),
          to: new Date(event.endDate),
        }),
      );
    return bool;
  };

  renderDay = day => {
    const date = day.getDate();
    return (
      <div>
        <span>{date}</span>
      </div>
    );
  };

  render() {
    const {
      data: {
        cms: {
          aboutLabel,
          brandNavigation,
          headerFooter,
          label,
          navigation,
          page: {
            institute: {
              bannerImage,
              contactAndForm,
              description,
              email,
              instructors,
              instructorsImages,
              pdfDownloads,
              presentation,
              presentationImages,
              sideContent,
              title,
              topics,
              topicsImages,
              // trainingEvents,
            },
          },
        },
      },
      pageContext: { locale, region },
    } = this.props;

    // const {
    //   data: {
    //     cms: {
    //       // aboutLabel,
    //       brandNavigation,
    //       headerFooter,
    //       label,
    //       navigation,
    //       page: {
    //         institute: {
    //           bannerImage,
    //           contactAndForm,
    //           description,
    //           email,
    //           instructors,
    //           instructorsImages,
    //           pdfDownloads,
    //           presentation,
    //           presentationImages,
    //           sideContent,
    //           title,
    //           topics,
    //           topicsImages,
    //           trainingEvents,
    //         },
    //       },
    //     },
    //   },
    // } = this.props;

    const { allEvents, calendarLocale, events, selectedDay } = this.state;

    const eventHighlight = day => {
      const thisDay = new Date(day.getFullYear(), day.getMonth(), day.getDate());
      let bool = false;
      bool =
        allEvents &&
        allEvents.some(event =>
          DateUtils.isDayInRange(thisDay, {
            from: new Date(event.startDate),
            to: new Date(event.endDate),
          }),
        );
      return bool;
    };

    return (
      <Layout
        activeLanguage={locale}
        brandNavigation={brandNavigation}
        childrenClass="institute-page"
        headerFooter={headerFooter}
        label={label}
        navigation={navigation}
        region={region}
        title={title}
      >
        {/* <Location>
          {({ location }) => ( */}
        <>
          <div className="institute-container">
            {bannerImage && (
              <div className="banner-wrapper">
                <div className="banner-image">
                  <GraphImg image={bannerImage} maxWidth={1280} />
                </div>
              </div>
            )}
            <div className="main-container">
              <div className="main-content">
                <h1 className="title">{title}</h1>
                <div className="description">
                  <div className="institute-logo-mobile">
                    <img src={logo} alt="Almex Institute logo" />
                  </div>
                  <ReactMarkdown source={description} options={allowHTML} />
                </div>
                <div className="topics-container">
                  <div className="topics">
                    <ReactMarkdown source={topics} options={allowHTML} />
                  </div>
                  {topicsImages.length > 0 && (
                    <div className="images">
                      {topicsImages.map(image => (
                        <GraphImg key={makeid()} image={image} maxWidth={400} />
                      ))}
                    </div>
                  )}
                </div>
                <div className="presentation-container">
                  {presentationImages.length > 0 && (
                    <div className="images">
                      {presentationImages.map(image => (
                        <GraphImg key={makeid()} image={image} maxWidth={400} />
                      ))}
                    </div>
                  )}
                  <div className="presentation">
                    <ReactMarkdown source={presentation} options={allowHTML} />
                  </div>
                </div>
                <div className="instructors-container">
                  <div className="instructors">
                    <ReactMarkdown source={instructors} options={allowHTML} />
                  </div>
                  {instructorsImages.length > 0 && (
                    <div className="images">
                      {instructorsImages.map(image => (
                        <GraphImg key={makeid()} image={image} maxWidth={400} />
                      ))}
                    </div>
                  )}
                </div>
                {pdfDownloads.length > 0 && (
                  <div className="downloads">
                    {pdfDownloads.map(download => (
                      <div key={makeid()} className="pdf">
                        <div className="pdf-icon" />
                        <a href={download.url}>
                          {download.documentTitle || download.fileName.split('.pdf')[0]}
                        </a>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <aside className="aside-container">
                <div className="institute-logo">
                  <img src={logo} alt="Almex Institute logo" />
                </div>
                {sideContent.map(content => (
                  <ReactMarkdown key={makeid()} source={content} options={allowHTML} />
                ))}
              </aside>
            </div>
            {allEvents.length > 0 && (
              <>
                <hr className="divider" />
                <div className="training-events-container">
                  <div className="training-events-main">
                    <div className="training-events-left">
                      <DayPicker
                        renderDay={this.renderDay}
                        selectedDays={selectedDay}
                        onDayClick={this.handleDayClick}
                        showOutsideDays
                        localeUtils={MomentLocaleUtils}
                        locale={calendarLocale}
                        navbarElement={<Navbar />}
                        modifiers={{ eventHighlight }}
                        utc="true"
                      />
                    </div>
                    <div className="training-events-right">
                      {selectedDay !== undefined && events && events.length === 0 && (
                        <div className="training-events-results">
                          <div className="heading">
                            {formatDate(new Date(selectedDay), 'LL', calendarLocale)}{' '}
                            {aboutLabel.about.EVENTS}
                          </div>
                          <p>{aboutLabel.about.NO_EVENTS}</p>
                        </div>
                      )}
                      {events && events.length > 0 && (
                        <div className="training-events-results">
                          <div className="heading">
                            {formatDate(new Date(selectedDay), 'LL', calendarLocale)}{' '}
                            {aboutLabel.about.EVENTS}
                          </div>
                          <TrainingEventsResults
                            calendarLocale={calendarLocale}
                            events={[events[0]]}
                            labels={aboutLabel.about}
                            // location={location}
                            selectedDay={formatDate(selectedDay)}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </>
            )}

            <hr className="divider" />
            <div className="form-container">
              <ReactMarkdown source={contactAndForm} options={allowHTML} />
              <InstituteForm label={label} email={email} />
            </div>
          </div>
        </>
        {/* )}
        </Location> */}
      </Layout>
    );
  }
}

InstituteTemplate.defaultProps = {
  data: {},
  pageContext: {},
};

InstituteTemplate.propTypes = {
  data: PropTypes.shape({
    cms: PropTypes.shape({
      aboutLabel: PropTypes.object,
      brandNavigation: PropTypes.object,
      headerFooter: PropTypes.object,
      label: PropTypes.object,
      navigation: PropTypes.object,
      page: PropTypes.object,
    }),
  }),
  pageContext: PropTypes.shape({
    locale: PropTypes.string,
    region: PropTypes.string,
  }),
};

export const query = graphql`
  query($id: ID!, $locale: GraphCMS_Locale!, $region: GraphCMS_Region!) {
    cms {
      ...CommonQuery
      aboutLabel: label(where: { availableIn: $region }) {
        about(locale: $locale)
      }
      page(where: { id: $id }) {
        institute: instituteSource {
          bannerImage {
            handle
            width
            height
          }
          contactAndForm(locale: $locale)
          description(locale: $locale)
          email
          sideContent(locale: $locale)
          pdfDownloads(locale: $locale) {
            documentTitle(locale: $locale)
            fileName
            url
          }
          title(locale: $locale)
          topics(locale: $locale)
          presentation(locale: $locale)
          instructors(locale: $locale)
          topicsImages {
            handle
            width
            height
          }
          presentationImages {
            handle
            width
            height
          }
          instructorsImages {
            handle
            width
            height
          }
          trainingEvents(where: { status: PUBLISHED }) {
            startDate
            endDate
            name(locale: $locale)
            title(locale: $locale)
            description(locale: $locale)
            instructors
            location
            timeDuration(locale: $locale)
          }
        }
      }
    }
  }
`;

export default InstituteTemplate;

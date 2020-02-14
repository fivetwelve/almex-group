import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'gatsby';
import { Location } from '@reach/router';
import GraphImg from 'graphcms-image';
import DayPicker, { DateUtils } from 'react-day-picker';
import MomentLocaleUtils, { formatDate } from 'react-day-picker/moment';
import { IconContext } from 'react-icons';
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa';
import ReactMarkdown from 'react-markdown/with-html';
import 'moment/locale/de';
import 'moment/locale/es';
import Layout from '../components/layout';
import EventsResults from '../components/eventsResults';
import ContinentSelector from '../components/continentSelector';
import { renderLink } from '../utils/functions';
import { CONTINENTS, LANGUAGES } from '../constants';
import '../styles/events.scss';
import '../styles/dayPicker.scss';

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

class EventsTemplate extends Component {
  constructor(props) {
    super(props);
    /* need to simplify date from GraphCMS by ignoring its timezone */
    const { events } = props.data.cms.page.eventsSource;
    const { locale } = props.pageContext;
    const parsedEvents = [];
    // console.log('events', events);
    events.forEach(event => {
      const { startDate, endDate, ...rest } = event;
      /* normalize dates to simplify date comparison when selecting and filtering */
      const normalizedDate1 = formatDate(event.startDate);
      const normalizedDate2 = !endDate ? normalizedDate1 : formatDate(event.endDate);
      const newEvent = { startDate: normalizedDate1, endDate: normalizedDate2, ...rest };
      parsedEvents.push(newEvent);
      // console.log(event.startDate.substring(0, 10));
    });

    // console.log('events');
    // console.log('parsedEvents', parsedEvents);
    // console.log(parsedEvents);
    /* For dates, ensure Spain's Spanish uses generic Spanish locale */
    const calendarLocale = locale === LANGUAGES.ES_ES ? LANGUAGES.ES : locale;
    this.state = {
      allEvents: parsedEvents,
      calendarLocale,
      continent: CONTINENTS.GLOBAL,
      events: null,
      selectedDay: undefined,
    };
  }

  componentDidMount() {
    this.handleDayClick(new Date(), {
      selected: undefined,
    });
  }

  setContinent = continent => {
    const { allEvents, selectedDay } = this.state;
    const events = allEvents.filter(event => {
      if (!selectedDay) {
        return null;
      }
      if (selectedDay && continent === CONTINENTS.GLOBAL) {
        return DateUtils.isDayInRange(selectedDay, {
          from: new Date(event.startDate),
          to: new Date(event.endDate),
        })
          ? event
          : null;
      }
      return event.continent === continent &&
        DateUtils.isDayInRange(selectedDay, {
          from: new Date(event.startDate),
          to: new Date(event.endDate),
        })
        ? event
        : null;
    });
    this.setState({
      continent,
      events,
    });
  };

  handleDayClick = (day, { selected }) => {
    const { allEvents, continent } = this.state;
    const events = selected
      ? []
      : allEvents.filter(event => {
          if (continent === CONTINENTS.GLOBAL) {
            return DateUtils.isDayInRange(day, {
              from: new Date(event.startDate),
              to: new Date(event.endDate),
            })
              ? event
              : null;
          }
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
    const { allEvents, continent } = this.state;
    // const daySelected = new Date(day.getFullYear(), day.getMonth(), day.getDate());
    // console.log(daySelected);
    let bool = false;
    if (continent === CONTINENTS.GLOBAL) {
      // console.log(day);
      bool =
        allEvents &&
        allEvents.some(event =>
          DateUtils.isDayInRange(day, {
            from: new Date(event.startDate),
            to: new Date(event.endDate),
          }),
        );
    } else {
      bool =
        allEvents &&
        allEvents.some(
          event =>
            event.continent === continent &&
            DateUtils.isDayInRange(day, {
              from: new Date(event.startDate),
              to: new Date(event.endDate),
            }),
        );
    }
    return bool;
  };

  isAlmexAttending = day => {
    const { allEvents } = this.state;
    return (allEvents && allEvents.some(event => event.startDate === formatDate(day))) || false;
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
            eventsSource: { bannerImage, title, description },
          },
        },
      },
      pageContext: { locale, region },
    } = this.props;
    const { allEvents, calendarLocale, continent, events, selectedDay } = this.state;

    const eventHighlight = day => {
      const thisDay = new Date(day.getFullYear(), day.getMonth(), day.getDate());
      let bool = false;
      if (continent === CONTINENTS.GLOBAL) {
        bool =
          allEvents &&
          allEvents.some(event =>
            DateUtils.isDayInRange(thisDay, {
              from: new Date(event.startDate),
              to: new Date(event.endDate),
            }),
          );
      } else {
        bool =
          allEvents &&
          allEvents.some(
            event =>
              event.continent === continent &&
              DateUtils.isDayInRange(thisDay, {
                from: new Date(event.startDate),
                to: new Date(event.endDate),
              }),
          );
      }
      return bool;
    };

    return (
      <Layout
        activeLanguage={locale}
        brandNavigation={brandNavigation}
        childrenClass="events-page"
        headerFooter={headerFooter}
        label={label}
        navigation={navigation}
        region={region}
        title={title}
      >
        <Location>
          {({ location }) => (
            <>
              <div className="events-container">
                {bannerImage && (
                  <div className="banner-wrapper">
                    <div className="banner-image">
                      <GraphImg image={bannerImage} maxWidth={1280} />
                    </div>
                  </div>
                )}
                <div className="events-intro">
                  <h1 className="title">{title}</h1>
                  <div className="description">
                    <ReactMarkdown
                      source={description}
                      escapeHtml={false}
                      renderers={{
                        link: props => renderLink(props),
                      }}
                    />
                  </div>
                </div>
                <div className="daypicker-dropdown">
                  <ContinentSelector
                    labels={aboutLabel.about}
                    setContinent={this.setContinent}
                    continent={continent}
                  />
                </div>
                <div className="events-main">
                  <div className="events-left">
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
                  <div className="events-right">
                    {selectedDay !== undefined && events && events.length === 0 && (
                      <div className="events-results">
                        <div className="heading">
                          {formatDate(new Date(selectedDay), 'LL', calendarLocale)}{' '}
                          {aboutLabel.about.EVENTS}
                        </div>
                        <p>{aboutLabel.about.NO_EVENTS}</p>
                      </div>
                    )}
                    {events && events.length > 0 && (
                      <div className="events-results">
                        <div className="heading">
                          {formatDate(new Date(selectedDay), 'LL', calendarLocale)}{' '}
                          {aboutLabel.about.EVENTS}
                        </div>
                        <EventsResults
                          calendarLocale={calendarLocale}
                          events={[events[0]]}
                          labels={aboutLabel.about}
                          location={location}
                          selectedDay={formatDate(selectedDay)}
                        />
                      </div>
                    )}
                  </div>
                </div>
                {events && events.length > 1 && (
                  <div className="events-results">
                    <EventsResults
                      calendarLocale={calendarLocale}
                      events={[...events.slice(1)]}
                      labels={aboutLabel.about}
                      location={location}
                      selectedDay={formatDate(selectedDay)}
                    />
                  </div>
                )}
              </div>
            </>
          )}
        </Location>
      </Layout>
    );
  }
}

EventsTemplate.defaultProps = {
  data: {},
  // events: [],
  pageContext: {},
};

EventsTemplate.propTypes = {
  data: PropTypes.shape({
    cms: PropTypes.object,
  }),
  // events: PropTypes.arrayOf(
  //   PropTypes.shape({
  //     title: PropTypes.string,
  //     date: PropTypes.string,
  //   }),
  // ),
  pageContext: PropTypes.shape({
    landingSections: PropTypes.array,
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
        eventsSource {
          bannerImage {
            handle
            width
            height
          }
          title(locale: $locale)
          description(locale: $locale)
          events {
            startDate
            endDate
            continent
            almexAttending
            title(locale: $locale)
            description(locale: $locale)
            location(locale: $locale)
            website
            thumbnail {
              url
            }
          }
        }
      }
    }
  }
`;

export default EventsTemplate;

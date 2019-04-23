import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'gatsby';
import { Location } from '@reach/router';
import GraphImg from 'graphcms-image';
import { DayPicker, DateUtils } from 'react-day-picker';
import MomentLocaleUtils, { formatDate } from 'react-day-picker/moment';
import { IconContext } from 'react-icons';
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa';
import Markdown from 'react-remarkable';
import 'moment/locale/de';
import 'moment/locale/es';
import Layout from '../components/layout';
import EventsResults from '../components/eventsResults';
import { allContinents, allLanguages } from '../constants';
import '../styles/events.scss';
import '../styles/dayPicker.scss';
import ContinentSelector from '../components/continentSelector';

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

class EventsTemplate extends Component {
  constructor(props) {
    super(props);
    /* need to simplify date from GraphCMS by ignoring its timezone */
    const { events } = props.data.cms.page.eventsSource;
    const { locale } = props.pageContext;
    const parsedEvents = [];
    console.log('events');
    console.log(events);
    events.forEach(event => {
      const { startDate, endDate, ...rest } = event;
      /* normalize dates to simplify date comparison when selecting and filtering */
      const normalizedDate1 = formatDate(event.startDate);
      const normalizedDate2 = !endDate ? normalizedDate1 : formatDate(event.endDate);
      const newEvent = { startDate: normalizedDate1, endDate: normalizedDate2, ...rest };
      parsedEvents.push(newEvent);
    });
    /* For dates, ensure Spain's Spanish uses generic Spanish locale */
    const calendarLocale = locale === allLanguages.ES_ES ? allLanguages.ES : locale;
    this.state = {
      allEvents: parsedEvents,
      calendarLocale,
      continent: allContinents.GLOBAL,
      events: null,
      selectedDay: null,
    };
  }

  setContinent = continent => {
    const { allEvents, selectedDay } = this.state;
    const events = allEvents.filter(event => {
      if (!selectedDay) {
        return null;
      }
      if (selectedDay && continent === allContinents.GLOBAL) {
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
          if (continent === allContinents.GLOBAL) {
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
    if (continent === allContinents.GLOBAL) {
      return (
        allEvents &&
        allEvents.some(event =>
          DateUtils.isDayInRange(day, {
            from: new Date(event.startDate),
            to: new Date(event.endDate),
          }),
        )
      );
    }
    return (
      allEvents &&
      allEvents.some(
        event =>
          event.continent === continent &&
          DateUtils.isDayInRange(day, {
            from: new Date(event.startDate),
            to: new Date(event.endDate),
          }),
      )
    );
  };

  isAlmexAttending = day => {
    const { allEvents } = this.state;
    return (allEvents && allEvents.some(event => event.startDate === formatDate(day))) || false;
  };

  renderDay = day => {
    const date = day.getDate();
    const thisClass = this.isDayHighlighted(day)
      ? 'DayPicker-Day--inner-lit'
      : 'DayPicker-Day--inner';
    return (
      <div className={thisClass}>
        <span>{date}</span>
      </div>
    );
  };

  render() {
    const {
      data: {
        cms: {
          brandNavigation,
          headerFooter,
          label,
          aboutLabel,
          page: {
            eventsSource: { bannerImage, title, description },
          },
        },
      },
      pageContext: { locale, siteData, region },
    } = this.props;
    const { calendarLocale, continent, events, selectedDay } = this.state;
    return (
      <Layout
        activeLanguage={locale}
        activeSection=""
        brandNavigation={brandNavigation}
        childrenClass="events"
        region={region}
        title=""
        data={siteData}
        headerFooter={headerFooter}
        label={label}
      >
        <Location>
          {({ location }) => (
            <>
              <div className="events-container">
                <div className="banner-image">
                  <GraphImg image={bannerImage} maxWidth={1280} />
                </div>
                <div className="events-intro">
                  <h1 className="title">{title}</h1>
                  <div className="description">
                    <Markdown source={description} options={allowHTML} />
                  </div>
                </div>
                <div className="events-main">
                  <div className="events-left">
                    <div className="daypicker-dropdown">
                      <ContinentSelector
                        labels={aboutLabel.about}
                        setContinent={this.setContinent}
                        continent={continent}
                      />
                    </div>
                    <DayPicker
                      renderDay={this.renderDay}
                      selectedDays={selectedDay}
                      onDayClick={this.handleDayClick}
                      showOutsideDays
                      localeUtils={MomentLocaleUtils}
                      locale={calendarLocale}
                      navbarElement={<Navbar />}
                    />
                  </div>
                  <div className="events-right">
                    {/* <GraphImg image={bannerImage} maxWidth={200} /> */}
                    <img src="https://placehold.it/400x800" alt="" style={{ width: '100%' }} />
                  </div>
                </div>
                {events && events.length > 0 && (
                  <EventsResults
                    calendarLocale={calendarLocale}
                    events={events}
                    labels={aboutLabel.about}
                    location={location}
                    selectedDay={formatDate(selectedDay)}
                  />
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
    siteData: PropTypes.object,
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
          }
        }
      }
    }
  }
`;

export default EventsTemplate;

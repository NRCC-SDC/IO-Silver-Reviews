import React from 'react';
import App from '../src/components/App';

import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
configure({ adapter: new Adapter() });

// Mock window.fetch()
global.fetch = jest.fn(() => Promise.resolve({
  json: () => Promise.resolve({
    product_id: 1,
    ratings: {
      4: 2,
      5: 1
    },
    recommended: {
      0: 2,
      1: 1
    },
    characteristics: {
      Comfort: {
        id: 3,
        value: "4.6667"
      },
      Fit: {
        id: 1,
        value: "3.6667"
      },
      Length: {
        id: 2,
        value: "3.0000"
      },
      Quality: {
        id: 4,
        value: "3.6667"
      },
      product_id: "1"
    }
  })
}));

describe('Basic Rendering', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<App />);
  });

  test('Should contain a title', () => {
    expect(wrapper.find('#title').text()).toBe('Ratings and Reviews');
  });

  test('Should contain a Ratings component', () => {
    expect(wrapper.exists('Ratings')).toBe(true);
  });

  test('Should contain a Reviews component', () => {
    expect(wrapper.exists('Reviews')).toBe(true);
  });
});

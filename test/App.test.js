import React from 'react';
import App from '../src/components/App';

import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
configure({ adapter: new Adapter() });

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
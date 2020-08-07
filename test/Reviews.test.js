import React from 'react';
import Reviews from '../src/components/Reviews';

import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
configure({ adapter: new Adapter() });

describe('Basic rendering', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<Reviews />);
  });

  test('Should contain a reviews div', () => {
    expect(wrapper.exists('#reviews')).toBe(true);
  });
});
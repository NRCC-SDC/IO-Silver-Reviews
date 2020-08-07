import React from 'react';
import Ratings from '../src/components/Ratings';

import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
configure({ adapter: new Adapter() });

describe('Basic Rendering', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<Ratings />);
  });

  test('Should contain a ratings div', () => {
    expect(wrapper.exists('#ratings')).toBe(true);
  });
});
import React from 'react';
import renderer from 'react-test-renderer';
import AddReview from '../src/components/AddReview';

import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { ExpansionPanelActions } from '@material-ui/core';
configure({ adapter: new Adapter() });

describe('Basic Rendering', () => {
  let wrapper;
  let data = {
    product_id: '3',
    ratings: {
      4: 2,
      5: 1
    },
    recommended: {},
    characteristics: {
      Fit:{ id: 6, value: null },
      Length:{ id: 7, value: null },
      Comfort:{ id: 8, value: null },
      Quality:{ id: 9, value: null }
    }
  }

  beforeEach(() => {
    wrapper = shallow(<AddReview isOpen={true} meta={data} />);
  });

  test('Should contain overall rating element', () => {
    expect(wrapper.exists('#overall-rating')).toBe(true);
  });

  test('Should contain recommend element', () => {
    expect(wrapper.exists('#review-recommend')).toBe(true);
  });

  test('Should contain review summary element', () => {
    expect(wrapper.exists('#review-summary')).toBe(true);
  });

  test('Should contain review body element', () => {
    expect(wrapper.exists('#review-body')).toBe(true);
  });

  test('Should contain characteristics element', () => {
    expect(wrapper.exists('#review-characteristics')).toBe(true);
  });
});

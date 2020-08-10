import React from 'react';
import Reviews from '../src/components/Reviews';
import renderer from 'react-test-renderer';

import { configure, shallow, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
configure({ adapter: new Adapter() });

describe('Basic rendering', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<Reviews reviews={{}} />);
  });

  test('Should contain a reviews element', () => {
    expect(wrapper.exists('#reviews')).toBe(true);
  });

});

describe('Review list', () => {
  let wrapper;
  const data = {
    product: '2',
    page: 0,
    count: 5,
    results: [
      {
        review_id: 57336,
        rating: 2,
        summary: 'testsumm',
        recommend: 1,
        response: null,
        body: 'bodynasty',
        date: '2019-10-22T00:00:00.000Z',
        reviewer_name: 'asdfs',
        helpfulness: 2,
        photos: []
      },
      {
        review_id: 57337,
        rating: 3,
        summary: 'Enter summary here..',
        recommend: 1,
        response: null,
        body: 'bodynasty',
        date: '2019-10-22T00:00:00.000Z',
        reviewer_name: 'asdfs',
        helpfulness: 0,
        photos: []
      },
      {
        review_id: 57338,
        rating: 4,
        summary: 'yahh',
        recommend: 1,
        response: null,
        body: 'newnew',
        date: '2019-10-25T00:00:00.000Z',
        reviewer_name: 'asdfs',
        helpfulness: 0,
        photos: []
      },
      {
        review_id: 57339,
        rating: 4,
        summary: 'yahh',
        recommend: 1,
        response: null,
        body: 'newnew',
        date: '2019-10-25T00:00:00.000Z',
        reviewer_name: 'asdfs',
        helpfulness: 0,
        photos: []
      },
      {
        review_id: 57344,
        rating: 4,
        summary: 'new message',
        recommend: 1,
        response: null,
        body: 'newnew',
        date: '2019-10-25T00:00:00.000Z',
        reviewer_name: 'asdfs',
        helpfulness: 0,
        photos: []
      }
    ]
  }

  beforeEach(() => {
    wrapper = shallow(<Reviews reviews={data} />);
  });
  
  test('Should contain a list of reviews', () => {
    expect(wrapper.exists('#reviews-list')).toBe(true);
  });

  test('Should not contain review elements if no reviews exist for product', () => {
    let noReviews = {
      product: '3',
      page: 0,
      count: 5,
      results: []
    };

    wrapper = shallow(<Reviews reviews={ noReviews } />);
    expect(wrapper.find('.user-review').length).toBe(0);
  });

  test(`Should not display 'More Reviews' button if 2 or fewer reviews are present`, () => {
    wrapper = shallow(<Reviews reviews={{}} />)
    expect(wrapper.exists('#more-reviews')).toBe(false);
  });

  test('Should render 2 reviews', () => {
    expect(wrapper.find('.user-review').length).toBe(2);
  });

  test(`Should display 'More Reviews' button if more than 2 reviews are present`, () => {
    expect(wrapper.exists('#more-reviews')).toBe(true);
  });

  test(`Should display 2 more reviews when 'More Reviews' button is clicked`, () => {
    wrapper.find('#more-reviews').simulate('click');
    expect(wrapper.find('.user-review').length).toBe(4);
  });

  test(`'More Reviews' button should disappear when all reviews are loaded`, () => {
    wrapper.find('#more-reviews').simulate('click');
    wrapper.find('#more-reviews').simulate('click');
    expect(wrapper.exists('#more-reivews')).toBe(false);
  });
});

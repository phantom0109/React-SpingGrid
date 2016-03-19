import React from 'react';
import { shallow } from 'enzyme';
import chai from 'chai';
import chaiEnzyme from 'chai-enzyme';
import SpringGrid from '../src/components/SpringGrid';
import CSSGrid from '../src/components/CSSGrid';

chai.use(chaiEnzyme());
const expect = chai.expect;

describe('Grid components common features', function() {
  const grids = [
    { name: 'SpringGrid', component: SpringGrid },
    { name: 'CSSGrid', component: CSSGrid }
  ];

  grids.forEach(function({ name, component: Grid }) {

    describe(`<${name} />`, function() {

      it('Renders children', function() {
        const wrapper = shallow(
          <div>
            <Grid
              columns={4}
              columnWidth={150}
              duration={2000}
            >
              <span className="item"></span>
              <span className="item"></span>
            </Grid>
          </div>
        );

        expect(wrapper).to.have.exactly(2).descendants('.item');
      });

      it('Can change tag name', function() {
        const wrapper = shallow(
          <Grid
            component="ul"
            columns={4}
            columnWidth={150}
            duration={2000}
          />
        );

        expect(wrapper).to.have.tagName('ul');
      });

    });

  });
});

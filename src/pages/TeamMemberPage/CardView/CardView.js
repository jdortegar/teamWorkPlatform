import React from 'react';

import String from 'src/translations';
import { SimpleCardContainer, SimpleHeader } from 'src/components';

function CardView() {
  return (
    <div>
      <SimpleHeader
        text={
          <div>
            <h2 className="simple-header__title simple-header__title--padding-right">
              Cool
              <span className="simple-header__icon-span simple-header__icon-span--padding-left">
                <a
                  className="simple-header__icon-action simple-header__icon-action--black"
                  title={String.t('teamMemberPage.cardViewTitle')}
                >
                  <i className="fa fa-th-large" />
                </a>
              </span>
              <span className="simple-header__icon-span">
                <a className="simple-header__icon-action" title={String.t('listViewTitle')}>
                  <i className="fa fa-align-justify" />
                </a>
              </span>
            </h2>
          </div>
        }
        type="node"
      />
      <SimpleCardContainer className="Simple-card--no-padding">Cool</SimpleCardContainer>
    </div>
  );
}

export default CardView;

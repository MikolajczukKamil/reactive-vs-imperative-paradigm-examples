/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Button, initMDB, Input, Ripple } from 'mdb-ui-kit';

import { CustomElement, defineComponent } from '../utils';

import componentTemplate from './list-with-filters.html';
import './list-with-filters.scss';
import '../app-paginator';


class ListWithFilterComponent extends CustomElement {
  
  public constructor() { super(componentTemplate); }
  
  protected override connectedCallback(): void {
    super.connectedCallback();
    
    initMDB({ Ripple, Input, Button });
  }
}

export const ListWithFilters = defineComponent('list-with-filters', ListWithFilterComponent);

import { object } from 'prop-types';
import React from 'react';
import MetaTags from '../../components/MetaTags';

const Subpage = ({ meta, data }) => (
   <div className="container">
      <MetaTags meta={meta} />
      <h1>Subpage</h1>
      <div><span>Base currency:</span> {data.base}</div>
      <div><span>Date:</span> {data.date}</div>
      <div>
         {Object.keys(data.rates).map(k => (
            <div key={k}>
               <span>{`${k}:`}</span> {data.rates[k]}
            </div>
         ))}
      </div>
   </div>
);

Subpage.propTypes = {
   meta: object.isRequired,
   data: object.isRequired
};

export default Subpage;

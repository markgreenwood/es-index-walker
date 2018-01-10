const es = require('elasticsearch');
// const Promise = require('bluebird');
const R = require('ramda');
const fs = require('fs');

// const esClient = es.Client({ host: 'localhost:9200' });
const esClient = es.Client({ host: 'elasticsearch.metadata.energysensei.systems:9200', requestTimeout: 60000 });

return esClient.search({
  body: {
    aggs: {
      indexAgg: {
        terms: {
          field: '_index',
          size: 200
        },
        aggs: {
          typesAgg: {
            terms: {
              field: '_type',
              size: 10
            }
          }
        }
      }
    },
    size: 0
  }
})
  .then((response) => {
    // const indices = R.map(R.objOf('index'), R.pluck('key', response.aggregations.indexAgg.buckets));
    const indices = R.path(['aggregations', 'indexAgg', 'buckets'], response);
    const getKeys = R.pluck(['key']);
    const getTypes = R.compose(getKeys, R.path(['typesAgg', 'buckets']));

    // console.log(JSON.stringify(getKeys(indices), null, 2));
    // console.log(JSON.stringify(R.map(getTypes, indices), null, 2));
    return R.zipObj(getKeys(indices), R.map(getTypes, indices));
  })
  .then((response)=> {
    console.log(JSON.stringify(response, null, 2));
    fs.writeFileSync('indices.json', JSON.stringify(response, null, 2));
    console.log(`# of indices: ${R.keys(response).length}`);
  })
  .catch(console.log);
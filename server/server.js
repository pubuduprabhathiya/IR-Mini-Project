const client = require('./elasticsearch/client');
const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());

const filterFields = ["Artists.keyword", "Genre.keyword", "Lyricists.keyword",  "Music Composers.keyword"];

app.get('/filters', (req, res) => {
    const filterFieldResults = {};
    async function sendESRequest() {
        for (let i=0; i < filterFields.length; i++) {
            const body = await client.search({
                index: 'songs',
                body: {
                  size: 0,
                  aggs: {
                      distinct_values: {
                          terms: {
                              field: filterFields[i],
                              size : 100
                          }
                      }
                  }
                },
              });
              filterFieldResults[filterFields[i]] = body.aggregations.distinct_values.buckets;
        }
        res.json(filterFieldResults);
    }
    sendESRequest();
});


app.get('/results', (req, res) => {
  const queryWithFilters =JSON.parse(req.query.searchQuery)  
    const filter = [];
    var filterCount = 0;
    matchPhrase = {}

    for (let i=0; i < filterFields.length; i++) {
        for (let j=0; j < queryWithFilters.filters[filterFields[i]].length; j++) {
            matchPhrase = {}
            matchPhrase[filterFields[i]] = queryWithFilters.filters[filterFields[i]]
            filter[filterCount] = {
                "terms": matchPhrase
                }
                filterCount++;
        }
    }
    

    const should = [];
    var shouldCount = 0;
    if(queryWithFilters.search!=""){
    for (let i=0; i < queryWithFilters.matchResults.length; i++) {
        match = {}
        match[queryWithFilters.matchResults[i]] = queryWithFilters.search
        should[shouldCount] = {
            "match_phrase": match
            }
            shouldCount++;
    }
}
      
    const bool = {
        "must": [], 
        "filter": filter,
        "should": should,
        "must_not": []
      };
  
    async function sendESRequest() {
        console.log("bool",JSON.stringify(bool))
        const body = await client.search({
        index: 'songs',
        body: {
            min_score: 0.5,
            size: 105,
            query: {
                "bool": bool
            },
        },
        });
        res.json(body.hits.hits);
    }
    sendESRequest();
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => console.group(`Server started on ${PORT}`));
package bleve

const indexMapping = `
{
  "default_mapping": {
    "enabled": true,
    "dynamic": false,
    "properties": {
      "uuid": {
        "enabled": true,
        "dynamic": false,
        "fields": [
          {
            "type": "text",
            "analyzer": "keyword",
            "store": true,
            "index": true,
            "include_in_all": true
          }
        ],
        "default_analyzer": ""
      },
      "content": {
        "enabled": true,
        "dynamic": false,
        "fields": [
          {
            "type": "text",
            "analyzer": "simple",
            "store": true,
            "index": true,
            "include_term_vectors": true,
            "include_in_all": true
          }
        ],
        "default_analyzer": ""
      },
      "createdAt": {
        "enabled": true,
        "dynamic": true,
        "fields": [
          {
            "type": "datetime",
            "store": true,
            "index": true,
            "include_in_all": true
          }
        ],
        "default_analyzer": ""
      },
      "updatedAt": {
        "enabled": true,
        "dynamic": true,
        "fields": [
          {
            "type": "datetime",
            "store": true,
            "index": true,
            "include_in_all": true
          }
        ],
        "default_analyzer": ""
      }
    },
    "default_analyzer": ""
  },
  "type_field": "_type",
  "default_type": "_default",
  "default_analyzer": "simple",
  "default_datetime_parser": "dateTimeOptional",
  "default_field": "_all",
  "store_dynamic": false,
  "index_dynamic": false,
  "analysis": {}
}
`

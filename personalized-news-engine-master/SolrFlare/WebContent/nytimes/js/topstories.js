var Manager;

(function ($) {

  $(function () {
    Manager = new AjaxSolr.Manager({
      //solrUrl: 'http://reuters-demo.tree.ewdev.ca:9090/reuters/'
      // If you are using a local Solr instance with a "reuters" core, use:
       solrUrl: 'http://localhost:8983/solr/rss/'
      // If you are using a local Solr instance with a single core, use:
      // solrUrl: 'http://localhost:8983/solr/'
    });
    var theUrl = "http://localhost:8983/solr/rss/dataimport?command=full-import&clean=false";
    var xmlHttp = null;
    xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, false );
    Manager.addWidget(new AjaxSolr.ResultWidget({
      id: 'result',
      target: '#docs'
    }));
    Manager.addWidget(new AjaxSolr.PagerWidget({
      id: 'pager',
      target: '#pager',
      prevLabel: '&lt;',
      nextLabel: '&gt;',
      innerWindow: 1,
      renderHeader: function (perPage, offset, total) {
        $('#pager-header').html($('<span></span>').text('displaying ' + Math.min(total, offset + 1) + ' to ' + Math.min(total, offset + perPage) + ' of ' + total));
      }
    }));
    //var fields = [ 'topics', 'organisations', 'exchanges' ]; %change
    var fields = [ 'category']
    for (var i = 0, l = fields.length; i < l; i++) {
      Manager.addWidget(new AjaxSolr.TagcloudWidget({
        id: fields[i],
        target: '#' + fields[i],
        field: fields[i]
      }));
    }
    Manager.addWidget(new AjaxSolr.CurrentSearchWidget({
      id: 'currentsearch',
      target: '#selection'
    }));
    Manager.addWidget(new AjaxSolr.AutocompleteWidget({
      id: 'text',
      target: '#search',
      //fields: [ 'topics', 'organisations', 'exchanges' ] %change
      fields: [ 'category' ]
    }));
    Manager.addWidget(new AjaxSolr.CountryCodeWidget({
      id: 'countries',
      target: '#countries',
      field: 'countryCodes'
    }));
    Manager.addWidget(new AjaxSolr.CalendarWidget({
      id: 'calendar',
      target: '#calendar',
      field: 'date'
    }));
    Manager.init();
    Manager.store.addByValue('q', '*:*');
    var params = {
      facet: true,
      //'facet.field': [ 'topics', 'organisations', 'exchanges', 'countryCodes' ], %change
      'facet.field': [ 'category' ],
      'facet.limit': 20,
      'facet.mincount': 1,
      ///'f.topics.facet.limit': 50, %change
      'facet.category.limit': 50,
      //'f.countryCodes.facet.limit': -1,%change
      //
      
      //'facet.date': 'date',
      //'facet.date.start': '1987-02-26T00:00:00.000Z/DAY',
      //'facet.date.end': '1987-10-20T00:00:00.000Z/DAY+1DAY',
      //'facet.date.gap': '+1DAY',
      //'json.nl': 'map'
    };
    for (var name in params) {
      Manager.store.addByValue(name, params[name]);
    }
    var pref1 = "computer";
    var pref2 = "travel";
    var pref3 = "science";
    var params = {
       defType: 'edismax',
    		bq:[pref1+"^30"+pref2+"^40"+pref3+"^80"]
    };
    for (var name in params){
    	Manager.store.addByValue(name, params[name]);
    };
    Manager.doRequest();
  });

  $.fn.showIf = function (condition) {
    if (condition) {
      return this.show();
    }
    else {
      return this.hide();
    }
  }

})(jQuery);

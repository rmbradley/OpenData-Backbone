this.MyOD&&"object"==typeof this.MyOD||(this.MyOD={}),function(){"use strict";MyOD=new Backbone.Marionette.Application,MyOD.on("before:start",function(){this.searchModel=new MyOD.Models.SearchModel,this.layout=new MyOD.Main.Layout}),MyOD.on("start",function(){Backbone.history&&(Backbone.history.start({pushState:!1,root:"/OpenData-Backbone"})||MyOD.navigate("404",{trigger:!0})),Backbone.history.on("route",this.layout.setClasses),this.layout.setClasses()}),MyOD.navigate=function(e,t){Backbone.history.navigate(e,t)},MyOD.search=function(){var e=MyOD.searchModel.getRoute();MyOD.navigate(e,{trigger:!0})},MyOD.navigate404=function(){MyOD.navigate("404",{trigger:!0,replace:!0})},MyOD.queryStringToObject=function(){var e={},t=Backbone.history.getFragment().split("?")[1];if(t){var n=t.split("&");_.each(n,function(t){t=t.split("="),e[t[0]]="q"===t[0]?t[1].replace(/\+/g," ")||"":decodeURIComponent(t[1]||"")})}return e},MyOD.getBloodhound=function(){return this.bloodhound||(this.bloodhound=new Bloodhound({datumTokenizer:Bloodhound.tokenizers.obj.whitespace("value"),queryTokenizer:Bloodhound.tokenizers.whitespace,limit:10,remote:{url:MyOD.config.api+"datasets/autocomplete.json?query=%QUERY",rateLimitWait:150,replace:function(e,t){return e.replace("%QUERY",t)},filter:function(e){return e.data}}})),this.bloodhound},MyOD.onBeforeDestroy=function(){Backbone.history.stop()}}(),function(){"use strict";MyOD.module("Utils",function(e,t,n,a,i,o){e.MapManager=a.Object.extend({initialize:function(){o.bindAll(this,"updateStyle"),this.globalChannel=n.Wreqr.radio.channel("global");var e=i.Deferred();this.dojoReady=e.promise(),require(["esri/map","esri/layers/FeatureLayer","plugins/smartMapping","dojo/domReady!"],function(){e.resolve()}),t.reqres.setHandler("smaps:update:style",this.updateStyle)},onBeforeDestroy:function(){this.map&&this.map.destroy()},proxyEvent:function(e,t){this.globalChannel.vent.trigger(e,t)},createMap:function(e,t){var n={center:[-56.049,38.485],zoom:3,basemap:"dark-gray"};if(this.map=new esri.Map(e,n),t.coords){var a=new esri.geometry.Extent(t.coords[0][0],t.coords[0][1],t.coords[1][0],t.coords[1][1],new esri.SpatialReference({wkid:4326}));this.map.setExtent(a)}this.map.on("load",dojo.hitch(this,this.proxyEvent,"map:load")),this.map.on("extent-change",dojo.hitch(this,this.proxyEvent,"map:extent-change")),this.map.on("layer-add",dojo.hitch(this,this.proxyEvent,"map:layer-add"))},getDatasetInfoTemplate:function(e){var t=e.get("display_field");return new esri.InfoTemplate("${"+t+"}","${*}")},getDatasetLayerOpts:function(e){return{mode:esri.layers.FeatureLayer.MODE_AUTO,outFields:"*",infoTemplate:this.getDatasetInfoTemplate(e)}},addDataset:function(e){var t=this.getDatasetLayerOpts(e);this.datasetLayer=new esri.layers.FeatureLayer(e.get("url"),t),this.datasetLayer.on("load",this.onLoadDataset),this.datasetLayer.on("load",dojo.hitch(this,this.proxyEvent,"map:datasetlayer:load")),this.datasetLayer.on("click",dojo.hitch(this,this.proxyEvent,"map:datasetlayer:click")),this.datasetLayer.on("query-limit-exceeded",dojo.hitch(this,this.proxyEvent,"map:datasetlayer:query-limit-exceeded")),this.datasetLayer.on("update-end",dojo.hitch(this,this.proxyEvent,"map:datasetlayer:update-end")),this.map.addLayer(this.datasetLayer)},onLoadDataset:function(e){e.layer.minScale=0,e.layer.maxScale=0},updateStyle:function(e){var t=i.Deferred(),n=e.layer=this.datasetLayer,a=function(a){n.setRenderer(a.renderer),n.graphics&&n.graphics.length&&(n.graphics[0].attributes[e.field]?n.redraw():n.refresh()),t.resolve(a.renderer)};return"polygon"===e.type?esri.renderer.smartMapping.createClassedColorRenderer(e).then(function(e){a(e)}):"point"!==e.type||e.heatmap?"point"===e.type&&e.heatmap&&esri.renderer.smartMapping.createHeatmapRenderer(e).then(function(e){a(e)}):esri.renderer.smartMapping.createClassedSizeRenderer(e).then(function(e){a(e)}),t.promise()}})})}(),function(){"use strict";MyOD.module("Base",function(e,t,n,a){e.SearchView=a.ItemView.extend({onRender:function(){this.initTypeahead()},initTypeahead:function(){var e={highlight:!0,minLength:3,hint:!1},n=t.getBloodhound();n.initialize();var a={name:"datasets",displayKey:function(e){return e},templates:{empty:""},source:n.ttAdapter()};this.ui.search.typeahead(e,a)},onTypeaheadSelected:function(){this.model.set({q:this.ui.search.typeahead("val"),page:1}),this.search()},updateModel:function(){var e=this.ui.search.typeahead("val");this.model.set({q:e,page:1})},onKeyDown:function(e){13===e.which&&(e.preventDefault(),this.updateModel(),this.search())},onKeyUp:function(){this.updateModel()},search:function(){t.search()}})})}(),function(){"use strict";MyOD.module("Models",function(e,t,n,a,i,o){e.SearchModel=n.Model.extend({defaults:{q:"",page:1,per_page:20,total_count:0,sort_by:"relevance"},queryStringParams:["q","page","per_page","sort_by"],getRoute:function(e){var t=o.pick(this.toJSON(),this.queryStringParams),n="datasets";return n+=e?".json?":"?",n+=i.param(t)},getUrl:function(){return t.config.api+this.getRoute(!0)}})})}(),MyOD.config={api:"//opendata.arcgis.com/"},this.JST={"datasets/templates/dataset":function(obj){obj||(obj={});{var __t,__p="";_.escape}with(obj)__p+='<div class="clearfix">\n  <h2 class="pull-left clearfix"><img class="img-thumbnail" src="'+(null==(__t=thumbnail_url)?"":__t)+'"><span>'+(null==(__t=name)?"":__t)+'</span></h2>\n  <div class="dropdown pull-right">\n    <button class="btn btn-primary" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">\n      Download\n      <span class="caret"></span>\n    </button>\n    <ul class="dropdown-menu" role="menu" aria-labelledby="dLabel">\n      <li><a href="'+(null==(__t=baseUrl)?"":__t)+'.csv" target="_blank" download>Spreadsheet</a></li>\n      <li><a href="'+(null==(__t=baseUrl)?"":__t)+'.kml" target="_blank" download>KML</a></li>\n      <li><a href="'+(null==(__t=baseUrl)?"":__t)+'.zip" target="_blank" download>Shapefile</a></li>\n      <li class="divider"></li>\n      <li><a href="'+(null==(__t=arcgis_online_item_url)?"":__t)+'" target="_blank">View in ArcGIS Online</a></li>\n      <li><a href="'+(null==(__t=url)?"":__t)+'" target="_blank">API</a></li>\n    </ul>\n  </div>\n</div>\n\n\n<dl class="dl-horizontal">\n  \n  <dt>Description:</dt>\n  <dd>'+(null==(__t=description)?"":__t)+"</dd>\n  \n  <dt>Owner:</dt>\n  <dd>"+(null==(__t=owner)?"":__t)+"</dd>\n\n  <dt>Created:</dt>\n  <dd>"+(null==(__t=moment(created_at).calendar())?"":__t)+"</dd>\n  \n  <dt>Updated:</dt>\n  <dd>"+(null==(__t=moment(updated_at).calendar())?"":__t)+"</dd>\n\n  <dt>Tags:</dt>\n  <dd>"+(null==(__t=tags.join(" | "))?"":__t)+"</dd>\n  \n  <dt>Views:</dt>\n  <dd>"+(null==(__t=views)?"":__t)+'</dd>\n\n</dl>\n\n<div class="container">\n  <div id="map"></div>\n  <div id="smaps">\n    <div class="container"></div>\n  </div>\n</div>\n\n<div id="table-container" class="container"></div>\n';return __p},"datasets/templates/table-row":function(obj){obj||(obj={});{var __t,__p="";_.escape,Array.prototype.join}with(obj)_.each(fields,function(e){__p+="\n  <td>"+(null==(__t=attributes[e.name])?"":__t)+"</td>\n"}),__p+="\n";return __p},"datasets/templates/table":function(obj){obj||(obj={});{var __t,__p="";_.escape,Array.prototype.join}with(obj)__p+="<h4>Showing "+(null==(__t=from.toLocaleString())?"":__t)+" to "+(null==(__t=to.toLocaleString())?"":__t)+" of "+(null==(__t=total.toLocaleString())?"":__t)+'</h4>\n<div class="table-responsive">  \n  <table class="table table-striped table-bordered table-hover">\n    <thead>\n      <tr>\n        ',_.each(fields,function(e){__p+="\n          ",__p+=sortField===e.name?'\n            <th data-field-name="'+(null==(__t=e.name)?"":__t)+'" class="'+(null==(__t=sortClass)?"":__t)+'">\n              '+(null==(__t=e.alias||e.name)?"":__t)+'\n              <span class="glyphicon small '+(null==(__t=sortIconClass)?"":__t)+' text-muted" aria-hidden="true"></span>\n            </th>\n          ':'\n            <th data-field-name="'+(null==(__t=e.name)?"":__t)+'">\n              '+(null==(__t=e.alias||e.name)?"":__t)+"\n            </th>\n          ",__p+="\n        "}),__p+='\n      </tr>\n    </thead>\n    <tbody></tbody>\n  </table>\n</div>\n<nav>\n  <ul class="pagination">\n    ',pages.length>1&&(__p+='\n      <li id="page-prev" class="'+(null==(__t=firstPage)?"":__t)+'"><a data-page="'+(null==(__t=prevPage)?"":__t)+'"><span aria-hidden="true">&laquo;</span></a></li>\n      \n      ',_.each(pages,function(e){__p+='\n        <li class="'+(null==(__t=e.active)?"":__t)+'"><a class="page-number" data-page="'+(null==(__t=e.page)?"":__t)+'">'+(null==(__t=e.page)?"":__t)+"</a></li>\n      "}),__p+='\n\n      <li id="page-next" class="'+(null==(__t=lastPage)?"":__t)+'"><a data-page="'+(null==(__t=nextPage)?"":__t)+'"><span aria-hidden="true">&raquo;</span></a></li>\n    '),__p+="\n  </ul>\n</nav>";return __p},"error/templates/404":function(obj){obj||(obj={});{var __p="";_.escape}with(obj)__p+='<div class="alert alert-danger" role="alert">\n  <h2>The page you are looking for doesn\'t exist.</h2>\n</div>\n';return __p},"error/templates/500":function(obj){obj||(obj={});{var __p="";_.escape}with(obj)__p+='<div class="alert alert-danger" role="alert">\n  <h2>An error ocurred.</h2>\n</div>\n';return __p},"home/templates/home":function(obj){obj||(obj={});{var __p="";_.escape}with(obj)__p+='<div class="jumbotron" id="hero">\n  <h1 class="page-header">My Open Data</h1>\n\n\n  <p>\n    <div class="input-group input-group-lg">\n      <label class="sr-only" for="search">Search</label>\n      <input type="search" name="search" id="search" class="form-control" placeholder="search for open data">\n      <span class="input-group-btn">\n        <button id="search-btn" class="btn btn-default" type="button">\n          <span class="glyphicon glyphicon-search" aria-hidden="true"></span>\n        </button>\n      </span>\n    </div>\n  </p>\n\n</div>\n';return __p},"results/templates/results-empty":function(obj){obj||(obj={});{var __p="";_.escape}with(obj)__p+='<td colspan="7" class="text-center">...</td>';return __p},"results/templates/results-item":function(obj){obj||(obj={});{var __t,__p="";_.escape}with(obj)__p+="<td>"+(null==(__t=name)?"":__t)+"</td>\n<td>"+(null==(__t=owner)?"":__t)+"</td>\n<td>"+(null==(__t=record_count)?"":__t)+"</td>\n<td>"+(null==(__t=layer_type)?"":__t)+"</td>\n<td>"+(null==(__t=views)?"":__t)+"</td>\n<td>"+(null==(__t=moment(created_at).fromNow())?"":__t)+"</td>\n<td>"+(null==(__t=moment(updated_at).fromNow())?"":__t)+"</td>";return __p},"results/templates/results-loading":function(obj){obj||(obj={});{var __p="";_.escape}with(obj)__p+='<td colspan="7" class="text-center">\n  <div class="progress">\n    <div class="progress-bar progress-bar-striped active" role="progressbar" aria-valuenow="40" aria-valuemin="0" aria-valuemax="100" style="width: 45%">\n      <span class="sr-only">45% Complete</span>\n    </div>\n  </div>\n</td>';return __p},"results/templates/results":function(obj){obj||(obj={});{var __t,__p="";_.escape,Array.prototype.join}with(obj)__p+="<h2>\n  ",collectionIsLoading||(__p+='\n    Your search for <em>"'+(null==(__t=q)?"":__t)+'"</em> yielded '+(null==(__t=total_count.toLocaleString())?"":__t)+" datasets\n  "),__p+='\n</h2>\n\n<div class="table-responsive">  \n  <table class="table table-striped table-bordered table-hover">\n    <thead>\n      <tr>\n        <th>NAME</th>\n        <th>OWNER</th>\n        <th>RECORDS</th>\n        <th>LAYER TYPE</th>\n        <th>VIEWS</th>\n        <th>CREATED</th>\n        <th>UPDATED</th>\n      </tr>\n    </thead>\n    <tbody></tbody>\n  </table>\n</div>\n<nav>\n  <ul class="pagination">\n    ',pages.length>1&&(__p+='\n      <li id="page-prev" class="'+(null==(__t=firstPage)?"":__t)+'"><a href="'+(null==(__t=prevUrl)?"":__t)+'" data-page="'+(null==(__t=prevPage)?"":__t)+'"><span aria-hidden="true">&laquo;</span></a></li>\n      \n      ',_.each(pages,function(e){__p+='\n        <li class="'+(null==(__t=e.active)?"":__t)+'"><a href="'+(null==(__t=e.url)?"":__t)+'" class="page-number" data-page="'+(null==(__t=e.page)?"":__t)+'">'+(null==(__t=e.page)?"":__t)+"</a></li>\n      "}),__p+='\n\n      <li id="page-next" class="'+(null==(__t=lastPage)?"":__t)+'"><a href="'+(null==(__t=nextUrl)?"":__t)+'" data-page="'+(null==(__t=nextPage)?"":__t)+'"><span aria-hidden="true">&raquo;</span></a></li>\n    '),__p+="\n  </ul>\n</nav>";return __p}},function(){"use strict";MyOD.module("Main",function(e){e.HeaderSearchView=MyOD.Base.SearchView.extend({initialize:function(){this.listenTo(this.model,"change:q",this.onQueryChanged)},el:"#header-search-container",template:!1,events:{"keydown #header-search":"onKeyDown","keyup #header-search":"onKeyUp","click #header-search-btn":"search","typeahead:selected input":"onTypeaheadSelected"},ui:{search:"#header-search"},onQueryChanged:function(){this.ui.search.typeahead("val",this.model.get("q"))}})})}(),function(){"use strict";MyOD.module("Main",function(e,t,n,a,i,o){e.Layout=a.LayoutView.extend({initialize:function(){o.bindAll(this,"setClasses"),this.headerSearchView=new e.HeaderSearchView({model:t.searchModel}).render()},el:"body",regions:{main:"#main-region"},events:{"click #home-link":"navigateHome"},navigateHome:function(e){e.metaKey||e.ctrlKey||(e.preventDefault(),t.navigate("",{trigger:!0}))},setClasses:function(){var e=this;0===n.history.getFragment().indexOf("datasets")?e.$el.removeClass("page-home"):e.$el.addClass("page-home")}})})}(),function(){"use strict";MyOD.module("HomeModule",function(e,t){e.View=MyOD.Base.SearchView.extend({initialize:function(){this.model=t.searchModel},template:JST["home/templates/home"],events:{"keydown #search":"onKeyDown","keyup #search":"onKeyUp","click #search-btn":"search","typeahead:selected input":"onTypeaheadSelected"},ui:{search:"#search"},id:"home",onDomRefresh:function(){this.ui.search.focus()}})})}(),function(){"use strict";MyOD.module("HomeModule",function(e,t,n,a){e.Controller=a.Controller.extend({initUi:function(){var n=new e.View;t.layout.getRegion("main").show(n)}})})}(),function(){"use strict";MyOD.module("HomeModule",function(e,t,n){e.Router=n.Marionette.AppRouter.extend({appRoutes:{"":"show"}}),e.addInitializer(function(){new e.Router({controller:e.API})}),e.API={show:function(t){this.homeController||(this.homeController=new e.Controller(t)),this.homeController.initUi(t)}}})}(),function(){"use strict";MyOD.module("Models",function(e,t,n,a,i,o){e.DatasetModel=n.Model.extend({initialize:function(){this.on("sync",this.onSync)},defaults:{id:"",name:"",description:"",tags:[],arcgis_online_item_url:"",owner:"",url:"",created_at:"",updated_at:"",views:0,thumbnail_url:""},parse:function(e){var t=e.data||e;return t},url:function(){return MyOD.config.api+"datasets/"+this.get("id")+".json"},getNumericFields:function(){var e=this.get("fields");return o.filter(e,function(e){return o.contains(["esriFieldTypeSingle","esriFieldTypeDouble","esriFieldTypeInteger"],e.type)})}})})}(),function(){"use strict";MyOD.module("Models",function(e,t,n,a,i,o){e.DatasetCollection=n.Collection.extend({model:e.DatasetModel,url:function(){return t.searchModel.getUrl(!0)},parse:function(e){return t.searchModel.set(o.extend(e.metadata.query_parameters,e.metadata.stats)),e.data}})})}(),function(){"use strict";MyOD.module("ResultsModule",function(e,t,n,a,i){e.ItemView=a.ItemView.extend({template:JST["results/templates/results-item"],model:MyOD.Models.DatasetModel,tagName:"tr",events:{click:"onClick"},onClick:function(){this.trigger("result:clicked",this.model)}}),e.LoadingView=a.ItemView.extend({template:JST["results/templates/results-loading"],tagName:"tr",className:"loading"}),e.EmptyView=a.ItemView.extend({template:JST["results/templates/results-empty"],tagName:"tr"}),e.View=a.CompositeView.extend({initialize:function(){this.listenTo(this,"childview:result:clicked",this.selectDataset)},collectionIsLoading:!0,template:JST["results/templates/results"],childView:e.ItemView,childViewContainer:"tbody",getEmptyView:function(){return this.collectionIsLoading?e.LoadingView:e.EmptyView},events:{"click ul.pagination a":"onPageClicked"},modelEvents:{"change:total_count":"render"},collectionEvents:{sync:"onCollectionSync",error:"onCollectionSync"},id:"page-results",onCollectionSync:function(){this.collectionIsLoading=!1,this.render()},selectDataset:function(e,n){t.navigate("/datasets/"+n.get("id"),{trigger:!0})},onPageClicked:function(e){if(!e.metaKey&&!e.ctrlKey){e.stopPropagation(),e.preventDefault();var n=i(e.target).closest("a").data("page");this.model.set("page",n),t.search()}},templateHelpers:function(){for(var e,n=t.searchModel.toJSON(),a=Math.round(n.total_count),i=+n.page,o=0===i?i+1:i,s=n.per_page,r=Math.ceil(a/s),l=[],d=r>10&&o>6?o-5:1,c=r>d+9?d+9:r,u=this.model.clone(),h=d;c>=h;h++)e=h===o?"active":"",u.set("page",h),l.push({url:u.getRoute(!1),page:h,active:e});var p=this.model.getRoute(!1),_=i;1!==o&&(_=i-1,u.set("page",_),p=u.getUrl());var m=this.model.getRoute(!1),g=i;return r!==o&&(g=i+1,u.set("page",g),m=u.getUrl()),{firstPage:1===o?"disabled":"",lastPage:r===o?"disabled":"",prevUrl:p,nextUrl:m,prevPage:_,nextPage:g,pages:l,collectionIsLoading:this.collectionIsLoading}}})})}(),function(){"use strict";MyOD.module("ResultsModule",function(e,t,n,a){e.Controller=a.Controller.extend({initUi:function(){this.collection=new t.Models.DatasetCollection,this.collection.fetch({cache:!0}),this.view=new e.View({model:t.searchModel,collection:this.collection}),t.layout.getRegion("main").show(this.view)}})})}(),function(){"use strict";MyOD.module("ResultsModule",function(e,t,n){e.Router=n.Marionette.AppRouter.extend({appRoutes:{"datasets(/)":"show"}}),e.addInitializer(function(){new e.Router({controller:e.API})}),e.API={show:function(n){var a=t.queryStringToObject();t.searchModel.set(a),this.resultsController||(this.resultsController=new e.Controller(n)),this.resultsController.initUi(n)}}})}(),function(){"use strict";MyOD.module("Models",function(e,t,n){e.DatasetRow=n.Model.extend({})})}(),function(){"use strict";MyOD.module("Models",function(e,t,n,a,i,o){e.RowCollection=n.Collection.extend({initialize:function(e,t){this.dataset=t.dataset;var n=this.dataset.get("advanced_query_capabilities");this.supportsPagination=n&&n.supportsPagination,n&&!o.isUndefined(n.supports_pagination)&&window.alert("The API has been fixed. Time to update /entities/row-collection.js!"),this.orderBy=this.dataset.get("object_id_field")},perPage:10,page:0,orderBy:"",orderByAsc:!0,model:e.DatasetRow,getQueryUrl:function(){var e=this.dataset.get("url");e+="/query?where=1%3D1&text=&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&relationParam=&outFields=*&returnGeometry=false&maxAllowableOffset=&geometryPrecision=&outSR=&returnIdsOnly=false&returnCountOnly=false&groupByFieldsForStatistics=&outStatistics=&returnZ=false&returnM=false&gdbVersion=&returnDistinctValues=false&f=pjson",this.supportsPagination&&(e+="&resultOffset="+this.page*this.perPage,e+="&resultRecordCount="+this.perPage);var t=this.orderBy;return this.orderByAsc||(t+=" desc"),e+="&orderByFields="+t},url:function(){return this.getQueryUrl()},parse:function(e){var t=e.features;return this.supportsPagination||(t=o.first(t,this.perPage)),t}})})}(),function(){"use strict";MyOD.module("DatasetsModule",function(e,t,n,a,i){e.TableRowView=a.ItemView.extend({initialize:function(e){this.dataset=e.dataset,this.fields=this.dataset.get("fields")},template:JST["datasets/templates/table-row"],templateHelpers:function(){var e=this;return{fields:e.fields}},model:MyOD.Models.DatasetRow,tagName:"tr"}),e.TableView=a.CompositeView.extend({initialize:function(){this.collection=new t.Models.RowCollection([],{dataset:this.model}),this.collection.fetch()},events:{"click ul.pagination li a":"onPageClicked","click thead th":"sort"},collectionEvents:{reset:"render"},template:JST["datasets/templates/table"],childView:e.TableRowView,childViewOptions:function(){var e=this.model;return{dataset:e}},templateHelpers:function(){var e={firstPage:"",lastPage:"",prevPage:0,nextPage:0,pages:[],showPagination:!1,from:1,to:this.collection.perPage,total:this.model.get("record_count"),sortField:this.collection.orderBy,sortClass:this.collection.orderByAsc?"sort_asc":"sort_desc",sortIconClass:this.collection.orderByAsc?"glyphicon-arrow-down":"glyphicon-arrow-up"};if(this.collection.supportsPagination){for(var t,n=Math.ceil(this.model.get("record_count")/this.collection.perPage),a=this.collection.page,i=n>10&&a>6?a-5:1,o=n>i+9?i+9:n,s=[],r=i;o>=r;r++)t=r===a+1?"active":"",s.push({page:r,active:t});var l=this.model.get("record_count"),d=a*this.collection.perPage+1,c=a*this.collection.perPage+this.collection.perPage;c=l>=c?c:l,e={firstPage:0===a?"disabled":"",lastPage:n===a+1?"disabled":"",prevPage:a,nextPage:a+2,pages:s,showPagination:!0,from:d,to:c,total:l,sortField:this.collection.orderBy,sortClass:this.collection.orderByAsc?"sort_asc":"sort_desc",sortIconClass:this.collection.orderByAsc?"glyphicon-chevron-down":"glyphicon-chevron-up"}}return e},childViewContainer:"tbody",onPageClicked:function(e){var t=i(e.target).closest("a"),n=t.closest("li");if(!n.hasClass("disabled")&&!n.hasClass("active")){var a=t.data("page")-1;this.collection.page=a,this.collection.fetch({reset:!0})}},sort:function(e){var t=i(e.target).data("fieldName");t&&(this.collection.orderByAsc=t===this.collection.orderBy?!this.collection.orderByAsc:!0,this.collection.page=0,this.collection.orderBy=t,this.collection.fetch({reset:!0}))}})})}(),function(){"use strict";MyOD.module("DatasetsModule",function(e,t,n,a,i,o){e.View=a.ItemView.extend({initialize:function(e){o.bindAll(this,"changeAttribute","changeRamp"),this.mapManager=e.mapManager},template:JST["datasets/templates/dataset"],id:"page-dataset",ui:{mapDiv:"#map",tableContainer:"#table-container"},modelEvents:{change:"render"},templateHelpers:function(){var e=this.model.url().replace(/.json$/,"");return{baseUrl:e}},onRender:function(){this.tableView=new e.TableView({el:this.ui.tableContainer,model:this.model}).render()},onDomRefresh:function(){if("table"!==this.model.get("layer_type").toLowerCase()){var e=this;this.ui.mapDiv.show(),this.mapManager.dojoReady.done(function(){e.mapManager.createMap("map",{coords:e.model.get("extent").coordinates}),e.mapManager.addDataset(e.model),e.initSmaps()})}},initSmaps:function(){var e=this.model.getNumericFields();if(e.length){this.fieldName=this.fieldName||e[0].name;var t=this.model.get("fields");this.stats=this.getStats(t,this.fieldName),this.type=this.getGeometryType(this.model.get("geometry_type"));var n={fields:e,field:this.fieldName,statistics:this.stats,type:this.type,schemes:this.getSchemes()};this.yuki?(i("#yuki-viz-tools").remove(),this.yuki=new Yuki("smaps",n)):this.yuki=new Yuki("smaps",n),this.yuki.on("change",this.changeAttribute),this.yuki.on("ramp-change",this.changeRamp),this._execStyleMap()}},getStats:function(e,t){var n=o.findWhere(e,{name:t});return n?n.statistics:null},getGeometryType:function(e){switch(e){case"esriGeometryPoint":case"esriGeometryMultipoint":return"point";case"esriGeometryPolyline":return"line";case"esriGeometryPolygon":return"polygon";default:return e.toLowerCase()}},getSchemes:function(){var e,t,n=this;switch(this.type){case"point":e="default",t="size";break;case"polygon":e="high-to-low",t="choropleth"}return esri.styles[t].getSchemes({theme:e,basemap:"dark-gray",geometryType:n.type})},changeAttribute:function(e){var t=this.model.get("fields");this.stats=this.getStats(t,e),this.fieldName=e,this._execStyleMap(this.selectedScheme)},changeRamp:function(e){this.selectedScheme=this.getSchemes().secondarySchemes[e],this._execStyleMap(this.selectedScheme)},_execStyleMap:function(e){var n=this,a={field:this.fieldName,basemap:"dark-gray",statistics:this.stats,type:this.type};e&&(a.scheme=e);t.reqres.request("smaps:update:style",a).done(function(e){"point"===n.type&&n.yuki.buildPointLegend(e.breaks)})},onDestroy:function(){this.mapManager.destroy(),this.tableView.destroy()}})})}(),function(){"use strict";MyOD.module("DatasetsModule",function(e,t,n,a,i,o){e.Controller=a.Controller.extend({initialize:function(){o.bindAll(this,"onModelFetched")},initUi:function(e){this.mapManager=new t.Utils.MapManager,this.model=new t.Models.DatasetModel({id:e}),this.model.fetch().done(this.onModelFetched).fail(function(){t.navigate404()})},onModelFetched:function(){var n=new e.View({model:this.model,mapManager:this.mapManager});t.layout.getRegion("main").show(n)},onBeforeDestroy:function(){this.mapManager&&this.mapManager.destroy()}})})}(),function(){"use strict";MyOD.module("DatasetsModule",function(e,t,n){e.Router=n.Marionette.AppRouter.extend({appRoutes:{"datasets/:id(/)":"show"}}),e.addInitializer(function(){new e.Router({controller:e.API})}),e.API={show:function(t){this.datasetsController||(this.datasetsController=new e.Controller(t)),this.datasetsController.initUi(t)}}})}(),function(){"use strict";MyOD.module("ErrorModule",function(e,t,n,a){e.View=a.ItemView.extend({id:"page-error",getTemplate:function(){var e,t=this.model.get("errorCode");switch(t){case 404:e=JST["error/templates/404"];break;default:e=JST["error/templates/500"]}return e}})})}(),function(){"use strict";MyOD.module("ErrorModule",function(e,t,n,a){e.Controller=a.Controller.extend({initUi:function(a){var i=new n.Model({errorCode:a.errorCode}),o=new e.View({model:i});t.layout.getRegion("main").show(o)}})})}(),function(){"use strict";MyOD.module("ErrorModule",function(e,t,n){e.Router=n.Marionette.AppRouter.extend({appRoutes:{404:"error404",500:"error500"}}),e.addInitializer(function(){new e.Router({controller:e.API})}),e.API={initController:function(){this.errorController||(this.errorController=new e.Controller)},error404:function(){this.initController(),this.errorController.initUi({errorCode:404})},error500:function(){this.initController(),this.errorController.initUi({errorCode:500})}}})}(),$(function(){"use strict";MyOD.start()});
//# sourceMappingURL=../maps/scripts/main.js.map
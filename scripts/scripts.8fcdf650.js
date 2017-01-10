"use strict";angular.module("flyerApp",["ngRoute","ngSanitize","ngTouch","facebook"]).config(["$routeProvider",function(a){a.when("/flyer/:id",{templateUrl:"views/flyer.html",controller:"FlyerCtrl",controllerAs:"flyer"}).when("/home",{templateUrl:"views/home.html",controller:"HomeCtrl",controllerAs:"home"}).when("/flyer-list",{templateUrl:"views/flyer-list.html",controller:"FlyerListCtrl",controllerAs:"flyerList"}).when("/schedule/:id",{templateUrl:"views/schedule.html",controller:"ScheduleCtrl",controllerAs:"schedule"}).when("/lint",{templateUrl:"views/lint.html",controller:"LintCtrl",controllerAs:"lint"}).otherwise({redirectTo:"/home"})}]).run(["$rootScope","$http",function(a,b){a.coworkingNights=[],a.coworkingVenues=[],b.get("events.json").success(function(b){for(var c=0;c<b.events.length;c++)b.events[c].date=new Date(b.events[c].date);a.coworkingNights=b.events,a.coworkingVenues=b.venues})}]),angular.module("flyerApp").controller("FlyerCtrl",["$scope","$routeParams","$filter","services.eventquery",function(a,b,c,d){d.retrieveEvents(),a.draw=!1;var e=0;e=b.color?b.color%6:b.id%6,a.bgprimary="bg-primary-"+e,a.bgsecondary="bg-secondary-"+e,a.fillprimary="fill-primary-"+e,a.fillsecondary="fill-secondary-"+e,a.textprimary="text-primary-"+e,a.textsecondary="text-secondary-"+e,d.dataReadyCb=function(){a.events=d.events,a.night_id=parseInt(b.id),a.date=d.getCoworkingDate(a.night_id),a.draw_events(),a.draw=!0},a.draw_events=function(){var b=new Date(a.date);b.setDate(b.getDate()-1);var d=new Date(a.date);d.setDate(d.getDate()+1);for(var e=[],f=0;f<a.events.length;f++){var g=a.events[f].start_time;console.log(a.events[f]);new Date(g.slice(0,22)+":"+g.slice(22));a.events[f].cwn==a.night_id&&(a.events[f].short_desc="",a.events[f].description&&(a.events[f].short_desc=a.events[f].description.split("\n")[0]),a.events[f].venue=a.events[f].room_req,e.push(a.events[f]))}a.events=c("orderBy")(e,"start_time");var h=a.events.length,i=Math.ceil(h/2);a.left=a.events.slice(0,i),a.right=a.events.slice(i,h)},a.events=d.events,a.night_id=parseInt(b.id),a.date=d.getCoworkingDate(a.night_id),a.draw_events(),a.draw=!0}]),angular.module("flyerApp").controller("FlyerListCtrl",["$scope","$rootScope",function(a,b){a.events=[],a.upcoming=[],a.past=[],a.nextEvent={};var c=function(){var c=new Date;c.setHours(0),c.setMinutes(0),c.setSeconds(0),c.setMilliseconds(0);for(var d=0;d<b.coworkingNights.length;d++){var e=b.coworkingNights[d].date;e>=c?a.upcoming.push(b.coworkingNights[d]):a.past.push(b.coworkingNights[d])}a.nextEvent=a.upcoming[0],a.upcoming.shift()};a.$watch(function(){return b.coworkingNights.length>0},function(a){c(a)})}]),angular.module("flyerApp").controller("ScheduleCtrl",["$scope","$routeParams","$rootScope","services.eventquery",function(a,b,c,d){a.draw=!1,a.night_id=parseInt(b.id),a.date=d.getCoworkingDate(a.night_id),d.retrieveEvents(),a.draw=!0,d.dataReadyCb=function(){for(a.night_id=parseInt(b.id),a.events=d.events,console.log(a.events),a.base_date=d.getCoworkingDate(a.night_id);0===c.coworkingVenues.length;);a.rooms=c.coworkingVenues;for(var e=[],f=1;f<a.rooms.length;f++)e.push({id:a.rooms[f].map_id,title:a.rooms[f].full});a.to_be_posted=[];var g=[];for(f=0;f<a.events.length;f++)if(a.events[f].cwn==a.night_id){var h={};h.title=a.events[f].title,h.start=a.events[f].start_time,h.end=a.events[f].end_time,h.start=new Date(new Date(h.start)+216e6),h.end=new Date(new Date(h.end)+216e6),h.resourceId=d.getCoworkingVenue(a.events[f]).map_id,h.host=a.events[f].group,parseInt(h.resourceId)===a.rooms[0].map_id&&a.to_be_posted.push(h),g.push(h)}$("#fullcalendar").fullCalendar({height:600,schedulerLicenseKey:"GPL-My-Project-Is-Open-Source",resources:e,events:g,defaultView:"agendaDay",header:!1,defaultDate:a.base_date,allDaySlot:!1,minTime:"18:00:00",maxTime:"23:00:00",slotDuration:"00:15:00",slotEventOverlap:!1,editable:!1,eventLimit:!0})}}]),angular.module("flyerApp").controller("LintCtrl",["$scope","$routeParams","$filter","services.eventquery",function(a,b,c,d){a.draw=!1,d.dataReadyCb=function(){a.events=d.events,a.check_events(),a.draw=!0},a.$watch(function(){d.isSdkReady()},function(a){d.init_user(a)}),a.IntentLogin=function(){d.isUserConnected()||d.login()};var e=function(a){return a.length>44?"Title > 44 chars":"Pass"},f=function(a){if("undefined"==typeof a)return"Description Undefined";var b=a.split("\n")[0];return b.length>150?"Description > 150 chars":"Pass"},g=function(a,b){return"undefined"==typeof b?a+" Time Undefined":"Pass"};a.check_events=function(){a.results=[];for(var b=0;b<a.events.length;b++){var h=a.events[b];h.check={},h.place=d.getCoworkingVenue(h),h.check.size="Pass";var i=h.attending_count+.5*h.interested_count;"To Be Posted"!==h.place.full&&(i>=2*h.place.capacity?h.check.size="Over Capacity":i>=h.place.capacity&&(h.check.size="Full")),h.check.title=e(h.name),h.check.description=f(h.description),h.check.start=g("Start",h.start_time),h.check.end=g("Stop",h.end_time),h.night_id=d.getCoworkingId(h),a.results.push(h)}a.results=c("orderBy")(a.results,"start_time"),a.upcoming=[],a.past=[];var j=new Date;for(b=0;b<a.results.length;b++){var k=new Date(a.results[b].start_time);k>=j?a.upcoming.push(a.results[b]):a.past.push(a.results[b])}}}]),angular.module("flyerApp").factory("services.eventquery",["$rootScope","$http",function(a,b){var c={};return c.events=[],c._userIsConnected=!1,c.dataReadyCb=null,c.getCurrent=function(){return new Date},c.isSdkReady=function(){return!0},c.retrieveEvents=function(){b({method:"GET",url:"https://script.google.com/macros/s/AKfycbxDCvI79Q_lV8EHvirA-t44q6pbDkPi1hdMWE3jH73wVaDxH1A/exec"}).then(function(a){c.events=a.data,c.dataReadyCb&&c.dataReadyCb()})},c.getEvents=function(a){for(var b=[],d=0;d<c.events.length;d++)console.log(events[d].cwn,a),events[d].cwn==a&&b.push(c.events[d]);return b},c.getCoworkingDate=function(b){for(var c=0;c<a.coworkingNights.length;c++)if(b===a.coworkingNights[c].id)return new Date(a.coworkingNights[c].date)},c.getCoworkingId=function(b){for(var c=0;c<a.coworkingNights.length;c++){var d=new Date(b.start_time),e=new Date(a.coworkingNights[c].date);if(d.getDate()===e.getDate()&&d.getMonth()===e.getMonth()&&d.getYear()===e.getYear())return a.coworkingNights[c].id}return-1},c.getCoworkingVenue=function(b){for(var c=0;c<a.coworkingVenues.length;c++){if("undefined"==typeof b.room_req)return a.coworkingVenues[0];if(-1!==b.room_req.indexOf(a.coworkingVenues[c].match))return a.coworkingVenues[c]}return a.coworkingVenues[0]},c}]),angular.module("flyerApp").directive("eventDetail",function(){return{templateUrl:"views/event-detail.html"}}),angular.module("flyerApp").controller("HomeCtrl",["$scope","$rootScope","$routeParams","$filter","services.eventquery",function(a,b,c,d,e){function f(a){var b=[];$(a+" .carousel-item").each(function(){b.push($(this).height())});var c=Math.max.apply(null,b);$(a+" .carousel-content").each(function(){$(this).css("height",c+"px")})}a.draw=!1,f("#testimonial-carousel"),a.events=[],a.upcoming=[],a.past=[],a.nextEvent={};var g=function(){var c=new Date;c.setHours(0),c.setMinutes(0),c.setSeconds(0),c.setMilliseconds(0);for(var d=0;d<b.coworkingNights.length;d++){var e=b.coworkingNights[d].date;e>=c?a.upcoming.push(b.coworkingNights[d]):a.past.push(b.coworkingNights[d])}a.nextEvent=a.upcoming[0],a.upcoming.shift()};a.$watch(function(){return b.coworkingNights.length>0},function(a){g(a)})}]),angular.module("flyerApp").run(["$templateCache",function(a){a.put("views/event-detail.html",'<h4 class="event-title">\n  {{event.group}} - {{ event.title }}\n</h4>\n\n<h5 class="event-subtitle">\n    <strong>{{event.start_time | date : \'h:mm a\'}}-{{ event.end_time | date: \'h:mm a\'}}</strong>\n    <span class="divider">//</span> {{event.venue}}\n</h5>\n<p class="event-description">{{event.short_desc | limitTo: 300}}</p>\n'),a.put("views/flyer-list.html",'<div class="container-fluid">\n<h2>Next Event</h2>\n<ul>\n    <li>\n        Coworking Night #{{nextEvent.id}} - {{ nextEvent.date | date: \'MMM d, yyyy\' }}\n        <ul>\n            <li><a href="#/flyer/{{ nextEvent.id }}">Flyer</a></li>\n            <li><a href="#/schedule/{{ nextEvent.id }}">Schedule</a></li>\n        </ul>\n    </li>\n</ul>\n\n<h2>Future Events</h2>\n<ul>\n    <li ng-repeat="event in upcoming">\n        Coworking Night #{{event.id}} - {{ event.date | date: \'MMM d, yyyy\' }}\n        <ul>\n            <li><a href="#/flyer/{{ event.id }}">Flyer</a></li>\n            <li><a href="#/schedule/{{ event.id }}">Schedule</a></li>\n        </ul>\n    </li>\n</ul>\n\n<h2>Past Events</h2>\n<ul>\n    <li ng-repeat="event in past">\n        Coworking Night #{{event.id}} - {{ event.date | date: \'MMM d, yyyy\' }}\n        <ul>\n            <li><a href="#/flyer/{{ event.id }}">Flyer</a></li>\n            <li><a href="#/schedule/{{ event.id }}">Schedule</a></li>\n        </ul>\n    </li>\n</ul>\n\n</div>'),a.put("views/flyer.html",'<div class="flyer">\n  <div class="intro">\n    <div class="header bg-primary" ng-class="bgprimary">\n      <div class="container-fluid">\n        <h1 class="flyer-title pull-xs-left">Coworking Night #{{ night_id }}</h1>\n        <h2 class="flyer-subtitle pull-xs-left pull-sm-right">{{ date | date: \'MMM d, yyyy\' }} •  AL.com  •  6‑11pm </h2>\n        <div class="clearfix"></div>\n        <span>If you’ve come to GSD (Get Sh*t Done), then you’ve come to the right place! Attend our events, or invite your team and collaborate, or grab a booth and work solo. Coworking Night is a FREE resource in Huntsville designed to get the minds and talent of our city into motion: learning, creating, and executing ideas into reality.</span>\n      </div>\n    </div>\n\n    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 134.423" class="header-flourish">\n      <path class="fill-primary" ng-class="fillprimary" fill="#555" d="M800 0H0v46.674l449.008 87.75"/>\n      <path opacity=".3" d="M449.008 134.423V0H0v46.674"/>\n    </svg>\n    <div class="cover-image"></div>\n\n  	<div class="container-fluid">\n      <div class="row organizer-row">\n        <a class="organizer-credit-link col-xs-12 col-sm-6 col-md-5" href="http://openhsv.com" target="_blank">\n          <svg class="organizer-graphic" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 799.674 219.628">\n            <path class="fill-secondary" ng-class="fillsecondary" fill="#555" d="M0 181.655l210.173 37.973 589.5-37.973V0H95.137L0 45.69"/>\n            <path opacity=".3" d="M95.136 181.655V0L0 45.69V173.53"/>\n            <path opacity=".5" d="M0 181.655v-8.123l95.136 8.123h704.538l-589.5 37.973"/>\n            <text transform="translate(222.675 42.35)" fill="#FFF" font-family="Montserrat" font-size="26">\n              Organized by:\n            </text>\n            <text transform="translate(222.675 108.14)" fill="#FFF" font-family="Montserrat" font-size="72">\n              OpenHuntsville\n            </text>\n            <text transform="translate(118.05 160.014)" fill="#FFF" font-family="Montserrat" font-size="30">\n              Create your FREE profile at openhsv.com\n            </text>\n            <g fill="#FFF">\n              <path d="M151.13 52.678h22.023V74.7H151.13zM186.276 18.884h19.88V39.56h-19.88zM116.9 18.884h21.11V39.56H116.9zM116.9 87.824h21.11v20.317H116.9zM186.276 87.824h19.88v20.317h-19.88zM116.9 52.678h21.11V74.7H116.9zM151.132 87.824h22.02v20.317h-22.02zM151.13 18.884h22.023V39.56H151.13zM186.276 52.678h19.88V74.7h-19.88z"/>\n            </g>\n          </svg>\n        </a>\n        <p class="col-xs-12 col-sm-6 col-sm-offset-6 organizer-memo"><img style="width:1.6em; height:1.6em; margin-right:.5em;" src="data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTguMS4xLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4PSIwcHgiIHk9IjBweCIgdmlld0JveD0iMCAwIDE1LjY5MiAxNS42OTIiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDE1LjY5MiAxNS42OTI7IiB4bWw6c3BhY2U9InByZXNlcnZlIiB3aWR0aD0iNTEycHgiIGhlaWdodD0iNTEycHgiPgo8Zz4KCTxnPgoJCTxwYXRoIGQ9Ik0yLjk5Niw1LjExYzAuMDM3LDAuMjIzLDAuMTIzLDAuMzY0LDAuMjA4LDAuNDUzQzMuNDA2LDYuOTA5LDQuNTMxLDguMTU4LDUuNTYsOC4xNTggICAgYzEuMTk5LDAsMi4yOTEtMS4zNTIsMi41MDEtMi41OTJjMC4wODctMC4wODgsMC4xNzQtMC4yMywwLjIxMi0wLjQ1NmMwLjA2OC0wLjI1MiwwLjE1Ni0wLjY5LDAuMDAyLTAuODk2ICAgIEM4LjI2Nyw0LjIwNCw4LjI1OCw0LjE5Myw4LjI1LDQuMTg1YzAuMTQ1LTAuNTI5LDAuMzI4LTEuNjIzLTAuMzI3LTIuMzY4QzcuODY1LDEuNzQzLDcuNDk3LDEuMzA0LDYuNzEyLDEuMDcyTDYuMzM3LDAuOTQzICAgIEM1LjcxOSwwLjc1Miw1LjMzMSwwLjcwOSw1LjMxNCwwLjcwN2MtMC4wMjgtMC4wMDItMC4wNTcsMC0wLjA4NCwwLjAwN0M1LjIwOSwwLjcyLDUuMTM1LDAuNzQsNS4wNzgsMC43MzIgICAgYy0wLjE0OC0wLjAyMS0wLjM3LDAuMDU1LTAuNDA5LDAuMDdjLTAuMDUxLDAuMDIxLTEuMjQ4LDAuNS0xLjYxMSwxLjYxNWMtMC4wMzQsMC4wOS0wLjE3OSwwLjU2NCwwLjAxNCwxLjcyNiAgICBjLTAuMDI5LDAuMDItMC4wNTUsMC4wNDQtMC4wNzcsMC4wNzNDMi44MzksNC40MiwyLjkyNyw0Ljg1OCwyLjk5Niw1LjExeiIgZmlsbD0iIzAwMDAwMCIvPgoJCTxwYXRoIGQ9Ik03Ljc4NCwxMy41OTRjLTAuMjIxLTAuMTI0LTAuNDYxLTAuMjQzLTAuNzE3LTAuMzU2Yy0wLjEyNC0wLjA1NS0wLjI1LTAuMTA3LTAuMzc1LTAuMTU2ICAgIGMtMC4wOTgtMC4wMzctMC4yMTQtMC4wODUtMC4yOTUtMC4xMDZsLTEuMTg2LTAuMzJMNy40Myw4LjEzOGwwLjk1MSwwLjZDOC41ODIsOC44NjQsOC43Myw4Ljk3MSw4Ljg5Miw5LjA5bDAuMDM0LDAuMDI1ICAgIEM5LjA4Nyw5LjIzNCw5LjI0NSw5LjM1Niw5LjQsOS40ODJjMC4zMzcsMC4yNzIsMC42MzUsMC41MzgsMC45MTIsMC44MTNjMC4wMjEsMC4wMjEsMC4wNDEsMC4wNCwwLjA2MiwwLjA2MSAgICBjMC4wOTMtMC4xMDMsMC4xODQtMC4xOTUsMC4yNzUtMC4yOTRjLTAuMTE2LTAuMzQ1LTAuMjU3LTAuNjY0LTAuNDI5LTAuOTJjMCwwLTAuMjQ0LTAuMzMzLTAuODIzLTAuNTU1ICAgIGMwLDAtMC4wNDktMC4wMTUtMC4xMjQtMC4wNEM4Ljc1OCw4LjMwNiw4LjI2OSw4LjE1MSw4LjI2OSw4LjE1MUM4LjE2NCw4LjExMyw4LjA3Miw4LjA3Niw3Ljk4OSw4LjA0ICAgIGMtMC4zNS0wLjE3My0wLjY0MS0wLjM2OC0wLjcwMS0wLjU1MmMwLDAsMC4yMDIsMS45NTUtMS41MDcsMi4wMDFMNS41NDMsOS40NzhDMy45OTQsOS4zNCwzLjg5MSw3LjQ4NCwzLjg5MSw3LjQ4NCAgICBjLTAuMTYyLDAuNTA5LTIuMTEsMS4xMDEtMi4xMSwxLjEwMUMxLjIwMiw4LjgwNywwLjk1Nyw5LjE0MSwwLjk1Nyw5LjE0MUMwLjEwMSwxMC40MTEsMCwxMy4yMzcsMCwxMy4yMzcgICAgYzAuMDExLDAuNjQ2LDAuMjksMC43MTMsMC4yOSwwLjcxM2MxLjk2OSwwLjg3OSw1LjA1OCwxLjAzNCw1LjA1OCwxLjAzNGMwLjE2NywwLjAwNCwwLjMyMi0wLjAwNSwwLjQ3Ny0wLjAxNGwwLjAwNCwwLjAxNiAgICBjMCwwLDEuNTA4LTAuMDc3LDMuMDg5LTAuNDIzTDguNzI1LDE0LjMxQzguNTY4LDE0LjEwMyw4LjIxNywxMy44MzYsNy43ODQsMTMuNTk0eiIgZmlsbD0iIzAwMDAwMCIvPgoJCTxwYXRoIGQ9Ik03LjIyMiw3LjU3MWMwLjAyMS0wLjAyNywwLjA0NC0wLjA1NCwwLjA2Ni0wLjA4NEM3LjI4Myw3LjQ2OSw3LjI4Miw3LjQ2LDcuMjgyLDcuNDYgICAgQzcuMjYzLDcuNDk5LDcuMjQxLDcuNTMyLDcuMjIyLDcuNTcxeiIgZmlsbD0iIzAwMDAwMCIvPgoJCTxwYXRoIGQ9Ik0zLjksNy40ODFMMy44OTUsNy40NkwzLjg5MSw3LjQ4MkMzLjg5Miw3LjQ3OCwzLjg5Niw3LjQ3NCwzLjg5Nyw3LjQ3ICAgIEMzLjg5OCw3LjQ3MSwzLjg5OSw3LjQ3NSwzLjksNy40ODF6IiBmaWxsPSIjMDAwMDAwIi8+CgkJPHBhdGggZD0iTTEzLjg4Miw4LjM4OGMtMC41NjEsMC4zOTYtMS4wODQsMC44NDQtMS41ODIsMS4zMTVjLTAuNDk5LDAuNDc0LTAuOTcyLDAuOTczLTEuNDI3LDEuNDg4ICAgIGMtMC4xNjksMC4xOTItMC4zMzMsMC4zODYtMC40OTYsMC41ODFjLTAuMDAyLTAuMDAzLTAuMDA0LTAuMDA2LTAuMDA1LTAuMDA5Yy0wLjI0LTAuMzItMC41LTAuNjA1LTAuNzctMC44NzIgICAgYy0wLjI3LTAuMjY2LTAuNTUtMC41MTItMC44MzgtMC43NDZjLTAuMTQ1LTAuMTE2LTAuMjkxLTAuMjMtMC40NC0wLjM0MkM4LjE2OSw5LjY5MSw4LjAzMyw5LjU5LDcuODQzLDkuNDdsLTEuMTgyLDIuNDA1ICAgIGMwLjEwOCwwLjAyOSwwLjI2NSwwLjA5LDAuMzk4LDAuMTQyYzAuMTQxLDAuMDU0LDAuMjc5LDAuMTEyLDAuNDE3LDAuMTczYzAuMjc2LDAuMTIyLDAuNTQ1LDAuMjU1LDAuODAyLDAuMzk4ICAgIGMwLjUwOCwwLjI4NCwwLjk4MSwwLjYzLDEuMjUxLDAuOTgzbDAuOTA5LDEuMTkybDAuNTIzLTEuMTM0YzAuMjYzLTAuNTY4LDAuNTc4LTEuMTYyLDAuOTAxLTEuNzI4ICAgIGMwLjMyNi0wLjU3LDAuNjc0LTEuMTI5LDEuMDUxLTEuNjY4czAuNzgxLTEuMDYsMS4yMzMtMS41NGMwLjQ1Mi0wLjQ3NywwLjk1MS0wLjkyMSwxLjU0Ni0xLjIzNiAgICBDMTUuMDQ2LDcuNjQ5LDE0LjQ0Miw3Ljk5NiwxMy44ODIsOC4zODh6IiBmaWxsPSIjMDAwMDAwIi8+Cgk8L2c+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPC9zdmc+Cg==">\n          <strong>RSVP:</strong> <a href="http://www.coworkingnight.org">coworkingnight.org</a>\n        </p>\n      </div>\n    </div>\n  </div>\n\n  <div ng-if="draw">\n    <div class="container-fluid">\n      <div class="row list-events">\n        <div class="col-sm-6">\n          <div ng-repeat="event in left" class="event">\n            <div class="eventDetail" event-detail></div>\n          </div>\n        </div>\n\n        <div class="col-sm-6">\n          <div ng-repeat="event in right" class="event">\n            <div class="eventDetail" event-detail></div>\n          </div>\n        </div>\n      </div>\n    </div>\n  </div>\n\n  <footer class="footer">\n    <div class="row row-margin-xs hidden-xs-down row-photofooter">\n      <div class="col-sm-1-5">\n        <img src="images/footer-photo-1.8366b6b6.jpg" alt="coworking night candid"/>\n      </div>\n        <div class="col-sm-1-5">\n        <img src="images/footer-photo-2.0532289c.jpg" alt="coworking night candid"/>\n      </div>\n      <div class="col-sm-1-5">\n        <img src="images/footer-photo-3.45df63e7.jpg" alt="coworking night candid"/>\n      </div>\n      <div class="col-sm-1-5">\n        <img src="images/footer-photo-4.b6aa5435.jpg" alt="coworking night candid"/>\n      </div>\n      <div class="col-sm-1-5">\n        <img src="images/footer-photo-5.f749f304.jpg" alt="coworking night candid"/>\n      </div>\n      <div class="col-sm-1-5">\n        <img src="images/footer-photo-6.718d435d.jpg" alt="coworking night candid"/>\n      </div>\n        <div class="col-sm-1-5">\n        <img src="images/footer-photo-17.b11e3c44.jpg" alt="coworking night candid"/>\n      </div>\n      <div class="col-sm-1-5">\n        <img src="images/footer-photo-8.8faca2a3.jpg" alt="coworking night candid"/>\n      </div>\n      <div class="col-sm-1-5">\n        <img src="images/footer-photo-9.9b460809.jpg" alt="coworking night candid"/>\n      </div>\n      <div class="col-sm-1-5">\n        <img src="images/footer-photo-10.581fcdd0.jpg" alt="coworking night candid"/>\n      </div>\n      <div class="col-sm-1-5">\n        <img src="images/footer-photo-11.7e0bc863.jpg" alt="coworking night candid"/>\n      </div>\n        <div class="col-sm-1-5">\n        <img src="images/footer-photo-12.daa9fb0b.jpg" alt="coworking night candid"/>\n      </div>\n      <div class="col-sm-1-5">\n        <img src="images/footer-photo-13.00df5987.jpg" alt="coworking night candid"/>\n      </div>\n      <div class="col-sm-1-5">\n        <img src="images/footer-photo-14.505ec631.jpg" alt="coworking night candid"/>\n      </div>\n      <div class="col-sm-1-5">\n        <img src="images/footer-photo-15.37153e1a.jpg" alt="coworking night candid"/>\n      </div>\n    </div>\n\n\n    <div class="footnote text-center bg-primary" ng-class="bgprimary">\n      <div class="container-fluid">\n        <span>A big thanks to <a href="http://al.com" target="_blank">AL.com</a> and <a href="https://www.hackster.io/" target="_blank">Hackster.io</a> for supporting Coworking Night!</span>\n      </div>\n    </div>\n  </footer>\n\n  <!--<div>Icons made by <a href="http://www.freepik.com" title="Freepik">Freepik</a> from <a href="http://www.flaticon.com" title="Flaticon">www.flaticon.com</a> is licensed by <a href="http://creativecommons.org/licenses/by/3.0/" title="Creative Commons BY 3.0" target="_blank">CC 3.0 BY</a></div>-->\n</div>\n'),a.put("views/home.html",'<div class="home">\n    <nav class="navbar navbar-static-top navbar-dark bg-inverse">\n      <a class="navbar-brand" href="#">Coworking Night</a>\n      <ul class="nav navbar-nav pull-xs-right">\n        <li class="nav-item active">\n          <a class="nav-link" href="#">Home <span class="sr-only">(current)</span></a>\n        </li>\n        <li class="nav-item">\n          <a class="nav-link" href="#/flyer-list">Schedule</a>\n        </li>\n      </ul>\n    </nav>\n\n    <!-- Main jumbotron for a primary marketing message or call to action -->\n    <div class="jumbotron section-header text-white">\n      <div class="container text-center">\n        <h1>Coworking Night<br>\n          <small><span>Learn. </span><span>Collaborate. </span><span>Get Sh*t Done.</span></small></h1>\n        <p class="lead">Every Wednesday - 6&#8209;11pm - AL.com office - 200 Westside Sq, Huntsville</p>\n      </div>\n    </div>\n\n    <div class="container">\n      <div class="text-center t-lg b-lg">\n        <p class="lead">Coworking Night is a free community events platform for creative professionals.</p>\n\n        <p><a style="margin-bottom:10px;" href="#/flyer/{{ nextEvent.id }}" class="btn btn-primary btn-lg">This week @ Coworking Night</a><br>\n        Find out what\'s happening this week</p>\n      </div>\n\n      <div class="twoblocks">\n        <div class="blocks-holder">\n          <div class="block-left bkgimage" style="background-image: url(\'https://s3-us-west-2.amazonaws.com/s.cdpn.io/69546/learn.jpg\');">\n            <div class="force-16x9">&nbsp;</div>\n          </div>\n          <div class="block-right content">\n              <h2>Learn.</h2>\n              <p>Each week begins with a headliner presentation from Huntsville\'s brightest technology leaders and entrepreneurs.</p>\n          </div>\n        </div>\n      </div>\n\n\n        <div class="twoblocks hidden-xs-down">\n        <div class="blocks-holder">\n          <div class="block-left content">\n              <h2>Collaborate.</h2>\n              <p>Recurring workshops and classes are held each week. Groups of different focus areas meet to collaborate on projects and ideas. </p>\n          </div>\n          <div class="block-right bkgimage" style="background-image: url(\'https://s3-us-west-2.amazonaws.com/s.cdpn.io/69546/collaborate.jpg\');">\n            <div class="force-16x9">&nbsp;</div>\n          </div>\n        </div>\n      </div>\n\n        <div class="twoblocks hidden-sm-up">\n        <div class="blocks-holder">\n          <div class="block-left bkgimage" style="background-image: url(\'https://s3-us-west-2.amazonaws.com/s.cdpn.io/69546/collaborate.jpg\');">\n            <div class="force-16x9">&nbsp;</div>\n          </div>\n          <div class="block-right content">\n            <h2>Collaborate.</h2>\n              <p>Recurring workshops and classes are held each week. Groups of different focus areas meet to collaborate on projects and ideas. </p>\n          </div>\n        </div>\n      </div>\n\n      <div class="twoblocks b-30">\n        <div class="blocks-holder">\n          <div class="block-left bkgimage" style="background-image: url(\'https://s3-us-west-2.amazonaws.com/s.cdpn.io/69546/gsd.jpg\');">\n            <div class="force-16x9">&nbsp;</div>\n          </div>\n          <div class="block-right content">\n              <h2>Get Sh*t Done.</h2>\n              <p>Working on a personal project?  It can be hard to find time (or peace and quiet) to make any progress.  GSD time is the perfect opportunity to do just that. Collaboration is welcome, but distractions are minimal.</p>\n          </div>\n        </div>\n      </div>\n    </div>\n\n      <br>\n      <div class="jumbotron section-testimonial">\n        <div class="container">\n        <h2 class="text-center text-white">Testimonials</h2>\n        <div id="testimonial-carousel" class="carousel slide" data-ride="carousel" data-pause="hover">\n          <ol class="carousel-indicators">\n            <li data-target="#testimonial-carousel" data-slide-to="0" class="active"></li>\n            <li data-target="#testimonial-carousel" data-slide-to="1"></li>\n            <li data-target="#testimonial-carousel" data-slide-to="2"></li>\n            <li data-target="#testimonial-carousel" data-slide-to="3"></li>\n            <li data-target="#testimonial-carousel" data-slide-to="4"></li>\n          </ol>\n          <div class="carousel-inner" role="listbox">\n            <div class="carousel-item active">\n              <div class="carousel-content text-white">\n                <blockquote class="blockquote blockquote-reverse">\n                  <p class="m-b-0">It is quite an honor be in a group full of the Rocket City\'s brilliant minds. In bringing my own vision to reality, there were many times I realized how difficult the road is.  It is support from groups like Coworking Night that reinvigorate and compel me to continue building on my dreams.</p>\n                  <footer class="text-white blockquote-footer">Nemil Shah, MD and ApproXie CEO</footer>\n                </blockquote>\n              </div>\n            </div>\n            <div class="carousel-item">\n              <div class="carousel-content text-white">\n                <blockquote class="blockquote blockquote-reverse">\n                  <p class="m-b-0">Coworking Night has provided our writers with a critical resource: a beautiful space to get stuff done in authorial fellowship.</p>\n                  <footer class="text-white blockquote-footer">Alex White, organizer of Write Your Masterpiece group</footer>\n                </blockquote>\n              </div>\n            </div>\n            <div class="carousel-item">\n              <div class="carousel-content text-white">\n                <blockquote class="blockquote blockquote-reverse">\n                  <p class="m-b-0">Coworking Night is a movement, every bit as much as an event.  It provides a sense of community that I personally was in desperate need of.</p>\n                  <footer class="text-white blockquote-footer">Matt Bynum, software developer</footer>\n                </blockquote>\n              </div>\n            </div>\n            <div class="carousel-item">\n              <div class="carousel-content text-white">\n                <blockquote class="blockquote blockquote-reverse">\n                  <p class="m-b-0">I always look forward to co-working night. There is always someone there who seems genuinely happy to see you.</p>\n                  <footer class="text-white blockquote-footer">Crisy Meschieri, organizer of Designers’ Corner</footer>\n                </blockquote>\n              </div>\n            </div>\n            <div class="carousel-item">\n              <div class="carousel-content text-white">\n                <blockquote class="blockquote blockquote-reverse">\n                  <p class="m-b-0">Coworking Night has been an excellent opportunity for me to collaborate with other local developers on a variety of projects. It has also been a place to share big ideas and challenges through stimulating conversation during meetings like the book club.</p>\n                  <footer class="text-white blockquote-footer">Michael Carroll, organizer of Share Your Stack</footer>\n                </blockquote>\n              </div>\n            </div>\n          </div>\n          <!--\n          <a class="left carousel-control" data-target="#testimonial-carousel" role="button" data-slide="prev">\n            <span class="icon-prev" aria-hidden="true"></span>\n            <span class="sr-only">Previous</span>\n          </a>\n          <a class="right carousel-control" data-target="#testimonial-carousel" role="button" data-slide="next">\n            <span class="icon-next" aria-hidden="true"></span>\n            <span class="sr-only">Next</span>\n          </a>\n          -->\n        </div>\n      </div>\n  </div>\n\n\n    <div class="container">\n      <!-- Example row of columns -->\n      <h2 class="text-center">Stay updated</h2>\n      <div class="row">\n        <div class="col-xs-12 col-sm-6">\n\n            <!-- Begin MailChimp Signup Form\n            <link href="//cdn-images.mailchimp.com/embedcode/horizontal-slim-10_7.css" rel="stylesheet" type="text/css">\n            <style type="text/css">\n            	#mc_embed_signup{background:#fff; clear:left; font:14px Helvetica,Arial,sans-serif; width:100%;}\n            	/* Add your own MailChimp form style overrides in your site stylesheet or in this style block.\n            	   We recommend moving this block and the preceding CSS link to the HEAD of your HTML file. */\n            </style>\n            -->\n            <h3 class="text-center">Email</h3>\n\n            <div id="mc_embed_signup">\n            <form action="//drewmcdowell.us7.list-manage.com/subscribe/post?u=bfb1d58887bec00c00465185f&amp;id=b674489202" method="post" id="mc-embedded-subscribe-form" name="mc-embedded-subscribe-form" class="validate" target="_blank" novalidate>\n                <div id="mc_embed_signup_scroll" class="input-group">\n\n              	  <input type="email" value="" name="EMAIL" class="form-control" id="mce-EMAIL" placeholder="email address" required>\n                  <!-- real people should not fill this in and expect good things - do not remove this or risk form bot signups-->\n                  <div style="position: absolute; left: -5000px;" aria-hidden="true"><input type="text" name="b_bfb1d58887bec00c00465185f_b674489202" tabindex="-1" value=""></div>\n                  <span class="input-group-btn">\n                  <input type="submit" value="Subscribe" name="subscribe" id="mc-embedded-subscribe" class="btn btn-secondary"></span>\n                  </span>\n                </div>\n            </form>\n          </div>\n          ​\n          <!--End mc_embed_signup-->\n\n            <!--\n          <h3 class="text-center">Email</h3>\n          <div class="input-group">\n            <input type="text" class="form-control" placeholder="your@email.com">\n            <span class="input-group-btn">\n              <button class="btn btn-secondary" type="button">Sign up</button>\n            </span>\n          </div>\n          -->\n\n        </div>\n        <div class="col-xs-12 col-sm-6">\n          <h3 class="text-center">Facebook</h3>\n          <p class="text-center">\n            <a class="btn btn-primary" href="https://www.facebook.com/groups/openhuntsville/" target="_blank"><img src="data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTYuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4PSIwcHgiIHk9IjBweCIgd2lkdGg9IjI0cHgiIGhlaWdodD0iMjRweCIgdmlld0JveD0iMCAwIDYwLjczNCA2MC43MzMiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDYwLjczNCA2MC43MzM7IiB4bWw6c3BhY2U9InByZXNlcnZlIj4KPGc+Cgk8cGF0aCBkPSJNNTcuMzc4LDAuMDAxSDMuMzUyQzEuNTAyLDAuMDAxLDAsMS41LDAsMy4zNTN2NTQuMDI2YzAsMS44NTMsMS41MDIsMy4zNTQsMy4zNTIsMy4zNTRoMjkuMDg2VjM3LjIxNGgtNy45MTR2LTkuMTY3aDcuOTE0ICAgdi02Ljc2YzAtNy44NDMsNC43ODktMTIuMTE2LDExLjc4Ny0xMi4xMTZjMy4zNTUsMCw2LjIzMiwwLjI1MSw3LjA3MSwwLjM2djguMTk4bC00Ljg1NCwwLjAwMmMtMy44MDUsMC00LjUzOSwxLjgwOS00LjUzOSw0LjQ2MiAgIHY1Ljg1MWg5LjA3OGwtMS4xODcsOS4xNjZoLTcuODkydjIzLjUyaDE1LjQ3NWMxLjg1MiwwLDMuMzU1LTEuNTAzLDMuMzU1LTMuMzUxVjMuMzUxQzYwLjczMSwxLjUsNTkuMjMsMC4wMDEsNTcuMzc4LDAuMDAxeiIgZmlsbD0iI0ZGRkZGRiIvPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+Cjwvc3ZnPgo="> Coworking Night Group</a>\n          </p>\n        </div>\n      </div>\n<hr>\n\n\n      <h2 class="text-center">Location</h2>\n      <div class="row">\n        <div class="col-xs-12 col-sm-6 col-md-8">\n          <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1639.5064711818347!2d-86.58689053554693!3d34.73006814776306!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x88626b5691bb8583%3A0x8a5df9aa5f8b4158!2s200+Westside+Square%2C+Huntsville%2C+AL+35801!5e0!3m2!1sen!2sus!4v1460425032317" width="100%" height="300" frameborder="0" style="border:0" allowfullscreen></iframe>\n        </div>\n\n        <div class="col-xs-12 col-sm-6 col-md-4">\n          <p>\n            <strong>AL.com Building</strong><br>\n            200 West Side Square<br>\n            Huntsville, AL 35801\n          </p>\n        </div>\n      </div>\n\n</div>\n\n      <hr>\n\n      <footer>\n        <div class="container">\n        <br>\n        <p>2016 | Organized by <a href="http://www.openhsv.com/" target="_blank">OpenHuntsville</a> | <a href="#/lint">Check Your Event</a></p>\n        <br>\n      </div> <!-- /container -->\n\n      </footer>\n      </div>\n'),
a.put("views/lint.html",'<div class="container-fluid">\n    <h1>Event Linter</h1>\n    <h2>Rules for Creating Coworking Night Facebook Events</h2>\n    <ul>\n        <li>Title: as brief as possible - flyer will be truncated after ~44 characters</li>\n        <li>Location: "AL.com building - [room]"\n            <ul>\n                <li ng-repeat="venue in venues">AL.com building - {{ venue.full }}</li>\n\n            </ul>\n        </li>\n\n        <li>Time: Include start time and end time</li>\n        <li>Description: Begin with one paragraph that is 140 characters or less.  Include remaining description in subsequent paragraphs.</li>\n    </ul>\n\n    <div ng-if="!draw">\n        <button type="button" class="btn btn-full btn-blue mb-lg" ng-click="IntentLogin()">\n            <i class="icon icon-facebook"></i>\n            <span>Login with Facebook</span>\n        </button>\n    </div>\n\n\n    <div ng-if="draw">\n    <h2>Upcoming Events</h2>\n    <table class="table table-bordered table-hover table-xs-stack">\n        <thead>\n            <tr>\n                <th>Event Name</th>\n                <th>Owner</th>\n                <th>Night</th>\n                <th>Title</th>\n                <th>Description</th>\n                <th>Start Time</th>\n                <th>End Time</th>\n                <th>Room Assignment</th>\n                <th>Event Capacity</th>\n                <th><abbr title="Attending">Att</abbr></th>\n                <th><abbr title="Interested">Int</abbr></th>\n            </tr>\n        </thead>\n        <tr ng-repeat="event in upcoming" ng-class="{true:\'highlight\', false:\'\'}[event.is_viewer_admin]">\n            <td data-th="Event"><a href="https://facebook.com/events/{{ event.id }}">{{ event.name }}</a></td>\n            <td data-th="Owner"><a href="https://facebook.com/{{event.owner.id}}">{{ event.owner.name }}</a> </td>\n            <td data-th="Night"><a href="#/flyer/{{ event.night_id }}">#{{ event.night_id }}</a></td>\n            <td data-th="Title" ng-class="{true:\'table-success\', false:\'table-danger\'}[event.check.title == \'Pass\']">{{ event.check.title }}</td>\n            <td data-th="Desc" ng-class="{true:\'table-success\', false:\'table-danger\'}[event.check.description == \'Pass\']">{{ event.check.description }}</td>\n            <td data-th="Start" ng-class="{true:\'table-success\', false:\'table-danger\'}[event.check.start == \'Pass\']">{{ event.check.start }}</td>\n            <td data-th="End" ng-class="{true:\'table-success\', false:\'table-danger\'}[event.check.end == \'Pass\']">{{ event.check.end }}</td>\n            <td data-th="Room" ng-class="{true:\'table-warning\', false:\'table-success\'}[event.place.full == \'To Be Posted\']">{{ event.place.full }}</td>\n            <td data-th="Capacity" ng-class="{\'Over Capacity\':\'table-danger\', \'Full\':\'table-warning\', \'Pass\':\'table-success\'}[event.check.size]">{{ event.check.size }}: {{ event.place.capacity }}</td>\n            <td data-th="Attending">{{ event.attending_count }}</td>\n            <td data-th="Interested">{{ event.interested_count }}</td>\n            </td>\n        </tr>\n    </table>\n\n    <h3>Past Events</h3>\n    <table class="table table-bordered table-hover table-xs-stack">\n        <thead>\n            <tr>\n                <th>Event Name</th>\n                <th>Owner</th>\n                <th>Night</th>\n                <th>Title</th>\n                <th>Description</th>\n                <th>Start Time</th>\n                <th>End Time</th>\n                <th>Room Assignment</th>\n                <th>Event Capacity</th>\n                <th>Attending</th>\n                <th>Interested</th>\n            </tr>\n        </thead>\n        <tr ng-repeat="event in past" ng-class="{true:\'highlight\', false:\'\'}[event.is_viewer_admin]">\n            <td data-th="Event"><a href="https://facebook.com/events/{{ event.id }}">{{ event.name }}</a></td>\n            <td data-th="Owner"><a href="https://facebook.com/{{event.owner.id}}">{{ event.owner.name }}</a> </td>\n            <td data-th="Night"><a href="#/flyer/{{ event.night_id }}">#{{ event.night_id }}</a></td>\n            <td data-th="Title" ng-class="{true:\'table-success\', false:\'table-danger\'}[event.check.title == \'Pass\']">{{ event.check.title }}</td>\n            <td data-th="Desc" ng-class="{true:\'table-success\', false:\'table-danger\'}[event.check.description == \'Pass\']">{{ event.check.description }}</td>\n            <td data-th="Start" ng-class="{true:\'table-success\', false:\'table-danger\'}[event.check.start == \'Pass\']">{{ event.check.start }}</td>\n            <td data-th="End" ng-class="{true:\'table-success\', false:\'table-danger\'}[event.check.end == \'Pass\']">{{ event.check.end }}</td>\n            <td data-th="Room" ng-class="{true:\'table-warning\', false:\'table-success\'}[event.place.full == \'To Be Posted\']">{{ event.place.full }}</td>\n'+"            <td data-th=\"Capacity\" ng-class=\"{'Over Capacity':'table-danger', 'Full':'table-warning', 'Pass':'table-success'}[event.check.size]\">{{ event.check.size }}: {{ event.place.capacity }}</td>\n            <td data-th=\"Attending\">{{ event.attending_count }}</td>\n            <td data-th=\"Interested\">{{ event.interested_count }}</td>\n        </tr>\n    </table>\n    </div>\n</div>"),a.put("views/schedule.html",'<div class="container-fluid">\n    <div class="intro">\n    <div class="header bg-primary" ngclass="bgprimary">\n    <div class="container-fluid t-1em">\n    <h1 class="flyer-title pull-xs-left t-0">Coworking Night #{{ night_id }}</h1>\n    <h2 class="flyer-subtitle pull-xs-left pull-sm-right t-0">{{ date | date: \'MMM d, yyyy\' }} •  Real Estate Row •  6‑11pm </h2>\n    </div>\n    </div>\n    </div>\n\n    <div id="fullcalendar"></div>\n    <div class="container-fluid">\n        <h3>Events without Room Assignment</h3>\n        <ul>\n            <li ng-repeat="event in to_be_posted">\n             {{event.title}}<br/>\n'+"             ( {{event.start | date: 'h:mm a'}} - {{event.end | date: 'h:mm a'}})<br/>\n             Hosted By: {{ event.host }}\n             </li>\n        </ul>\n    </div>\n\n</div>\n")}]);
(window.webpackJsonp=window.webpackJsonp||[]).push([[4],{309:function(e,t,r){"use strict";r.r(t);r(28);var n=r(13),o=(r(66),r(212),r(213),r(45),r(85),r(215),r(86),r(46),r(14),r(29),r(30),r(36),r(214),{data:function(){return{delay:null,isLoading:0,test:0,refreshKey:0,tokenVK:"vk1.a.Iu-BtXMlHKvmNtwrKbm6cMxzNDHuHKn8Gs_1jo1a9Ngobwc50e2iG-8IygsFbXz2MK_clnwDtao0Tuv0qCg572Fpua4k-iJfKmA4ChxGrua78DKtX6RmFHM-3jYn2yDc_HMGGGbM1AuYBVgc-GceVff0rDekFXsKY2Pamw2ciVQHxZkqeeudFuBZLA7h7X-4-FTSm4WgiLf-KN15KCLAfQ"}},computed:{friends:function(){var e=this;console.log(this.refreshKey);var t=Object.values(this.$store.getters["users/friends"]);return t?t.map((function(i){var t=0;return i.cross&&(t=e.maxCross?Math.ceil(100*(i.cross.length||0)/e.maxCross):100),{id:i.id,name:"".concat(i.first_name," ").concat(i.last_name),photo:i.photo_100,cross:{percent:t,items:i.cross||[]},sex:2===i.sex?"Мужской":"Женский",age:e.getAge(i.bdate),friendsCount:i.friendsCount}})).sort((function(a,b){return a.name>b.name?1:-1})):[]},isShowUsers:function(){return this.$store.getters["users/isShowFriends"]},maxCross:function(){return this.$store.getters["users/maxCross"]},toLoadFriendData:function(){return this.$store.getters["users/toLoadFriendData"]}},watch:{toLoadFriendData:function(){0===this.isLoading&&this.loadFriend()}},mounted:function(){this.isShowUsers&&this.loadFriend()},methods:{goToProfile:function(e){this.$router.push({path:"/vk-vue/user/".concat(e)})},getAge:function(e){if(!e)return"?";var t=new Date,r=e.split(".");if(!r[2]||!r[1]||!r[0])return"?";var n=new Date(r[2],Number(r[1])-1,r[0]),o=t.getFullYear()-n.getFullYear(),c=t.getMonth()-n.getMonth();return(c<0||0===c&&t.getDate()<n.getDate())&&(o-=1),o},loadFriend:function(){var e=this;return Object(n.a)(regeneratorRuntime.mark((function t(){var r,o,c,l;return regeneratorRuntime.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:if(!(e.toLoadFriendData.length<1)){t.next=2;break}return t.abrupt("return");case 2:if(r=e.$route.name,o=!1,e.isLoading=1,clearTimeout(e.delay),e.delay=setTimeout(Object(n.a)(regeneratorRuntime.mark((function t(){return regeneratorRuntime.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:e.isLoading=0;case 1:case"end":return t.stop()}}),t)}))),1e3),"vk-vue"!==r){t.next=23;break}return c=JSON.parse(JSON.stringify(e.toLoadFriendData)),l=c.slice(0,3),t.next=12,Promise.all(l.map((function(i){return e.resFriend(i.id)})));case 12:if(t.sent.forEach((function(i){i?e.$store.commit("users/setFriendInfo",{id:i.id,value:i.count}):o=!0})),o||(c.splice(0,3),e.refreshKey+=1,e.$store.commit("users/setToLoadFriendData",c),localStorage.setItem("toLoadFriendData",JSON.stringify(c))),1!==e.isLoading){t.next=22;break}return t.next=18,new Promise((function(e){return setTimeout(e,1200)}));case 18:t.sent,e.loadFriend(),t.next=23;break;case 22:0===e.isLoading&&e.loadFriend();case 23:case"end":return t.stop()}}),t)})))()},resFriend:function(e){var t=this;return Object(n.a)(regeneratorRuntime.mark((function r(){var n;return regeneratorRuntime.wrap((function(r){for(;;)switch(r.prev=r.next){case 0:return r.prev=0,r.next=3,t.$jsonp("https://api.vk.com/method/users.get",{user_id:e,access_token:t.tokenVK,fields:"counters",v:"5.131"});case 3:if(!(n=r.sent).error){r.next=7;break}throw console.log(n.error.error_msg),n.error.error_msg;case 7:return r.abrupt("return",{id:e,count:n.response[0].counters?n.response[0].counters.friends:"?"});case 10:return r.prev=10,r.t0=r.catch(0),console.log("Ошибка при запросе resFriend",r.t0.message||r.t0),r.abrupt("return",null);case 14:case"end":return r.stop()}}),r,null,[[0,10]])})))()}}}),c=r(53),component=Object(c.a)(o,(function(){var e=this,t=e._self._c;return e.isShowUsers?t("div",{staticClass:"users"},[t("h2",{staticClass:"content__title"},[e._v("\n    Друзья пользователей:\n  ")]),e._v(" "),t("perfect-scrollbar",{staticClass:"users__wrapper"},[t("ul",{staticClass:"users__list users__list_friends"},e._l(e.friends,(function(r){return t("li",{key:"foundUser-"+r.id,staticClass:"users__item",style:{backgroundColor:"rgba(0, 119, 255, ".concat((r.cross.percent||20)/100,")")},on:{click:function(t){return t.preventDefault(),e.goToProfile(r.id)}}},[t("span",{staticClass:"users__photo"},[t("img",{staticClass:"users__img",attrs:{src:r.photo,alt:"фото"+r.name}})]),e._v(" "),t("span",{staticClass:"users__info"},[t("span",{staticClass:"users__name"},[e._v("\n            "+e._s(r.name)+"\n          ")]),e._v(" "),t("span",{staticClass:"users__sex"},[e._v("Пол: "+e._s(r.sex)+" ")]),e._v(" "),t("span",{staticClass:"users__age"},[e._v("Возвраст: "+e._s(r.age)+" ")]),e._v(" "),t("span",{staticClass:"users__friends",class:{users__friends_error:!r.access}},[e._v("Друзей: "+e._s(r.friendsCount||"Загрузка...")+"\n          ")])])])})),0)])],1):e._e()}),[],!1,null,null,null);t.default=component.exports}}]);
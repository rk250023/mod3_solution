(function () {
'use strict';
angular.module('NarrowItDownApp', [])
.controller('NarrowItDownController', NarrowItDownController)
.service('MenuSearchService', MenuSearchService)
.directive('foundItem', foundItem);

function foundItem() {
  var ddo = {
    templateUrl: 'menuList.html',
    scope: {
      menulist: '<',
       onRemove: '&'
    },
   };

  return ddo;
}




NarrowItDownController.$inject = ['MenuSearchService'];

function NarrowItDownController(MenuSearchService) {
      var list=this;
            list.choice="";
            list.error="";
         list.search = function () {
var searchItem= list.choice;
 getMatchedMenuItem(searchItem);
        
        }
function getMatchedMenuItem (searchItem) {
var foundItems=[];
 var foundItems1=[];
 
  var promise = MenuSearchService.getDatafromserver();

  promise.then(function (response) {
       foundItems1 =response.data.menu_items;

        if (searchItem) {
       for(var i=0;i<foundItems1.length; i++){
           if (foundItems1[i].description.toLowerCase().indexOf(searchItem) != -1) {
            foundItems.push(foundItems1[i]);
                        
            }
         }
          MenuSearchService.storeMenu(foundItems);  
          list.menulist=foundItems;
         }
        else {
             list.error="none";
             }
         })
        .catch(function (error) { 
         console.log(error);
          });

} 
list.removeItem = function (itemIndex) {
 MenuSearchService.remove(itemIndex);
     MenuSearchService.storeMenu(menu);   
   list.menulist=MenuSearchService.getMenu();
  };

}

MenuSearchService.$inject = ['$http'];
function MenuSearchService($http) {
   var service = this;
   var itemlist=[];
  service.getDatafromserver= function () {
  var response= $http({
      method: "GET",
      url: ("https://davids-restaurant.herokuapp.com/menu_items.json")
    }); 
  return response;
};
service.remove = function (itemIndex) {
   itemlist.splice(itemIndex, 1);
  }; 

service.storeMenu = function(menu) {
  itemlist=menu;
  }
 
service.getMenu= function () {
     return itemlist;
} 
}

})();
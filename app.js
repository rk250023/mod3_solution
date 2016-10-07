(function () {
'use strict';
angular.module('NarrowItDownApp', [])
.controller('NarrowItDownController', NarrowItDownController)
.service('MenuSearchService', MenuSearchService)
.directive('foundItem', foundItemDirective);

function foundItemDirective() {
  var ddo = {
    templateUrl: 'menuList.html',
    scope: {
      items: '<',
      Mystatus:'@status',
       onRemove: '&'
    },
      controller: foundItemDirectiveController,
    controllerAs: 'list',
    bindToController: true

   };
   
  return ddo;
}

function foundItemDirectiveController() {
  var list = this;
      list.Mystatus="";
   
}


NarrowItDownController.$inject = ['MenuSearchService'];

function NarrowItDownController(MenuSearchService) {
      var list=this;
            list.choice="";
            list.menulist="";
             list.found="";
         list.search = function () {
           list.found="";
       var searchItem= list.choice;
   getMatchedMenuItem(searchItem);
        
        }
function getMatchedMenuItem (searchItem) {
var foundItems=[];
 var foundItems1=[]; 
 var FLAG="No";
  var promise = MenuSearchService.getDatafromserver();

  promise.then(function (response) {
       foundItems1 =response.data.menu_items;
               if (searchItem) {
       for(var i=0;i<foundItems1.length; i++){
           if (foundItems1[i].description.toLowerCase().indexOf(searchItem) != -1) {
            foundItems.push(foundItems1[i]);
             FLAG="YES";
                                    
            }
            
         }
          if (FLAG === "YES") {
          MenuSearchService.storeMenu(foundItems);  
          list.menulist=foundItems;
         }
          else {
              list.found="FALSE";
            console.log("Nothing found");
               }

        }
        else {
              list.found="FALSE";
               console.log("Nothing selected",list.found);
             }
         })
        .catch(function (error) { 
         console.log(error);
          });

} 
list.removeItem = function (itemIndex) {
 MenuSearchService.remove(itemIndex);
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
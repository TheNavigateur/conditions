module.exports = {

  containsIgnoreCase: function(targetString, searchTerm){
    return targetString && (!searchTerm || targetString.toLowerCase().indexOf(searchTerm.toLowerCase()) != -1);
  },

  arrayLengthOr0: function(arrayOrNothing){
    return arrayOrNothing ? (arrayOrNothing.length||0) : 0;
  },

  removeDuplicatesBy: function(keyFn, array) {
    var mySet = new Set();
    return array.filter(x => {
      var
        key = keyFn(x),
        isNew = !mySet.has(key)
      ;

      if (isNew){
        mySet.add(key);
      }

      return isNew;
    });
  }

};
